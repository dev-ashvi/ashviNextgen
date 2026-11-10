import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3100").replace(/\/$/, "");

for (const w of [1440, 375]) {
  const context = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  const failed = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  page.on("requestfailed", (r) => failed.push(`failed ${r.url()}`));
  await page.goto(`${base}/build`, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(700);

  const metrics = await page.evaluate(() => {
    const main = document.querySelector("main");
    const sections = [...main.querySelectorAll("section")].map((s) => ({
      id: s.getAttribute("aria-labelledby"),
      h: Math.round(s.getBoundingClientRect().height),
    }));
    return {
      sections,
      h1Count: document.querySelectorAll("h1").length,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      headerPresent: !!document.querySelector("header nav"),
      active: [...document.querySelectorAll('header a[aria-current="page"]')].map((a) => a.textContent.trim()),
      footerEmail: (document.querySelector("footer")?.innerText ?? "").includes("hello@ashvi.tech"),
      images: [...main.querySelectorAll("img")].map((i) => ({ src: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0 })),
      links: [...main.querySelectorAll("a")].map((a) => a.getAttribute("href")),
      anchorTarget: !!document.getElementById("how-we-build-together"),
    };
  });
  console.log(w, JSON.stringify({ ...metrics, consoleErrors: errors, failedRequests: failed }));
  await page.screenshot({ path: `scripts/perf-results/build-full-${w}.png`, fullPage: true });
  await page.locator("#build-hero-title").locator("xpath=ancestor::section[1]").screenshot({
    path: `scripts/perf-results/build-hero-${w}.png`,
  });
  await page.locator("#build-partnership-title").locator("xpath=ancestor::section[1]").screenshot({
    path: `scripts/perf-results/build-partnership-${w}.png`,
  });
  await context.close();
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const rp = await ctx.newPage();
await rp.goto(`${base}/research`, { waitUntil: "networkidle" });
await rp.screenshot({ path: "scripts/perf-results/research-full-1440-after-build.png", fullPage: true });
await ctx.close();

await browser.close();
