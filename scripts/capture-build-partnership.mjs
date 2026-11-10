import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3120").replace(/\/$/, "");

for (const w of [1440, 375]) {
  const context = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/build`, { waitUntil: "networkidle", timeout: 90000 });
  const section = page.locator("#how-we-build-together");
  await section.scrollIntoViewIfNeeded();
  // Wait for measured geometry + draw-once to finish (or stay static under reduced motion)
  await page.waitForTimeout(2200);
  await page.evaluate(() => {
    const s = document.getElementById("how-we-build-together");
    if (s) s.setAttribute("data-state", "drawn");
  });
  await page.waitForTimeout(200);

  const metrics = await section.evaluate((s) => {
    const paths = s.querySelectorAll("svg path").length;
    const dots = s.querySelectorAll('[data-dot]').length;
    const label = s.innerText.includes("Shared Venture");
    return {
      h: Math.round(s.getBoundingClientRect().height),
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      paths,
      dots,
      label,
      state: s.getAttribute("data-state"),
    };
  });
  console.log(w, JSON.stringify({ ...metrics, consoleErrors: errors }));
  await section.screenshot({ path: `scripts/perf-results/build-partnership-${w}.png` });
  await context.close();
}

await browser.close();
