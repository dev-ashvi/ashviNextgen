import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto(`${base}/about`, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(800);

const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const r = h1.getBoundingClientRect();
  return {
    text: h1.textContent.trim(),
    opacity: getComputedStyle(h1).opacity,
    color: getComputedStyle(h1).color,
    top: Math.round(r.top),
    visibleRatio: Math.min(r.bottom, innerHeight) - Math.max(r.top, 0),
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({
  path: "scripts/responsive-audit/sections/about-hero-375-verify.png",
  animations: "disabled",
  clip: { x: 0, y: 0, width: 375, height: 500 },
});

// Institution / shader section
await page.locator('[aria-labelledby="about-institution-title"]').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.locator('[aria-labelledby="about-institution-title"]').screenshot({
  path: "scripts/responsive-audit/sections/about-institution-375.png",
  animations: "disabled",
});

await browser.close();
