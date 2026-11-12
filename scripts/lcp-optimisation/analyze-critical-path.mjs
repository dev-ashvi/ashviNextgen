/**
 * Homepage HTML / font / LCP network analysis against a production server.
 */
import { writeFileSync, mkdirSync } from "fs";
import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3170").replace(/\/$/, "");
const outDir = "scripts/lcp-optimisation/analysis";
mkdirSync(outDir, { recursive: true });

const htmlRes = await fetch(`${base}/`);
const html = await htmlRes.text();
const htmlBytes = Buffer.byteLength(html, "utf8");

const patterns = [
  { name: "svg_tags", re: /<svg[\s\S]*?<\/svg>/gi },
  { name: "script_inline", re: /<script[^>]*>[\s\S]*?<\/script>/gi },
  { name: "style_inline", re: /<style[^>]*>[\s\S]*?<\/style>/gi },
  { name: "img_tags", re: /<img\b[^>]*>/gi },
  { name: "link_preload", re: /<link[^>]+rel=["']preload["'][^>]*>/gi },
  { name: "rsc_flightish", re: /self\.__next_f\.push\(|\$Sreact\.|\"children\":/g },
];

const breakdown = {
  htmlUtf8Bytes: htmlBytes,
  htmlUtf8KB: Math.round(htmlBytes / 1024),
  contentLengthHeader: htmlRes.headers.get("content-length"),
  contentEncoding: htmlRes.headers.get("content-encoding"),
  counts: {},
  sizes: {},
  preloads: [],
  fontFaces: [],
  sculptureMentions: [],
};

for (const { name, re } of patterns) {
  const matches = html.match(re) || [];
  breakdown.counts[name] = matches.length;
  breakdown.sizes[name + "_chars"] = matches.reduce((s, m) => s + m.length, 0);
}

breakdown.preloads = [...html.matchAll(/<link[^>]+rel=["']preload["'][^>]*>/gi)].map(
  (m) => m[0],
);
breakdown.sculptureMentions = [
  ...html.matchAll(/sculpture[^"'<\s]*/gi),
].map((m) => m[0]);
breakdown.fontFaces = [...html.matchAll(/@font-face\{[^}]+\}/g)].map((m) =>
  m[0].slice(0, 220),
);

// Rough SVG size ranking
const svgs = html.match(/<svg[\s\S]*?<\/svg>/gi) || [];
breakdown.largestSvgs = svgs
  .map((s, i) => ({
    i,
    chars: s.length,
    preview: s.slice(0, 120).replace(/\s+/g, " "),
  }))
  .sort((a, b) => b.chars - a.chars)
  .slice(0, 8);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
});

const network = [];
page.on("response", async (res) => {
  try {
    const req = res.request();
    const url = res.url();
    const headers = res.headers();
    let bodyLen = Number(headers["content-length"] || 0);
    if (!bodyLen) {
      try {
        bodyLen = (await res.body()).length;
      } catch {
        bodyLen = 0;
      }
    }
    network.push({
      url: url.replace(base, ""),
      type: req.resourceType(),
      status: res.status(),
      priority: req.headers()["priority"] || null,
      transferApprox: bodyLen,
      fromServiceWorker: false,
    });
  } catch {
    /* ignore */
  }
});

await page.addInitScript(() => {
  window.__lcp = [];
  window.__paint = {};
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__lcp.push({
          t: e.startTime,
          size: e.size,
          url: e.url || "",
          tag: e.element?.tagName,
          cls: e.element?.className,
        });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    /* ignore */
  }
});

await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(2000);

const perf = await page.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const paints = performance.getEntriesByType("paint");
  const resources = performance.getEntriesByType("resource").map((r) => ({
    name: r.name.replace(location.origin, ""),
    initiator: r.initiatorType,
    transferSize: r.transferSize,
    encodedBodySize: r.encodedBodySize,
    decodedBodySize: r.decodedBodySize,
    start: r.startTime,
    responseEnd: r.responseEnd,
    renderBlocking: r.renderBlockingStatus || null,
    deliveryType: r.deliveryType || null,
  }));
  const fonts = resources.filter(
    (r) =>
      r.name.includes(".woff") ||
      r.initiator === "css" && r.name.includes("font") ||
      /\.woff2?/.test(r.name),
  );
  const imgs = resources.filter(
    (r) => r.initiator === "img" || /sculpture|image/.test(r.name),
  );
  return {
    ttfb: nav?.responseStart,
    responseEnd: nav?.responseEnd,
    domContentLoaded: nav?.domContentLoadedEventEnd,
    loadEvent: nav?.loadEventEnd,
    paints: Object.fromEntries(paints.map((p) => [p.name, p.startTime])),
    lcp: window.__lcp,
    fonts,
    sculpture: imgs.filter((r) => /sculpture/.test(r.name)),
    css: resources.filter((r) => r.initiator === "link" || r.name.includes(".css")),
    totalFontTransfer: fonts.reduce((s, f) => s + (f.transferSize || 0), 0),
    totalCssTransfer: resources
      .filter((r) => r.name.includes(".css"))
      .reduce((s, f) => s + (f.transferSize || 0), 0),
  };
});

// Computed hero typography snapshot for visual fidelity checks later
const heroType = await page.evaluate(() => {
  const h1 = document.querySelector("#hero-title");
  if (!h1) return null;
  const cs = getComputedStyle(h1);
  const em = h1.querySelector("em");
  return {
    fontFamily: cs.fontFamily,
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    fontVariationSettings: cs.fontVariationSettings,
    italicFamily: em ? getComputedStyle(em).fontFamily : null,
    italicStyle: em ? getComputedStyle(em).fontStyle : null,
  };
});

const preloadInDom = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel="preload"]')].map((l) => ({
    as: l.getAttribute("as"),
    href: l.getAttribute("href"),
    type: l.getAttribute("type"),
    imageSrcSet: l.getAttribute("imagesrcset"),
    imageSizes: l.getAttribute("imagesizes"),
  })),
);

const report = { breakdown, perf, heroType, preloadInDom, networkTop: network
  .sort((a, b) => b.transferApprox - a.transferApprox)
  .slice(0, 20) };

writeFileSync(`${outDir}/critical-path.json`, JSON.stringify(report, null, 2));
writeFileSync(`${outDir}/home.html`, html);
console.log(
  JSON.stringify(
    {
      htmlKB: breakdown.htmlUtf8KB,
      svgChars: breakdown.sizes.svg_tags_chars,
      scriptChars: breakdown.sizes.script_inline_chars,
      styleChars: breakdown.sizes.style_inline_chars,
      largestSvgs: breakdown.largestSvgs.map((s) => ({
        chars: s.chars,
        preview: s.preview,
      })),
      preloads: breakdown.preloads.length,
      fontTransfer: perf.totalFontTransfer,
      ttfb: perf.ttfb,
      fcp: perf.paints["first-contentful-paint"],
      lcp: perf.lcp?.at(-1),
      heroType,
      sculpture: perf.sculpture,
      preloadInDom,
    },
    null,
    2,
  ),
);

await browser.close();
