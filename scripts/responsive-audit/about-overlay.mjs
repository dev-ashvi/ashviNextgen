import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  reducedMotion: "reduce",
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto(`${base}/about`, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const r = h1.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const topEl = document.elementFromPoint(cx, cy);
  const stack = [];
  let el = topEl;
  for (let i = 0; i < 8 && el; i++) {
    const s = getComputedStyle(el);
    stack.push({
      tag: el.tagName,
      id: el.id || null,
      cls: (el.className || "").toString().slice(0, 90),
      opacity: s.opacity,
      color: s.color,
      bg: s.backgroundColor,
      z: s.zIndex,
      mix: s.mixBlendMode,
      filter: s.filter,
      visibility: s.visibility,
    });
    el = el.parentElement;
  }
  return {
    h1Text: h1.textContent.trim(),
    h1Rect: { t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
    samplePoint: { cx: Math.round(cx), cy: Math.round(cy) },
    topTag: topEl?.tagName,
    topText: topEl?.textContent?.trim()?.slice(0, 80),
    stack,
    fonts: document.fonts.check('16px "Iowan Old Style"') || [...document.fonts].slice(0, 5).map((f) => f.family),
  };
});
console.log(JSON.stringify(info, null, 2));

// Force highlight for visual proof
await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  h1.style.outline = "3px solid red";
  h1.style.background = "yellow";
});
await page.screenshot({
  path: "scripts/responsive-audit/sections/about-hero-375-highlight.png",
  animations: "disabled",
  clip: { x: 0, y: 0, width: 375, height: 450 },
});

await browser.close();
