/** Capture transfer sizes via Playwright network for each page (mobile + desktop). */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3150").replace(/\/$/, "");
const outDir = "scripts/production-audit/network";
mkdirSync(outDir, { recursive: true });

const pages = ["/", "/build", "/transform", "/research", "/about", "/contact"];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const vp of viewports) {
  for (const p of pages) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.name === "mobile" ? 2 : 1,
      isMobile: vp.name === "mobile",
    });
    const page = await context.newPage();
    const resources = [];
    page.on("response", async (res) => {
      try {
        const req = res.request();
        const url = res.url();
        const headers = res.headers();
        const len = Number(headers["content-length"] || 0);
        let bodyLen = len;
        if (!bodyLen) {
          try {
            const buf = await res.body();
            bodyLen = buf.length;
          } catch {
            bodyLen = 0;
          }
        }
        resources.push({
          url,
          status: res.status(),
          type: req.resourceType(),
          transferApprox: bodyLen,
        });
      } catch {
        /* ignore */
      }
    });

    let status = 0;
    try {
      const resp = await page.goto(`${base}${p}`, { waitUntil: "networkidle", timeout: 60000 });
      status = resp?.status() || 0;
      await page.waitForTimeout(1500);
    } catch (e) {
      results.push({ page: p, viewport: vp.name, error: String(e) });
      await context.close();
      continue;
    }

    const total = resources.reduce((s, r) => s + (r.transferApprox || 0), 0);
    const js = resources
      .filter((r) => r.type === "script" || r.url.includes(".js"))
      .reduce((s, r) => s + (r.transferApprox || 0), 0);
    const img = resources
      .filter((r) => r.type === "image")
      .reduce((s, r) => s + (r.transferApprox || 0), 0);
    const largest = [...resources].sort((a, b) => b.transferApprox - a.transferApprox).slice(0, 8);

    results.push({
      page: p,
      viewport: vp.name,
      status,
      requestCount: resources.length,
      totalKB: Math.round(total / 1024),
      jsKB: Math.round(js / 1024),
      imageKB: Math.round(img / 1024),
      largest: largest.map((r) => ({
        kb: Math.round(r.transferApprox / 1024),
        type: r.type,
        status: r.status,
        url: r.url.replace(base, "").slice(0, 120),
      })),
    });
    await context.close();
  }
}

writeFileSync(`${outDir}/summary.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
