import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3000").replace(/\/$/, "");
const out = "scripts/responsive-audit/phase-2d-verify";
mkdirSync(out, { recursive: true });

const failures = [];
const results = {};
function fail(m) {
  failures.push(m);
  console.error("FAIL:", m);
}

const browser = await chromium.launch();

// M2 after
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/build`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.locator('[aria-labelledby="build-hero-title"]').screenshot({
    path: `${out}/m2-build-hero-375-after.png`,
    animations: "disabled",
  });
  const m2 = await page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="build-hero-title"]');
    const links = [...hero.querySelectorAll("a")];
    const last = links[links.length - 1]?.getBoundingClientRect();
    const img = hero.querySelector("img");
    const ir = img?.getBoundingClientRect();
    return {
      gap: last && ir ? Math.round(ir.top - last.bottom) : null,
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  results.m2 = m2;
  if (m2.gap == null || m2.gap > 80) fail(`M2 gap still large: ${m2.gap}`);
  if (m2.gap < 24) fail(`M2 gap too tight: ${m2.gap}`);
  console.log("ok M2", m2);
  await context.close();
}

// M5 after reduce
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const section = page.locator('[aria-labelledby="about-institution-title"]');
  await section.scrollIntoViewIfNeeded();
  await section.screenshot({ path: `${out}/m5-institution-375-after.png`, animations: "allow" });
  const m5 = await page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="about-institution-title"]');
    const hidden = [...section.querySelectorAll(".ashvi-reveal")].filter(
      (el) => Number.parseFloat(getComputedStyle(el).opacity) < 0.5,
    ).length;
    return {
      hidden,
      sectionH: Math.round(section.getBoundingClientRect().height),
    };
  });
  results.m5 = m5;
  if (m5.hidden > 0) fail(`M5 hidden reveals under reduce: ${m5.hidden}`);
  console.log("ok M5", m5);
  await context.close();
}

// Prior phase smokes
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.click('button[aria-controls="mobile-menu"]');
  await page.waitForTimeout(200);
  const menuH = await page.evaluate(() =>
    Math.round(document.getElementById("mobile-menu").getBoundingClientRect().height),
  );
  if (menuH < 200) fail(`C1 menu h=${menuH}`);
  else console.log("ok C1", menuH);

  await page.goto(`${base}/transform`, { waitUntil: "networkidle" });
  const tr = await page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const img = [...hero.querySelectorAll("img")].find((i) => {
      const r = i.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    const r = img.getBoundingClientRect();
    return { h: Math.round(r.height), w: Math.round(r.width) };
  });
  if (tr.h < 240) fail(`H3 sculpture h=${tr.h}`);
  else console.log("ok H3", tr);

  await page.goto(`${base}/build`, { waitUntil: "networkidle" });
  const journey = await page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="build-journey-title"]');
    const horiz = [...section.querySelectorAll("div")].find((d) =>
      d.className.toString().includes("lg:block"),
    );
    return getComputedStyle(horiz).display;
  });
  if (journey !== "none") fail(`H4 @375 expected vertical, got ${journey}`);
  else console.log("ok H4");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const desk = await page.evaluate(() => {
    const burger = document.querySelector('button[aria-controls="mobile-menu"]');
    return getComputedStyle(burger).display;
  });
  if (desk !== "none") fail("desktop burger visible");
  else console.log("ok desktop");

  results.smokes = { menuH, tr, journey, desk };
  await context.close();
}

writeFileSync(`${out}/regression.json`, JSON.stringify({ failures, results }, null, 2));
await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log("\nPhase 2D regression passed.");
