import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
const browser = await chromium.launch();

async function check(path, reducedMotion) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion,
  });
  const page = await context.newPage();
  await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = [...document.querySelectorAll('[class*="opacity-0"], [class*="opacity-100"]')]
      .filter((el) => /opacity-0|opacity-100/.test(el.className.toString()))
      .slice(0, 12)
      .map((el) => ({
        opacity: getComputedStyle(el).opacity,
        cls: el.className.toString().match(/opacity-\d+|translate[^ ]*/g),
        text: el.textContent.trim().slice(0, 40),
      }));
    const hiddenCount = reveals.filter((r) => r.opacity === "0").length;
    return { mq, revealSample: reveals, hiddenCount, totalSampled: reveals.length };
  });
  console.log(path, reducedMotion, JSON.stringify(info, null, 2));
  await context.close();
  return info;
}

await check("/about", "reduce");
await check("/about", "no-preference");
await check("/", "reduce");
await check("/", "no-preference");
await browser.close();
