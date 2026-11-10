import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3125").replace(/\/$/, "");

for (const w of [1920, 1440, 1280, 1024, 768, 390, 375]) {
  const context = await browser.newContext({
    viewport: { width: w, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${base}/transform`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(500);

  const metrics = await page.evaluate((vw) => {
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const h1 = document.querySelector("#tr-hero-title");
    const p = hero.querySelector("p.mt-6");
    const ctas = [...hero.querySelectorAll("a")].filter((a) => a.closest("[aria-labelledby]") || true).slice(0, 2);
    // Prefer the desktop art column; fall back to the stacked mobile frame
    const artCol =
      hero.querySelector(vw >= 1024 ? '[data-hero-art="desktop"]' : '[data-hero-art="mobile"]');
    const artFrame = artCol?.getBoundingClientRect();
    const textEls = [h1, p, ...ctas].filter(Boolean);
    const textRight = Math.max(...textEls.map((el) => el.getBoundingClientRect().right));
    const textBottom = Math.max(...textEls.map((el) => el.getBoundingClientRect().bottom));

    let overlapsText = false;
    if (artFrame && artFrame.width > 0) {
      if (vw >= 1024) {
        overlapsText = textRight > artFrame.left + 2;
      } else {
        overlapsText = textBottom > artFrame.top + 2;
      }
    }

    const header = document.querySelector("header");
    const lh = h1 ? parseFloat(getComputedStyle(h1).lineHeight) : 1;
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      headerBg: header ? getComputedStyle(header).backgroundColor : null,
      h1Lines: h1 ? Math.round(h1.getBoundingClientRect().height / lh) : null,
      ctaRow: ctas.length === 2 ? Math.abs(ctas[0].getBoundingClientRect().top - ctas[1].getBoundingClientRect().top) < 10 : null,
      overlapsText,
      gap: artFrame && vw >= 1024 ? Math.round(artFrame.left - textRight) : null,
      artW: artFrame ? Math.round(artFrame.width) : null,
      heroH: Math.round(hero.getBoundingClientRect().height),
    };
  }, w);

  const clip = await page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const bottom = Math.ceil(hero.getBoundingClientRect().bottom + 4);
    return { x: 0, y: 0, width: window.innerWidth, height: Math.min(window.innerHeight, Math.max(bottom, 200)) };
  });

  console.log(w, JSON.stringify({ ...metrics, consoleErrors: errors }));
  await page.screenshot({
    path: `scripts/perf-results/transform-hero-${w}.png`,
    clip,
    animations: "disabled",
  });
  await context.close();
}

await browser.close();
