import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3122").replace(/\/$/, "");

for (const w of [1440, 375]) {
  const context = await browser.newContext({
    viewport: { width: w, height: w === 375 ? 1400 : 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${base}/build`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    const p = document.getElementById("how-we-build-together");
    if (p) p.setAttribute("data-state", "drawn");
  });
  await page.waitForTimeout(1200);

  const section = page.locator('[aria-labelledby="build-wyz-title"]');
  await section.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(300);

  const metrics = await section.evaluate((s) => {
    const logo = s.querySelector('img[src*="wyz-logo"]');
    const screen = s.querySelector('img[src*="wyz-revenue-margin"]');
    const link = s.querySelector('a[href*="financewyz"]');
    return {
      h: Math.round(s.getBoundingClientRect().height),
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      logo: logo?.getAttribute("src") || null,
      screenW: screen ? Math.round(screen.getBoundingClientRect().width) : null,
      linkText: link?.textContent?.replace(/\s+/g, " ").trim() || null,
      caption: s.innerText.includes("Illustrative demo data"),
    };
  });

  console.log(w, JSON.stringify({ ...metrics, consoleErrors: errors }));
  await section.screenshot({
    path: `scripts/perf-results/build-wyz-${w}.png`,
    animations: "disabled",
  });
  await context.close();
}

await browser.close();
