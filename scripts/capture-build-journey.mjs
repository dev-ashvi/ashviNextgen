import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3121").replace(/\/$/, "");

for (const w of [1440, 375]) {
  const context = await browser.newContext({
    viewport: { width: w, height: w === 375 ? 1400 : 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });

  await page.goto(`${base}/build`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    const p = document.getElementById("how-we-build-together");
    if (p) p.setAttribute("data-state", "drawn");
  });
  await page.waitForTimeout(1500);

  const before = await page.evaluate(() => {
    const s = document.querySelector('[aria-labelledby="build-journey-title"]');
    return Math.round(s.getBoundingClientRect().height);
  });

  const section = page.locator('[aria-labelledby="build-journey-title"]');
  await section.evaluate((el) => {
    el.scrollIntoView({ block: "start", inline: "nearest" });
  });
  await page.waitForTimeout(400);

  const after = await page.evaluate(() => {
    const s = document.querySelector('[aria-labelledby="build-journey-title"]');
    const r = s.getBoundingClientRect();
    return {
      h: Math.round(r.height),
      top: Math.round(r.top),
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      textOk: /Understand[\s\S]*Grow with/.test(s.innerText),
    };
  });

  console.log(w, JSON.stringify({ before, after, consoleErrors: errors }));

  // Prefer element screenshot; fall back to clip if height is sane
  if (after.h > 200 && after.h < 1200) {
    await section.screenshot({
      path: `scripts/perf-results/build-journey-${w}.png`,
      animations: "disabled",
      timeout: 10000,
    });
  } else {
    // Fallback: capture using pre-scroll height measurement via full-page crop math
    const clip = await page.evaluate((knownH) => {
      const s = document.querySelector('[aria-labelledby="build-journey-title"]');
      const r = s.getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top)),
        width: Math.min(Math.ceil(r.width), window.innerWidth),
        height: knownH,
      };
    }, before);
    await page.screenshot({
      path: `scripts/perf-results/build-journey-${w}.png`,
      clip,
      animations: "disabled",
    });
  }

  await context.close();
}

await browser.close();
