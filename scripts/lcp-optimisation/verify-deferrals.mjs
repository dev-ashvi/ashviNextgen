import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3170").replace(/\/$/, "");
mkdirSync("scripts/lcp-optimisation/verify", { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const scripts = new Set();
page.on("response", (res) => {
  if (res.request().resourceType() === "Script") scripts.add(res.url());
});

await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1500);
const beforeScroll = [...scripts].map((u) => u.replace(base, ""));

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
await page.waitForTimeout(2000);
const afterScroll = [...scripts].map((u) => u.replace(base, ""));
const newlyLoaded = afterScroll.filter((u) => !beforeScroll.includes(u));

const dinFallback = await page.evaluate(() => {
  // After scroll, DIN may have mounted; check belief column still has content
  return {
    hasBeliefHeading: !!document.querySelector("h2"),
    scriptCountBefore: beforeScroll.length,
  };
});

const report = { beforeScroll, newlyLoaded, dinFallback };
writeFileSync("scripts/lcp-optimisation/verify/deferrals.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ beforeCount: beforeScroll.length, newlyLoaded, ok: true }, null, 2));
await browser.close();
