import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3124").replace(/\/$/, "");

async function shot(w, height, name, locator) {
  const context = await browser.newContext({
    viewport: { width: w, height },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().includes("/transform")) errors.push(`${r.status()} ${r.url()}`);
  });

  await page.goto(`${base}/transform`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);

  if (locator === "full") {
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      title: document.querySelector("#tr-hero-title")?.textContent?.trim() || null,
      sections: document.querySelectorAll("section").length,
      heroImg: document.querySelector('img[src*="hero-sculpture"]')?.getAttribute("src") || null,
      contact: [...document.querySelectorAll('a[href="/contact"]')].length,
      approach: !!document.querySelector("#our-approach"),
    }));
    console.log(name, JSON.stringify({ ...metrics, consoleErrors: errors }));
    await page.screenshot({
      path: `scripts/perf-results/${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  } else {
    const section = page.locator(locator);
    await section.evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(200);
    const metrics = await section.evaluate((s) => ({
      h: Math.round(s.getBoundingClientRect().height),
      text: s.innerText.slice(0, 80).replace(/\s+/g, " "),
    }));
    console.log(name, JSON.stringify({ ...metrics, consoleErrors: errors }));
    await section.screenshot({
      path: `scripts/perf-results/${name}.png`,
      animations: "disabled",
    });
  }

  await context.close();
}

await shot(1440, 900, "transform-page-1440", "full");
await shot(1440, 900, "transform-hero-1440", '[aria-labelledby="tr-hero-title"]');
await shot(1440, 1000, "transform-where-1440", '[aria-labelledby="tr-where-title"]');
await shot(375, 900, "transform-page-375", "full");

await browser.close();
