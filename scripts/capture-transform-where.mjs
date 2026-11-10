import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3127").replace(/\/$/, "");

for (const w of [1440, 375]) {
  const context = await browser.newContext({
    viewport: { width: w, height: w === 375 ? 1200 : 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${base}/transform`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(600);

  const section = page.locator('[aria-labelledby="tr-where-title"]');
  await section.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(200);

  const metrics = await section.evaluate((s) => ({
    h: Math.round(s.getBoundingClientRect().height),
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    dims: ["Workflows", "Decisions", "Knowledge", "Operations"].every((t) => s.innerText.includes(t)),
    circles: s.querySelectorAll("svg circle").length,
  }));

  console.log(w, JSON.stringify({ ...metrics, consoleErrors: errors }));
  await section.screenshot({
    path: `scripts/perf-results/transform-where-${w}.png`,
    animations: "disabled",
  });
  await context.close();
}

await browser.close();
