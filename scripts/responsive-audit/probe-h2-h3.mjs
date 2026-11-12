import { chromium } from "playwright";
import { mkdirSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3141").replace(/\/$/, "");
const out = "scripts/responsive-audit/h2-h3-verify";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

// Baseline Transform hero mobile + desktop
for (const [w, h, name] of [
  [375, 812, "transform-hero-375-before"],
  [390, 844, "transform-hero-390-before"],
  [430, 932, "transform-hero-430-before"],
  [768, 1024, "transform-hero-768-before"],
  [1440, 900, "transform-hero-1440-before"],
]) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/transform`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const imgs = [...hero.querySelectorAll("img")].map((img) => {
      const r = img.getBoundingClientRect();
      const p = img.parentElement?.getBoundingClientRect();
      return {
        display: getComputedStyle(img).display,
        parentDisplay: getComputedStyle(img.parentElement).display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top),
        natural: `${img.naturalWidth}x${img.naturalHeight}`,
        parentW: p ? Math.round(p.width) : null,
        parentH: p ? Math.round(p.height) : null,
      };
    });
    return { heroH: Math.round(hero.getBoundingClientRect().height), imgs };
  });
  console.log(name, JSON.stringify(metrics));
  await page.locator('[aria-labelledby="tr-hero-title"]').screenshot({
    path: `${out}/${name}.png`,
    animations: "disabled",
  });
  await context.close();
}

// Identify wide SVGs on homepage
{
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  // Trigger DIN final if needed
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(400);

  const svgs = await page.evaluate(() => {
    return [...document.querySelectorAll("svg")].map((svg, i) => {
      const r = svg.getBoundingClientRect();
      const section = svg.closest("section");
      const parent = svg.parentElement;
      return {
        i,
        w: Math.round(r.width),
        h: Math.round(r.height),
        left: Math.round(r.left),
        top: Math.round(r.top),
        viewBox: svg.getAttribute("viewBox"),
        aria: svg.getAttribute("aria-label")?.slice(0, 60) || null,
        role: svg.getAttribute("role"),
        cls: (svg.getAttribute("class") || "").slice(0, 100),
        parentCls: (parent?.getAttribute("class") || "").slice(0, 80),
        sectionLabel: section?.getAttribute("aria-labelledby") || section?.id || null,
        sectionText: (section?.querySelector("h2,h1")?.textContent || "").trim().slice(0, 50),
        overflows: r.width > window.innerWidth + 2 || r.left < -2,
      };
    }).filter((s) => s.overflows || s.w > 400);
  });
  console.log("wide/overflow svgs", JSON.stringify(svgs, null, 2));

  // Crop belief + philosophy sections
  for (const sel of [
    '[aria-labelledby]',
  ]) {
    // find belief / philosophy by heading text
  }
  const belief = page.locator("section").filter({ hasText: "Technology is changing what a business can be" }).first();
  await belief.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await belief.screenshot({ path: `${out}/home-belief-375-before.png`, animations: "disabled" });

  const phil = page.locator("section").filter({ hasText: "Engineering Philosophy" }).first();
  if (await phil.count()) {
    await phil.scrollIntoViewIfNeeded();
    await phil.screenshot({ path: `${out}/home-philosophy-375-before.png`, animations: "disabled" });
  } else {
    const phil2 = page.locator("section").filter({ hasText: "Build for how the business works" }).first();
    await phil2.scrollIntoViewIfNeeded();
    await phil2.screenshot({ path: `${out}/home-philosophy-375-before.png`, animations: "disabled" });
  }

  const wwd = page.locator("#what-we-do");
  if (await wwd.count()) {
    await wwd.scrollIntoViewIfNeeded();
    await wwd.screenshot({ path: `${out}/home-wwd-375-before.png`, animations: "disabled" });
  }

  await context.close();
}

await browser.close();
