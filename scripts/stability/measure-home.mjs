/**
 * Controlled homepage mobile Lighthouse runs for Phase 3D stability.
 * Usage: CAPTURE_BASE=http://localhost:3180 LH_RUNS=5 node scripts/stability/measure-home.mjs [label]
 */
import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";

const base = (process.env.CAPTURE_BASE || "http://localhost:3180").replace(/\/$/, "");
const label = process.argv[2] || "run";
const runs = Number(process.env.LH_RUNS || 5);
const outDir = path.join("scripts/stability", label);
mkdirSync(outDir, { recursive: true });

function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function mean(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function stdev(nums) {
  if (nums.length < 2) return 0;
  const m = mean(nums);
  return Math.sqrt(nums.reduce((s, n) => s + (n - m) ** 2, 0) / (nums.length - 1));
}

function pick(report) {
  const a = report.audits || {};
  const c = report.categories || {};
  const network = a["network-requests"]?.details?.items || [];
  const jsBytes = network
    .filter((i) => i.resourceType === "Script" || String(i.url || "").includes(".js"))
    .reduce((sum, i) => sum + (i.transferSize || 0), 0);
  const doc = network.find((i) => i.resourceType === "Document");
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
    docTransferBytes: doc?.transferSize ?? null,
    bootup: (a["bootup-time"]?.details?.items || []).slice(0, 8),
    mainthread: a["mainthread-work-breakdown"]?.details?.items || [],
  };
}

const meta = {
  label,
  base,
  startedAt: new Date().toISOString(),
  node: process.version,
  lighthouse: "12.2.1",
  formFactor: "mobile",
  viewport: "390x844 (LH default mobile)",
  throttling: "Lighthouse default mobile (sim slow 4G + 4x CPU)",
  runsRequested: runs,
};

const results = [];
for (let i = 1; i <= runs; i++) {
  const outPath = path.join(outDir, `lh-run-${i}`);
  console.log(`[${label}] run ${i}/${runs}`);
  // brief cool-down between runs
  if (i > 1) spawnSync(process.execPath, ["-e", "Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,4000)"], { timeout: 10000 });

  const args = [
    "--yes",
    "lighthouse@12.2.1",
    `${base}/`,
    "--quiet",
    "--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
    "--only-categories=performance",
    "--form-factor=mobile",
    "--output=json",
    "--output=html",
    `--output-path=${outPath}`,
  ];
  const r = spawnSync("npx", args, { encoding: "utf8", shell: true, timeout: 240000 });
  if (r.status !== 0) {
    console.error((r.stderr || r.stdout || "").slice(-800));
    results.push({ run: i, error: true });
    continue;
  }
  const report = JSON.parse(readFileSync(`${outPath}.report.json`, "utf8"));
  const row = { run: i, ...pick(report) };
  results.push(row);
  console.log(
    JSON.stringify({
      run: i,
      perf: row.performance,
      lcp: row.lcp,
      fcp: row.fcp,
      tbt: row.tbt,
      cls: row.clsDisplay,
      docKB: row.docTransferBytes != null ? Math.round(row.docTransferBytes / 1024) : null,
      jsKB: row.jsTransferKB,
    }),
  );
}

const ok = results.filter((r) => !r.error);
const summary = {
  ...meta,
  finishedAt: new Date().toISOString(),
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
        docTransferBytes: median(ok.map((r) => r.docTransferBytes || 0)),
        networkRequests: median(ok.map((r) => r.networkRequests)),
      }
    : null,
  variability: ok.length
    ? {
        tbtMs: { min: Math.min(...ok.map((r) => r.tbtMs)), max: Math.max(...ok.map((r) => r.tbtMs)), mean: mean(ok.map((r) => r.tbtMs)), stdev: stdev(ok.map((r) => r.tbtMs)) },
        lcpMs: { min: Math.min(...ok.map((r) => r.lcpMs)), max: Math.max(...ok.map((r) => r.lcpMs)), mean: mean(ok.map((r) => r.lcpMs)), stdev: stdev(ok.map((r) => r.lcpMs)) },
        performance: { min: Math.min(...ok.map((r) => r.performance)), max: Math.max(...ok.map((r) => r.performance)), mean: mean(ok.map((r) => r.performance)), stdev: stdev(ok.map((r) => r.performance)) },
      }
    : null,
};

writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log("MEDIAN", JSON.stringify(summary.median, null, 2));
console.log("VARIABILITY", JSON.stringify(summary.variability, null, 2));
