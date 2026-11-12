/**
 * Homepage mobile Lighthouse + LCP element capture.
 * Usage: CAPTURE_BASE=http://localhost:3170 node scripts/lcp-optimisation/measure-home.mjs [label]
 */
import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";
import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3170").replace(/\/$/, "");
const label = process.argv[2] || "run";
const runs = Number(process.env.LH_RUNS || 3);
const outDir = path.join("scripts/lcp-optimisation", label);
mkdirSync(outDir, { recursive: true });

function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function pick(report) {
  const a = report.audits || {};
  const c = report.categories || {};
  const network = a["network-requests"]?.details?.items || [];
  const jsBytes = network
    .filter((i) => i.resourceType === "Script" || String(i.url || "").includes(".js"))
    .reduce((sum, i) => sum + (i.transferSize || 0), 0);
  return {
    performance: Math.round((c.performance?.score ?? 0) * 100),
    lcpMs: a["largest-contentful-paint"]?.numericValue,
    lcp: a["largest-contentful-paint"]?.displayValue,
    fcpMs: a["first-contentful-paint"]?.numericValue,
    fcp: a["first-contentful-paint"]?.displayValue,
    cls: a["cumulative-layout-shift"]?.numericValue,
    clsDisplay: a["cumulative-layout-shift"]?.displayValue,
    tbtMs: a["total-blocking-time"]?.numericValue,
    tbt: a["total-blocking-time"]?.displayValue,
    totalByteWeight: a["total-byte-weight"]?.numericValue,
    totalByteWeightDisplay: a["total-byte-weight"]?.displayValue,
    networkRequests: network.length,
    jsTransferBytes: jsBytes,
    jsTransferKB: Math.round(jsBytes / 1024),
    bootup: (a["bootup-time"]?.details?.items || []).slice(0, 6),
    mainthread: a["mainthread-work-breakdown"]?.details?.items || [],
  };
}

async function captureLcpElement() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__lcpEntries = [];
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__lcpEntries.push({
            startTime: e.startTime,
            size: e.size,
            url: e.url || "",
            tag: e.element?.tagName || null,
            id: e.element?.id || null,
            className: e.element?.className || null,
            text: (e.element?.textContent || "").trim().slice(0, 80),
          });
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* ignore */
    }
  });

  await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);
  const entries = await page.evaluate(() => window.__lcpEntries || []);
  const last = entries[entries.length - 1] || null;
  await page.screenshot({ path: path.join(outDir, "home-mobile.png"), fullPage: false });
  await browser.close();
  return { entries, lcpElement: last };
}

const results = [];
for (let i = 1; i <= runs; i++) {
  const outPath = path.join(outDir, `lh-run-${i}`);
  console.log(`[${label}] Lighthouse run ${i}/${runs}`);
  const args = [
    "--yes",
    "lighthouse@12.2.1",
    `${base}/`,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox --disable-gpu",
    "--only-categories=performance",
    "--form-factor=mobile",
    "--output=json",
    "--output=html",
    `--output-path=${outPath}`,
  ];
  const r = spawnSync("npx", args, { encoding: "utf8", shell: true, timeout: 180000 });
  if (r.status !== 0) {
    console.error(r.stderr?.slice(-600) || r.stdout?.slice(-600));
    results.push({ run: i, error: true });
    continue;
  }
  const report = JSON.parse(readFileSync(`${outPath}.report.json`, "utf8"));
  const row = { run: i, ...pick(report) };
  results.push(row);
  console.log(JSON.stringify({ run: i, perf: row.performance, lcp: row.lcp, tbt: row.tbt, cls: row.clsDisplay }));
}

const ok = results.filter((r) => !r.error);
const summary = {
  label,
  base,
  formFactor: "mobile",
  viewport: "390x844",
  throttling: "Lighthouse default mobile (simulated slow 4G + 4x CPU)",
  lighthouse: "12.2.1",
  runs: results,
  median: ok.length
    ? {
        performance: median(ok.map((r) => r.performance)),
        lcpMs: median(ok.map((r) => r.lcpMs)),
        fcpMs: median(ok.map((r) => r.fcpMs)),
        tbtMs: median(ok.map((r) => r.tbtMs)),
        cls: median(ok.map((r) => r.cls ?? 0)),
        totalByteWeight: median(ok.map((r) => r.totalByteWeight)),
        jsTransferKB: median(ok.map((r) => r.jsTransferKB)),
        networkRequests: median(ok.map((r) => r.networkRequests)),
      }
    : null,
};

const lcpInfo = await captureLcpElement();
summary.lcpElementProbe = lcpInfo;

writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log("MEDIAN", JSON.stringify(summary.median, null, 2));
console.log("LCP_ELEMENT", JSON.stringify(lcpInfo.lcpElement, null, 2));
