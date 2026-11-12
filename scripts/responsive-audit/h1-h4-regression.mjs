/**
 * Phase 2B — H1 / H4 browser checks.
 * Usage: CAPTURE_BASE=http://localhost:3140 node scripts/responsive-audit/h1-h4-regression.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3140").replace(/\/$/, "");
const outDir = "scripts/responsive-audit/h1-h4-verify";
mkdirSync(outDir, { recursive: true });

const failures = [];
const results = { base, anchors: [], journey: [], regressions: [] };

function fail(msg) {
  failures.push(msg);
  console.error("FAIL:", msg);
}

const browser = await chromium.launch();

async function measureAnchor(page, hashTargetId) {
  return page.evaluate((id) => {
    const header = document.querySelector("header");
    const target = document.getElementById(id);
    if (!header || !target) return { missing: true, id };
    const hr = header.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    const cs = getComputedStyle(target);
    const eyebrow = target.querySelector("p, .label, [class*='mono']");
    const heading = target.querySelector("h1, h2");
    const er = eyebrow?.getBoundingClientRect();
    const hdr = heading?.getBoundingClientRect();
    return {
      missing: false,
      id,
      headerBottom: Math.round(hr.bottom),
      targetTop: Math.round(tr.top),
      gap: Math.round(tr.top - hr.bottom),
      covered: tr.top < hr.bottom - 1,
      scrollMarginTop: cs.scrollMarginTop,
      eyebrowTop: er ? Math.round(er.top) : null,
      eyebrowCovered: er ? er.top < hr.bottom - 1 : null,
      headingTop: hdr ? Math.round(hdr.top) : null,
      headingCovered: hdr ? hdr.top < hr.bottom - 1 : null,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  }, hashTargetId);
}

const anchorCases = [
  { path: "/#our-work", id: "our-work", widths: [375, 768, 1440] },
  { path: "/build#how-we-build-together", id: "how-we-build-together", widths: [375, 768, 1440] },
  { path: "/transform#our-approach", id: "our-approach", widths: [375, 768, 1440] },
  { path: "/transform#our-partnership", id: "our-partnership", widths: [375, 768, 1440] },
];

for (const { path, id, widths } of anchorCases) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 900 : 812 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(700);
    const m = await measureAnchor(page, id);
    const label = `H1 ${path} @${width}`;
    results.anchors.push({ label, ...m });
    if (m.missing) fail(`${label}: target missing`);
    else {
      if (m.covered) fail(`${label}: section top covered (gap ${m.gap})`);
      if (m.gap < 12) fail(`${label}: insufficient air below header (gap ${m.gap})`);
      if (m.eyebrowCovered) fail(`${label}: eyebrow covered`);
      if (m.headingCovered) fail(`${label}: heading covered`);
      if (m.overflowX) fail(`${label}: horizontal overflow`);
    }
    console.log("ok", label, `gap=${m.gap} margin=${m.scrollMarginTop}`);

    // Cross-route hash: land on home then go to build hash
    if (path.startsWith("/build") && width === 375) {
      await page.goto(`${base}/`, { waitUntil: "networkidle" });
      await page.goto(`${base}/build#how-we-build-together`, { waitUntil: "networkidle" });
      await page.waitForTimeout(700);
      const cross = await measureAnchor(page, id);
      results.anchors.push({ label: `${label} cross-route`, ...cross });
      if (cross.covered || cross.gap < 12) fail(`${label} cross-route: gap ${cross.gap}`);
      else console.log("ok", `${label} cross-route`, `gap=${cross.gap}`);
    }

    if (width === 375 && id === "how-we-build-together") {
      await page.screenshot({
        path: `${outDir}/build-partnership-anchor-375.png`,
        animations: "disabled",
      });
    }
    if (width === 375 && id === "our-work") {
      await page.screenshot({
        path: `${outDir}/our-work-anchor-375.png`,
        animations: "disabled",
      });
    }

    await context.close();
  }
}

// Journey layout visibility by breakpoint
for (const width of [375, 768, 1024, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: width >= 1024 ? 900 : 1024 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/build`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);
  await page.locator("#build-journey-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const layout = await page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="build-journey-title"]');
    const horizontal = section?.querySelector(".hidden.lg\\:block, [class*='hidden'][class*='lg:block']");
    // Find by structure: grid-cols-5 = horizontal; flex gap timeline = vertical
    const horizontalOl = section?.querySelector("ol.grid, ol.relative.grid");
    const allOls = [...(section?.querySelectorAll("ol") ?? [])];
    const displays = allOls.map((ol) => ({
      display: getComputedStyle(ol).display,
      cols: getComputedStyle(ol).gridTemplateColumns,
      isGrid: getComputedStyle(ol).display === "grid",
      text: ol.querySelector("h3")?.textContent?.trim().slice(0, 40),
    }));
    // Parent of horizontal grid
    const horizWrap = [...section.querySelectorAll("div")].find((d) =>
      d.className.toString().includes("lg:block"),
    );
    const vertOl = [...section.querySelectorAll("ol")].find((ol) =>
      ol.className.toString().includes("lg:hidden"),
    );
    return {
      horizWrapDisplay: horizWrap ? getComputedStyle(horizWrap).display : null,
      vertOlDisplay: vertOl ? getComputedStyle(vertOl).display : null,
      displays,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  const expectHorizontal = width >= 1024;
  const label = `H4 journey @${width}`;
  results.journey.push({ label, expectHorizontal, ...layout });

  if (expectHorizontal) {
    if (layout.horizWrapDisplay !== "block") fail(`${label}: expected horizontal wrap visible`);
    if (layout.vertOlDisplay !== "none") fail(`${label}: expected vertical ol hidden`);
  } else {
    if (layout.horizWrapDisplay !== "none") fail(`${label}: expected horizontal wrap hidden`);
    if (layout.vertOlDisplay === "none") fail(`${label}: expected vertical ol visible`);
  }
  if (layout.overflowX) fail(`${label}: horizontal overflow`);

  await page.locator('[aria-labelledby="build-journey-title"]').screenshot({
    path: `${outDir}/build-journey-${width}.png`,
    animations: "disabled",
  });
  console.log("ok", label, layout.horizWrapDisplay, layout.vertOlDisplay);
  await context.close();
}

// Light C1/C2 smoke
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.click('button[aria-controls="mobile-menu"]');
  await page.waitForTimeout(200);
  const menu = await page.evaluate(() => {
    const m = document.getElementById("mobile-menu");
    const r = m.getBoundingClientRect();
    return { h: Math.round(r.height), parent: m.parentElement?.tagName, hidden: m.hidden };
  });
  results.regressions.push({ c1: menu });
  if (menu.h < 200 || menu.parent !== "BODY" || menu.hidden) fail(`C1 smoke failed: ${JSON.stringify(menu)}`);
  else console.log("ok C1 smoke", menu);

  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const c2 = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll(".ashvi-reveal")].filter(
      (el) => Number.parseFloat(getComputedStyle(el).opacity) < 0.5,
    ).length;
    return { hidden };
  });
  results.regressions.push({ c2 });
  if (c2.hidden > 0) fail(`C2 smoke: ${c2.hidden} reveals still hidden`);
  else console.log("ok C2 smoke");

  // Desktop nav unchanged
  await context.close();
}
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const desk = await page.evaluate(() => {
    const burger = document.querySelector('button[aria-controls="mobile-menu"]');
    return {
      burgerDisplay: burger ? getComputedStyle(burger).display : null,
      hasWwd: !!document.querySelector('button[aria-haspopup="menu"]'),
    };
  });
  results.regressions.push({ desktop: desk });
  if (desk.burgerDisplay !== "none" || !desk.hasWwd) fail(`desktop smoke: ${JSON.stringify(desk)}`);
  else console.log("ok desktop smoke", desk);
  await page.screenshot({
    path: `${outDir}/desktop-header-1440.png`,
    animations: "disabled",
    clip: { x: 0, y: 0, width: 1440, height: 120 },
  });
  await context.close();
}

writeFileSync(`${outDir}/results.json`, JSON.stringify({ failures, results }, null, 2));
await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log("\nH1/H4 regression passed.");
