import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3126").replace(/\/$/, "");
const tag = process.env.CAPTURE_TAG || "before";

for (const w of [1440, 375]) {
  const context = await browser.newContext({
    viewport: { width: w, height: w === 375 ? 900 : 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${base}/transform`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(800);

  const metrics = await page.evaluate(() => {
    const header = document.querySelector("header");
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const hr = header?.getBoundingClientRect();
    const er = hero?.getBoundingClientRect();
    const hs = header ? getComputedStyle(header) : null;
    return {
      headerH: hr ? Math.round(hr.height) : null,
      headerBg: hs?.backgroundColor || null,
      headerTop: hr ? Math.round(hr.top) : null,
      heroTop: er ? Math.round(er.top) : null,
      heroH: er ? Math.round(er.height) : null,
      gap: hr && er ? Math.round(er.top - hr.bottom) : null,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  console.log(w, tag, JSON.stringify({ ...metrics, consoleErrors: errors }));

  // Capture header + hero together for comparison
  const clip = await page.evaluate(() => {
    const header = document.querySelector("header");
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const top = 0;
    const bottom = Math.ceil(hero.getBoundingClientRect().bottom);
    return {
      x: 0,
      y: top,
      width: window.innerWidth,
      height: Math.min(bottom, window.innerHeight),
    };
  });

  await page.screenshot({
    path: `scripts/perf-results/transform-header-hero-${tag}-${w}.png`,
    clip,
    animations: "disabled",
  });

  if (w === 1440) {
    const hero = page.locator('[aria-labelledby="tr-hero-title"]');
    await hero.screenshot({
      path: `scripts/perf-results/transform-hero-only-${tag}-1440.png`,
      animations: "disabled",
    });
  }

  await context.close();
}

await browser.close();
