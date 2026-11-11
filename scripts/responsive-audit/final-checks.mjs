import { chromium } from "playwright";
import { writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
const browser = await chromium.launch();
const findings = {};

async function withPage(width, height, reducedMotion, fn) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const result = await fn(page);
  await context.close();
  return { ...result, errors };
}

// Reduced-motion reveal bug confirmation
findings.aboutReduce = await withPage(375, 812, "reduce", async (page) => {
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  return page.evaluate(() => {
    const wrap = document.querySelector("h1")?.parentElement;
    return {
      mq: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      wrapOpacity: wrap ? getComputedStyle(wrap).opacity : null,
      wrapHasOpacity0: wrap?.className?.toString().includes("opacity-0") ?? null,
      wrapHasOpacity100: wrap?.className?.toString().includes("opacity-100") ?? null,
    };
  });
});

// Correct visual captures without reduced motion + scroll triggers
findings.aboutOk = await withPage(375, 812, "no-preference", async (page) => {
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  for (let y = 0; y < 4500; y += 350) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({
    path: "scripts/responsive-audit/sections/about-hero-375-visible.png",
    animations: "allow",
    clip: { x: 0, y: 0, width: 375, height: 520 },
  });
  await page.locator('[aria-labelledby="about-institution-title"]').screenshot({
    path: "scripts/responsive-audit/sections/about-institution-375-visible.png",
    animations: "allow",
  });
  await page.locator('[aria-labelledby="about-long-view-title"]').screenshot({
    path: "scripts/responsive-audit/sections/about-long-view-375-visible.png",
    animations: "allow",
  });
  return page.evaluate(() => ({
    h1Opacity: getComputedStyle(document.querySelector("h1").parentElement).opacity,
  }));
});

// Home hero card vs CTA gap at multiple widths
findings.homeHeroGaps = {};
for (const w of [375, 390, 430, 768]) {
  findings.homeHeroGaps[w] = await withPage(w, 900, "no-preference", async (page) => {
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    return page.evaluate(() => {
      const card = [...document.querySelectorAll("div")].find((el) => {
        const t = (el.textContent || "").trim();
        return /^Build\s*[×x]\s*Transform/i.test(t) && t.length < 80;
      });
      const cta = [...document.querySelectorAll("a")].find((a) =>
        /What We Do/i.test(a.textContent || ""),
      );
      const cr = card?.getBoundingClientRect();
      const br = cta?.getBoundingClientRect();
      return {
        ctaBottom: br ? Math.round(br.bottom) : null,
        cardTop: cr ? Math.round(cr.top) : null,
        gap: cr && br ? Math.round(cr.top - br.bottom) : null,
        overlap: cr && br ? cr.top < br.bottom - 2 : null,
      };
    });
  });
}

// Hash scroll under sticky header
findings.hashScroll = await withPage(375, 812, "no-preference", async (page) => {
  await page.goto(`${base}/#our-work`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  return page.evaluate(() => {
    const section = document.getElementById("our-work");
    const header = document.querySelector("header");
    const sr = section.getBoundingClientRect();
    const hr = header.getBoundingClientRect();
    return {
      headerBottom: Math.round(hr.bottom),
      sectionTop: Math.round(sr.top),
      covered: sr.top < hr.bottom - 2,
      gap: Math.round(sr.top - hr.bottom),
    };
  });
});

// Build partnership hash
findings.buildHash = await withPage(375, 812, "no-preference", async (page) => {
  await page.goto(`${base}/build#how-we-build-together`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  return page.evaluate(() => {
    const title = document.getElementById("build-partnership-title");
    const header = document.querySelector("header");
    const tr = title.getBoundingClientRect();
    const hr = header.getBoundingClientRect();
    return {
      headerBottom: Math.round(hr.bottom),
      titleTop: Math.round(tr.top),
      covered: tr.top < hr.bottom - 2,
      gap: Math.round(tr.top - hr.bottom),
    };
  });
});

writeFileSync("scripts/responsive-audit/final-checks.json", JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings, null, 2));
await browser.close();
