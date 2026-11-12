/**
 * Phase 2C — H2 / H3 browser checks.
 * Usage: CAPTURE_BASE=http://localhost:3142 node scripts/responsive-audit/h2-h3-regression.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3142").replace(/\/$/, "");
const outDir = "scripts/responsive-audit/h2-h3-verify";
mkdirSync(outDir, { recursive: true });

const failures = [];
const results = { base, transform: [], home: [], regressions: [] };

function fail(msg) {
  failures.push(msg);
  console.error("FAIL:", msg);
}

const browser = await chromium.launch();

// ——— H3 Transform sculpture presence ———
for (const [width, height] of [
  [375, 812],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1440, 900],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/transform`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);

  const m = await page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const h1 = document.getElementById("tr-hero-title");
    const ctas = [...hero.querySelectorAll("a")];
    const imgs = [...hero.querySelectorAll("img")].map((img) => {
      const r = img.getBoundingClientRect();
      return {
        display: getComputedStyle(img).display,
        parentDisplay: getComputedStyle(img.parentElement).display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
      };
    });
    const visible = imgs.filter((i) => i.w > 0 && i.h > 0 && i.parentDisplay !== "none");
    const hr = h1.getBoundingClientRect();
    const lastCta = ctas[ctas.length - 1]?.getBoundingClientRect();
    const art = visible[0];
    const ctaBottom = lastCta ? Math.round(lastCta.bottom) : null;
    const ctaRight = lastCta ? Math.round(lastCta.right) : null;
    // Stacked mobile: art must sit below CTAs. Desktop: art sits to the right (Y overlap is intentional).
    const stackedOverlap =
      art && ctaBottom != null
        ? art.top < ctaBottom - 4 && art.left < (ctaRight ?? 0) + 40
        : false;
    return {
      heroH: Math.round(hero.getBoundingClientRect().height),
      h1Bottom: Math.round(hr.bottom),
      ctaBottom,
      art,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      stackedOverlap,
    };
  });

  const label = `H3 transform @${width}`;
  results.transform.push({ label, ...m });

  if (!m.art) fail(`${label}: no visible sculpture`);
  else {
    if (width < 768 && m.art.h < 240) fail(`${label}: sculpture height ${m.art.h} < 240 (still a thin strip)`);
    if (width >= 768 && width < 1024 && m.art.h < 280) fail(`${label}: tablet sculpture unexpectedly short (${m.art.h})`);
    if (width >= 1440) {
      // Desktop absolute branch — expect large side sculpture, not the mobile strip.
      if (m.art.h < 350) fail(`${label}: desktop sculpture height regression (${m.art.h})`);
      if (m.art.w < 800) fail(`${label}: desktop sculpture width regression (${m.art.w})`);
    }
    if (width < 1024 && m.stackedOverlap) fail(`${label}: sculpture overlaps copy/CTAs`);
    if (m.overflowX) fail(`${label}: horizontal overflow`);
  }

  await page.locator('[aria-labelledby="tr-hero-title"]').screenshot({
    path: `${outDir}/transform-hero-${width}-after.png`,
    animations: "disabled",
  });
  console.log("ok", label, m.art);
  await context.close();
}

// ——— H2 homepage meaningful SVG labels ———
for (const width of [375, 430, 768, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/?din=1`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);

  const probe = await page.evaluate(() => {
    const vw = window.innerWidth;
    const phil = [...document.querySelectorAll("svg")].find((svg) =>
      (svg.getAttribute("aria-labelledby") || "").length > 0 ||
      (svg.getAttribute("class") || "").includes("touch-manipulation"),
    );
    const labels = phil
      ? [...phil.querySelectorAll("text")].map((t) => {
          const r = t.getBoundingClientRect();
          return {
            text: (t.textContent || "").trim().slice(0, 24),
            clipped: r.left < -1 || r.right > vw + 1,
          };
        })
      : [];
    const heroWide = [...document.querySelectorAll("svg")].filter((svg) => {
      const r = svg.getBoundingClientRect();
      return (svg.getAttribute("class") || "").includes("sculpt-shadow") || r.width > vw;
    });
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      philLabelCount: labels.length,
      philClipped: labels.filter((l) => l.clipped).length,
      heroWideCount: heroWide.length,
    };
  });

  const label = `H2 home @${width}`;
  results.home.push({ label, ...probe });
  if (probe.overflowX) fail(`${label}: document horizontal overflow`);
  if (probe.philClipped > 0) fail(`${label}: philosophy labels clipped (${probe.philClipped})`);
  console.log("ok", label, probe);

  const phil = page.locator("section").filter({ hasText: /Build for how the business works/i }).first();
  if (await phil.count()) {
    await phil.scrollIntoViewIfNeeded();
    await phil.screenshot({
      path: `${outDir}/home-philosophy-${width}-after.png`,
      animations: "disabled",
    });
  }

  await context.close();
}

// Prior-phase smoke
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.click('button[aria-controls="mobile-menu"]');
  await page.waitForTimeout(200);
  const menuH = await page.evaluate(() => Math.round(document.getElementById("mobile-menu").getBoundingClientRect().height));
  if (menuH < 200) fail(`C1 smoke: menu h=${menuH}`);
  else console.log("ok C1 smoke", menuH);

  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll(".ashvi-reveal")].filter(
        (el) => Number.parseFloat(getComputedStyle(el).opacity) < 0.5,
      ).length,
  );
  if (hidden > 0) fail(`C2 smoke: ${hidden} hidden reveals`);
  else console.log("ok C2 smoke");

  await page.goto(`${base}/build#how-we-build-together`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const gap = await page.evaluate(() => {
    const header = document.querySelector("header");
    const section = document.getElementById("how-we-build-together");
    return Math.round(section.getBoundingClientRect().top - header.getBoundingClientRect().bottom);
  });
  if (gap < 12) fail(`H1 smoke: gap ${gap}`);
  else console.log("ok H1 smoke", gap);

  await page.goto(`${base}/build`, { waitUntil: "networkidle" });
  const journey = await page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="build-journey-title"]');
    const horiz = [...section.querySelectorAll("div")].find((d) =>
      d.className.toString().includes("lg:block"),
    );
    return getComputedStyle(horiz).display;
  });
  // at 375 must be none
  if (journey !== "none") fail(`H4 smoke @375: expected vertical (horiz none), got ${journey}`);
  else console.log("ok H4 smoke");

  results.regressions.push({ menuH, hidden, gap, journey });
  await context.close();
}

writeFileSync(`${outDir}/results.json`, JSON.stringify({ failures, results }, null, 2));
await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log("\nH2/H3 regression passed.");
