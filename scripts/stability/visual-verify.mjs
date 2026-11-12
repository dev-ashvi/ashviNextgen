import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3180").replace(/\/$/, "");
mkdirSync("scripts/stability/visual", { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const report = { base, checks: [] };

async function check(name, fn) {
  try {
    const detail = await fn();
    report.checks.push({ name, ok: true, detail });
  } catch (e) {
    report.checks.push({ name, ok: false, error: String(e) });
  }
}

await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(800);

await check("hero-visible", async () => {
  const ok = await page.locator("img.sculpt-float").isVisible();
  if (!ok) throw new Error("sculpture missing");
  return { sculpture: true };
});

await check("din-mounts-on-scroll", async () => {
  await page.locator("text=Technology is changing what a business can be").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const svg = await page.locator('figure svg, figure [role="img"]').count();
  return { beliefVisualNodes: svg };
});

await check("engineering-philosophy", async () => {
  await page.getByRole("heading", { name: /build for how the business works/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const btn = page.locator('button[type="button"]', { hasText: /Design for Impact/i });
  if (await btn.count()) {
    await btn.first().click();
    await page.getByText(/define the outcomes that matter/i).first().waitFor({ timeout: 5000 });
  }
  return { accordion: true };
});

await check("research-landscape", async () => {
  await page.locator("#research").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const img = page.locator('#research img[src*="landscape"], #research svg');
  const n = await img.count();
  if (!n) throw new Error("landscape missing");
  const box = await img.first().boundingBox();
  return { count: n, height: box?.height ?? null };
});

await check("connect-globe-area", async () => {
  await page.locator("#connect").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  const section = page.locator("#connect");
  if (!(await section.isVisible())) throw new Error("connect hidden");
  // content-visibility should still allow visibility when scrolled into view
  const h2 = await page.getByRole("heading", { name: /let's build what comes next/i }).isVisible();
  return { headingVisible: h2 };
});

await check("reduced-motion-reveals", async () => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll(".ashvi-reveal")].filter(
        (el) => getComputedStyle(el).opacity === "0",
      ).length,
  );
  if (hidden > 0) throw new Error(`${hidden} hidden reveals`);
  return { hidden };
});

await check("content-visibility-text-accessible", async () => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  // Text content should exist in DOM even if cv-auto
  const texts = await page.evaluate(() => {
    const research = document.querySelector("#research")?.textContent || "";
    const connect = document.querySelector("#connect")?.textContent || "";
    return {
      researchHasAshvi: /Ashvi Research/i.test(research),
      connectHasBuild: /build what comes next/i.test(connect),
    };
  });
  if (!texts.researchHasAshvi || !texts.connectHasBuild) throw new Error(JSON.stringify(texts));
  return texts;
});

writeFileSync("scripts/stability/visual/report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (report.checks.some((c) => !c.ok)) process.exit(1);
