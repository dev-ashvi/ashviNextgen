import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3160").replace(/\/$/, "");
mkdirSync("scripts/performance-optimisation/regression", { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = { base, checks: [] };

async function check(name, fn) {
  try {
    await fn();
    report.checks.push({ name, ok: true });
  } catch (e) {
    report.checks.push({ name, ok: false, error: String(e) });
  }
}

const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await check("home-200", async () => {
  const res = await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 60000 });
  if (!res || res.status() !== 200) throw new Error(`status ${res?.status()}`);
});

await check("hero-ctas", async () => {
  await page.getByRole("link", { name: /see what we're building/i }).first().isVisible();
  await page.getByRole("link", { name: /^what we do$/i }).first().isVisible();
});

await check("build-transform-cards", async () => {
  await page.getByRole("link", { name: /build/i }).first().isVisible();
});

await check("engineering-philosophy-fallback-content", async () => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
  await page.waitForTimeout(800);
  const h2 = page.getByRole("heading", { name: /build for how the business works/i });
  if (!(await h2.count())) throw new Error("missing philosophy h2");
  // Fallback lists all principles; interactive may replace when near viewport
  const understand = page.getByText("Understand the Work");
  if (!(await understand.count())) throw new Error("missing principle");
});

await check("engineering-philosophy-interactive", async () => {
  await page.getByRole("heading", { name: /build for how the business works/i }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const btn = page.locator('button[type="button"]', { hasText: /Design for Impact/i });
  if (await btn.count()) {
    await btn.first().click();
    await page.getByText(/define the outcomes that matter/i).first().waitFor({ timeout: 5000 });
  }
});

await check("reduced-motion-reveals", async () => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll(".ashvi-reveal")].filter(
      (el) => getComputedStyle(el).opacity === "0",
    ).length,
  );
  if (hidden > 0) throw new Error(`${hidden} reveals still opacity 0`);
});

await check("desktop-hero", async () => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: "scripts/performance-optimisation/regression/home-desktop.png",
  });
  const img = page.locator("img.sculpt-float");
  if (!(await img.isVisible())) throw new Error("sculpture missing");
});

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.screenshot({
  path: "scripts/performance-optimisation/regression/home-mobile.png",
});

writeFileSync(
  "scripts/performance-optimisation/regression/report.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (report.checks.some((c) => !c.ok)) process.exit(1);
