import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  reducedMotion: "no-preference",
});
const page = await context.newPage();
await page.goto(`${base}/about`, { waitUntil: "networkidle", timeout: 90000 });

// Wait for reveals; scroll through page to trigger IO
for (let y = 0; y < 5000; y += 400) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(250);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);

const info = await page.evaluate(() => {
  const wraps = [...document.querySelectorAll('[class*="translate-y"]')].filter((el) =>
    /opacity-0|opacity-100/.test(el.className.toString()),
  );
  return {
    total: wraps.length,
    visible: wraps.filter((w) => getComputedStyle(w).opacity === "1").length,
    hidden: wraps.filter((w) => getComputedStyle(w).opacity === "0").length,
    samples: wraps.slice(0, 8).map((w) => ({
      opacity: getComputedStyle(w).opacity,
      text: w.textContent.trim().slice(0, 50),
    })),
  };
});
console.log(JSON.stringify(info, null, 2));

await page.screenshot({
  path: "scripts/responsive-audit/sections/about-hero-375-after-scroll.png",
  animations: "disabled",
  clip: { x: 0, y: 0, width: 375, height: 500 },
});

await browser.close();
