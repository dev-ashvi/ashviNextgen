/**
 * Production performance probe for homepage variants.
 * Usage: node scripts/perf-measure.mjs --label=A --url=http://127.0.0.1:4010/ [--mobile=true] [--runs=3] [--watchDin=true]
 */
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);

const label = args.label ?? "run";
const url = args.url ?? "http://127.0.0.1:4010/";
const mobile = args.mobile === "true";
const runs = Math.max(1, Number(args.runs ?? 3));
const watchDin = args.watchDin !== "false";

async function oneRun(browser) {
  const context = await browser.newContext(
    mobile
      ? {
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        }
      : { viewport: { width: 1440, height: 900 } },
  );
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__perf = { longTasks: [], lcp: null, cls: 0 };
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__perf.longTasks.push({
            start: e.startTime,
            duration: e.duration,
          });
        }
      }).observe({ type: "longtask", buffered: true });
    } catch {}
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__perf.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (!e.hadRecentInput) window.__perf.cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
  });

  const client = await context.newCDPSession(page);
  await client.send("Performance.enable");

  const response = await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(800);

  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const scripts = resources.filter((r) => r.initiatorType === "script");
    return {
      ttfb: n?.responseStart ?? null,
      domContentLoaded: n?.domContentLoadedEventEnd ?? null,
      loadEvent: n?.loadEventEnd ?? null,
      jsTransfer: scripts.reduce((s, r) => s + (r.transferSize || 0), 0),
      jsDecoded: scripts.reduce((s, r) => s + (r.decodedBodySize || 0), 0),
      scriptCount: scripts.length,
      hasDin: Boolean(document.querySelector("[data-din-stage]")),
    };
  });

  const afterLoad = await page.evaluate(() => ({
    lcp: window.__perf.lcp,
    cls: window.__perf.cls,
    longTasksTotal: window.__perf.longTasks.length,
    longTaskMsTotal: window.__perf.longTasks.reduce((s, t) => s + t.duration, 0),
    maxLongTaskMs: window.__perf.longTasks.reduce(
      (m, t) => Math.max(m, t.duration),
      0,
    ),
    mark: performance.now(),
  }));

  // Scroll sample
  await page.evaluate(async () => {
    const step = Math.max(180, Math.floor(document.body.scrollHeight / 14));
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r()));
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(400);

  const afterScroll = await page.evaluate((mark) => {
    const during = window.__perf.longTasks.filter((lt) => lt.start >= mark);
    return {
      longTasksDuringScroll: during.length,
      longTaskMsDuringScroll: during.reduce((s, t) => s + t.duration, 0),
      maxLongTaskMsDuringScroll: during.reduce(
        (m, t) => Math.max(m, t.duration),
        0,
      ),
    };
  }, afterLoad.mark);

  let duringDin = null;
  if (watchDin) {
    const dinExists = await page.evaluate(() =>
      Boolean(document.querySelector("[data-din-stage]")),
    );
    if (dinExists) {
      const mark = await page.evaluate(() => {
        const el = document.querySelector("[data-din-stage]");
        el?.scrollIntoView({ block: "center" });
        return performance.now();
      });
      // Watch through full ~5s sequence + settle
      await page.waitForTimeout(6200);
      duringDin = await page.evaluate((m) => {
        const during = window.__perf.longTasks.filter((lt) => lt.start >= m);
        return {
          longTasksDuringDin: during.length,
          longTaskMsDuringDin: during.reduce((s, t) => s + t.duration, 0),
          maxLongTaskMsDuringDin: during.reduce(
            (m2, t) => Math.max(m2, t.duration),
            0,
          ),
          label: document.querySelector("[data-din-label]")?.textContent ?? null,
        };
      }, mark);
    } else {
      duringDin = { skipped: true, reason: "no-din-in-dom" };
    }
  }

  const cdpMetrics = await client.send("Performance.getMetrics");
  const metricMap = Object.fromEntries(
    cdpMetrics.metrics.map((m) => [m.name, m.value]),
  );

  await context.close();

  return {
    status: response?.status() ?? 0,
    nav,
    lcp: afterLoad.lcp,
    cls: afterLoad.cls,
    longTasksTotal: afterLoad.longTasksTotal,
    longTaskMsTotal: afterLoad.longTaskMsTotal,
    maxLongTaskMs: afterLoad.maxLongTaskMs,
    afterScroll,
    duringDin,
    cdp: {
      JSHeapUsedSize: metricMap.JSHeapUsedSize,
      TaskDuration: metricMap.TaskDuration,
      ScriptDuration: metricMap.ScriptDuration,
      LayoutDuration: metricMap.LayoutDuration,
      RecalcStyleDuration: metricMap.RecalcStyleDuration,
    },
  };
}

function avg(nums) {
  const xs = nums.filter((n) => typeof n === "number" && !Number.isNaN(n));
  if (!xs.length) return null;
  return Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  // Warmup
  await oneRun(browser);

  const samples = [];
  for (let i = 0; i < runs; i++) {
    samples.push(await oneRun(browser));
  }
  await browser.close();

  const summary = {
    label,
    mobile,
    url,
    runs,
    averages: {
      ttfb: avg(samples.map((s) => s.nav.ttfb)),
      domContentLoaded: avg(samples.map((s) => s.nav.domContentLoaded)),
      loadEvent: avg(samples.map((s) => s.nav.loadEvent)),
      lcp: avg(samples.map((s) => s.lcp)),
      cls: avg(samples.map((s) => s.cls)),
      jsTransfer: avg(samples.map((s) => s.nav.jsTransfer)),
      jsDecoded: avg(samples.map((s) => s.nav.jsDecoded)),
      longTaskMsTotal: avg(samples.map((s) => s.longTaskMsTotal)),
      maxLongTaskMs: avg(samples.map((s) => s.maxLongTaskMs)),
      longTaskMsDuringScroll: avg(
        samples.map((s) => s.afterScroll.longTaskMsDuringScroll),
      ),
      longTaskMsDuringDin: avg(
        samples.map((s) => s.duringDin?.longTaskMsDuringDin),
      ),
      maxLongTaskMsDuringDin: avg(
        samples.map((s) => s.duringDin?.maxLongTaskMsDuringDin),
      ),
      scriptDuration: avg(samples.map((s) => s.cdp.ScriptDuration)),
      layoutDuration: avg(samples.map((s) => s.cdp.LayoutDuration)),
      heapUsed: avg(samples.map((s) => s.cdp.JSHeapUsedSize)),
      hasDin: samples.every((s) => s.nav.hasDin),
    },
    samples,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
