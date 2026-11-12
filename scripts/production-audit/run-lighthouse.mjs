import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";

const base = (process.env.CAPTURE_BASE || "http://localhost:3150").replace(/\/$/, "");
const outDir = "scripts/production-audit/lighthouse";
mkdirSync(outDir, { recursive: true });

const pages = ["/", "/build", "/transform", "/research", "/about", "/contact"];
const presets = ["mobile", "desktop"];

const summary = [];

for (const preset of presets) {
  for (const page of pages) {
    const slug = page === "/" ? "home" : page.slice(1);
    const outPath = path.join(outDir, `${slug}-${preset}`);
    const url = `${base}${page}`;
    console.log("LH", preset, url);

    const args = [
      "--yes",
      "lighthouse@12.2.1",
      url,
      "--quiet",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      "--output=html",
      `--output-path=${outPath}`,
      `--form-factor=${preset}`,
    ];
    if (preset === "desktop") args.push("--preset=desktop");

    const r = spawnSync("npx", args, {
      encoding: "utf8",
      shell: true,
      timeout: 180000,
    });

    if (r.status !== 0) {
      console.error("FAIL", url, (r.stderr || r.stdout || "").slice(-800));
      summary.push({ page, preset, error: (r.stderr || r.stdout || "").slice(-400) });
      continue;
    }

    try {
      const report = JSON.parse(readFileSync(`${outPath}.report.json`, "utf8"));
      const audits = report.audits || {};
      const cats = report.categories || {};
      const networkItems = audits["network-requests"]?.details?.items || [];
      const jsBytes = networkItems
        .filter((i) => (i.resourceType === "Script") || String(i.url || "").includes(".js"))
        .reduce((sum, i) => sum + (i.transferSize || 0), 0);

      const a11yFailures = (cats.accessibility?.auditRefs || [])
        .filter((ref) => {
          const a = audits[ref.id];
          return a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "manual" && a.scoreDisplayMode !== "notApplicable";
        })
        .map((ref) => ({
          id: ref.id,
          title: audits[ref.id]?.title,
          score: audits[ref.id]?.score,
          description: audits[ref.id]?.description?.slice(0, 180),
        }));

      const row = {
        page,
        preset,
        performance: Math.round((cats.performance?.score ?? 0) * 100),
        accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
        lcp: audits["largest-contentful-paint"]?.displayValue,
        lcpMs: audits["largest-contentful-paint"]?.numericValue,
        fcp: audits["first-contentful-paint"]?.displayValue,
        fcpMs: audits["first-contentful-paint"]?.numericValue,
        cls: audits["cumulative-layout-shift"]?.displayValue,
        clsScore: audits["cumulative-layout-shift"]?.numericValue,
        tbt: audits["total-blocking-time"]?.displayValue,
        tbtMs: audits["total-blocking-time"]?.numericValue,
        si: audits["speed-index"]?.displayValue,
        tti: audits["interactive"]?.displayValue,
        totalByteWeight: audits["total-byte-weight"]?.displayValue,
        totalByteWeightBytes: audits["total-byte-weight"]?.numericValue,
        networkRequests: networkItems.length,
        jsTransferBytes: jsBytes,
        jsTransferKB: Math.round(jsBytes / 1024),
        a11yFailures,
      };
      summary.push(row);
      console.log(
        JSON.stringify({
          page,
          preset,
          perf: row.performance,
          a11y: row.accessibility,
          lcp: row.lcp,
          cls: row.cls,
          tbt: row.tbt,
          bytes: row.totalByteWeight,
          jsKB: row.jsTransferKB,
          req: row.networkRequests,
        }),
      );
    } catch (e) {
      summary.push({ page, preset, parseError: String(e) });
    }
  }
}

writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log("Wrote", path.join(outDir, "summary.json"));
