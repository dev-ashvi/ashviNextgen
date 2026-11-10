import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3000").replace(/\/$/, "");

for (const w of [1440, 375]) {
  const context = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/build`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);
  const section = page.locator("#build-opportunity-title").locator("xpath=ancestor::section[1]");
  const metrics = await section.evaluate((s) => {
    const text = s.querySelector("#build-opportunity-title")?.closest("div")?.parentElement;
    return {
      h: Math.round(s.getBoundingClientRect().height),
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      terrain: !!s.querySelector("svg"),
    };
  });
  console.log(w, JSON.stringify(metrics));
  await section.screenshot({ path: `scripts/perf-results/build-opportunity-${w}.png` });
  await context.close();
}

await browser.close();
