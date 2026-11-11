/**
 * C1 / C2 browser regression checks (Playwright).
 * Usage: CAPTURE_BASE=http://localhost:3000 node scripts/responsive-audit/c1-c2-regression.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3000").replace(/\/$/, "");
const outDir = "scripts/responsive-audit/c1-c2-verify";
mkdirSync(outDir, { recursive: true });

const mobileWidths = [375, 390, 430, 768];
const menuRoutes = ["/", "/build", "/transform", "/contact"];
const revealRoutes = ["/", "/about", "/research", "/build", "/transform"];

const failures = [];
const results = { base, c1: [], c2: [], desktop: null };

function fail(msg) {
  failures.push(msg);
  console.error("FAIL:", msg);
}

const browser = await chromium.launch();

async function openMenu(page) {
  const btn = page.locator('button[aria-controls="mobile-menu"]');
  await btn.click();
  await page.waitForTimeout(200);
}

async function menuMetrics(page) {
  return page.evaluate(() => {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return { missing: true };
    const r = menu.getBoundingClientRect();
    const cs = getComputedStyle(menu);
    const links = [...menu.querySelectorAll("a")].map((a) => a.textContent.trim().slice(0, 24));
    const header = document.querySelector("header");
    const inHeader = !!(header && header.contains(menu));
    return {
      missing: false,
      hidden: menu.hidden,
      h: Math.round(r.height),
      w: Math.round(r.width),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      display: cs.display,
      opacity: cs.opacity,
      links,
      inHeader,
      bodyOverflow: document.body.style.overflow,
      parentTag: menu.parentElement?.tagName ?? null,
    };
  });
}

// ——— C1 ———
for (const width of mobileWidths) {
  for (const route of menuRoutes) {
    const context = await browser.newContext({
      viewport: { width, height: 812 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(300);

    // Scroll first — menu must still work after scroll (backdrop-blur on header).
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);
    await openMenu(page);

    const m = await menuMetrics(page);
    const id = `c1 ${route} @${width}`;
    results.c1.push({ id, ...m });

    if (m.missing) fail(`${id}: menu missing`);
    else {
      if (m.inHeader) fail(`${id}: menu still inside header containing block`);
      if (m.parentTag !== "BODY") fail(`${id}: expected portal parent BODY, got ${m.parentTag}`);
      if (m.hidden) fail(`${id}: menu still hidden`);
      if (m.h < 200) fail(`${id}: menu height ${m.h} < 200`);
      if (m.top !== 84) fail(`${id}: menu top ${m.top} (expected 84)`);
      if (!m.links.some((l) => /Build/i.test(l))) fail(`${id}: missing Build link`);
      if (!m.links.some((l) => /Transform/i.test(l))) fail(`${id}: missing Transform link`);
      if (m.bodyOverflow !== "hidden") fail(`${id}: body overflow not locked`);
    }

    // Escape closes + unlocks scroll
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
    const after = await menuMetrics(page);
    if (!after.hidden && after.h > 0) fail(`${id}: Escape did not close menu`);
    if (after.bodyOverflow === "hidden") fail(`${id}: body scroll still locked after Escape`);

    if (width === 375 && route === "/") {
      await openMenu(page);
      await page.screenshot({
        path: `${outDir}/mobile-menu-open-375.png`,
        animations: "disabled",
      });
      await page.keyboard.press("Escape");
    }

    await context.close();
    console.log("ok", id, m.h ? `h=${m.h}` : m);
  }
}

// ——— C2 ———
for (const route of revealRoutes) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(800);

  const probe = await page.evaluate(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const h1 = document.querySelector("h1");
    const reveals = [...document.querySelectorAll(".ashvi-reveal")];
    const hiddenReveals = reveals.filter((el) => {
      const o = getComputedStyle(el).opacity;
      return Number.parseFloat(o) < 0.5;
    });
    const h1Style = h1 ? getComputedStyle(h1) : null;
    // Walk ancestors for effective visibility
    let ancestorHidden = false;
    let el = h1;
    while (el) {
      const s = getComputedStyle(el);
      if (Number.parseFloat(s.opacity) < 0.5 || s.visibility === "hidden") {
        ancestorHidden = true;
        break;
      }
      el = el.parentElement;
    }
    return {
      mq,
      h1Text: h1?.textContent?.trim()?.slice(0, 80) ?? null,
      h1Opacity: h1Style?.opacity ?? null,
      ancestorHidden,
      revealCount: reveals.length,
      hiddenRevealCount: hiddenReveals.length,
      sampleHidden: hiddenReveals.slice(0, 3).map((el) => el.textContent.trim().slice(0, 40)),
    };
  });

  const id = `c2 reduce ${route}`;
  results.c2.push({ id, ...probe });
  if (!probe.mq) fail(`${id}: prefers-reduced-motion not active`);
  if (!probe.h1Text) fail(`${id}: missing h1`);
  if (probe.ancestorHidden) fail(`${id}: h1 ancestor effectively hidden`);
  if (probe.hiddenRevealCount > 0) {
    fail(`${id}: ${probe.hiddenRevealCount} .ashvi-reveal nodes still opacity<0.5 (${probe.sampleHidden.join(" | ")})`);
  }

  if (route === "/about") {
    await page.screenshot({
      path: `${outDir}/about-375-reduced-motion.png`,
      animations: "disabled",
      clip: { x: 0, y: 0, width: 375, height: 700 },
    });
  }

  await context.close();
  console.log("ok", id, `reveals=${probe.revealCount} hidden=${probe.hiddenRevealCount}`);
}

// Normal motion: reveals may start hidden offscreen; above-fold should become visible after IO
{
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(`${base}/about`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1200);
  const motion = await page.evaluate(() => {
    const wrap = document.querySelector("h1")?.closest(".ashvi-reveal");
    return {
      opacity: wrap ? getComputedStyle(wrap).opacity : null,
      hasVisibleClass: wrap?.classList.contains("ashvi-reveal--visible") ?? false,
    };
  });
  results.c2.push({ id: "c2 motion about hero", ...motion });
  if (Number.parseFloat(motion.opacity || "0") < 0.9) {
    fail(`c2 motion: about hero reveal opacity ${motion.opacity}`);
  }
  await context.close();
  console.log("ok c2 motion about hero", motion);
}

// ——— Desktop header unchanged @ 1440 ———
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);
  const desk = await page.evaluate(() => {
    const burger = document.querySelector('button[aria-controls="mobile-menu"]');
    const desktopNav = document.querySelector('nav[aria-label="Primary"] .hidden.lg\\:flex, nav[aria-label="Primary"] > div');
    const menu = document.getElementById("mobile-menu");
    return {
      burgerDisplay: burger ? getComputedStyle(burger).display : null,
      desktopNavDisplay: desktopNav ? getComputedStyle(desktopNav).display : null,
      menuHidden: menu?.hidden ?? null,
      hasWhatWeDo: !!document.querySelector('button[aria-haspopup="menu"]'),
    };
  });
  results.desktop = desk;
  if (desk.burgerDisplay !== "none") fail("desktop: burger should be hidden at 1440");
  if (desk.desktopNavDisplay !== "flex") fail("desktop: primary nav should be flex at 1440");
  if (desk.menuHidden !== true) fail("desktop: mobile menu should remain hidden");
  if (!desk.hasWhatWeDo) fail("desktop: What We Do control missing");

  await page.screenshot({
    path: `${outDir}/desktop-header-1440.png`,
    animations: "disabled",
    clip: { x: 0, y: 0, width: 1440, height: 120 },
  });
  await context.close();
  console.log("ok desktop 1440", desk);
}

writeFileSync(`${outDir}/results.json`, JSON.stringify({ failures, results }, null, 2));
await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log("\nC1/C2 regression passed.");
