import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3127").replace(/\/$/, "");

for (const w of [1440, 375]) {
  const context = await browser.newContext({
    viewport: { width: w, height: w === 375 ? 1600 : 1200 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${base}/transform`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(600);

  const section = page.locator('[aria-labelledby="tr-approach-title"]');
  await section.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(250);

  const metrics = await section.evaluate((s) => ({
    h: Math.round(s.getBoundingClientRect().height),
    stages: [...s.querySelectorAll("h3")].map((h) => h.textContent?.trim()),
    svgs: s.querySelectorAll("svg").length,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  console.log(w, JSON.stringify({ ...metrics, consoleErrors: errors }));

  await section.screenshot({
    path: `scripts/perf-results/transform-approach-${w}.png`,
    animations: "disabled",
  });
  await context.close();
}

await browser.close();
