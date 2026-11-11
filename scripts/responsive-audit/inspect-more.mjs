import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
mkdirSync("scripts/responsive-audit/sections", { recursive: true });
const browser = await chromium.launch();
const out = [];

async function run(path, width, height, name, fn) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    const p = document.getElementById("how-we-build-together");
    if (p) p.setAttribute("data-state", "drawn");
  });
  await page.waitForTimeout(600);
  const result = await fn(page);
  out.push({ name, path, width, ...result });
  await context.close();
}

await run("/", 375, 812, "home-hero-card", async (page) => {
  await page.screenshot({
    path: "scripts/responsive-audit/sections/home-hero-375.png",
    animations: "disabled",
  });
  return page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="hero-title"], section');
    const h1 = document.querySelector("h1");
    const cards = [...document.querySelectorAll("*")].filter((el) => {
      const t = (el.textContent || "").trim();
      return el.children.length <= 3 && /Build\s*[×x]\s*Transform/i.test(t) && t.length < 80;
    });
    const ctas = [...document.querySelectorAll("a")].filter((a) =>
      /See what|What We Do/i.test(a.textContent || ""),
    );
    return {
      h1Box: (() => {
        const r = h1.getBoundingClientRect();
        return { t: Math.round(r.top), b: Math.round(r.bottom), lines: h1.getClientRects().length };
      })(),
      cards: cards.slice(0, 3).map((c) => {
        const r = c.getBoundingClientRect();
        return {
          text: c.textContent.trim().slice(0, 50),
          t: Math.round(r.top),
          b: Math.round(r.bottom),
          l: Math.round(r.left),
          w: Math.round(r.width),
          z: getComputedStyle(c).zIndex,
        };
      }),
      ctas: ctas.slice(0, 4).map((a) => {
        const r = a.getBoundingClientRect();
        return {
          text: a.textContent.trim().slice(0, 40),
          t: Math.round(r.top),
          b: Math.round(r.bottom),
          l: Math.round(r.left),
        };
      }),
    };
  });
});

await run("/about", 375, 812, "about-hero", async (page) => {
  await page.screenshot({
    path: "scripts/responsive-audit/sections/about-hero-375.png",
    animations: "disabled",
  });
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const r = h1.getBoundingClientRect();
    const style = getComputedStyle(h1);
    return {
      text: h1.textContent.trim(),
      box: { t: Math.round(r.top), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) },
      color: style.color,
      opacity: style.opacity,
      fontSize: style.fontSize,
      inViewport: r.top < innerHeight && r.bottom > 0,
    };
  });
});

await run("/about", 375, 812, "about-long-view", async (page) => {
  const section = page.locator('[aria-labelledby="about-long-view-title"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await section.screenshot({
    path: "scripts/responsive-audit/sections/about-long-view-375.png",
    animations: "disabled",
  });
  return page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="about-long-view-title"]');
    const cols = [...section.querySelectorAll("p, div")].slice(0, 8).map((el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), text: el.textContent.trim().slice(0, 40) };
    });
    return { sectionH: Math.round(section.getBoundingClientRect().height), cols };
  });
});

await run("/build", 768, 1024, "build-partnership-768", async (page) => {
  const section = page.locator("#how-we-build-together");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await section.screenshot({
    path: "scripts/responsive-audit/sections/build-partnership-768.png",
    animations: "disabled",
  });
  return page.evaluate(() => {
    const header = document.querySelector("header");
    const title = document.getElementById("build-partnership-title");
    const hr = header.getBoundingClientRect();
    const tr = title.getBoundingClientRect();
    return {
      headerBottom: Math.round(hr.bottom),
      titleTop: Math.round(tr.top),
      covered: tr.top < hr.bottom - 4,
      overlapPx: Math.round(hr.bottom - tr.top),
    };
  });
});

await run("/transform", 375, 812, "transform-approach", async (page) => {
  const section = page.locator('[aria-labelledby="tr-approach-title"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await section.screenshot({
    path: "scripts/responsive-audit/sections/transform-approach-375.png",
    animations: "disabled",
  });
  return { ok: true };
});

await run("/transform", 1024, 768, "transform-hero-1024", async (page) => {
  await page.screenshot({
    path: "scripts/responsive-audit/sections/transform-hero-1024.png",
    animations: "disabled",
  });
  return page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const imgs = [...hero.querySelectorAll("img")].map((img) => {
      const r = img.getBoundingClientRect();
      return {
        display: getComputedStyle(img).display,
        parentDisplay: getComputedStyle(img.parentElement).display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top),
        left: Math.round(r.left),
      };
    });
    const h1 = document.querySelector("#tr-hero-title, h1");
    const hr = h1.getBoundingClientRect();
    return {
      heroH: Math.round(hero.getBoundingClientRect().height),
      h1: { t: Math.round(hr.top), w: Math.round(hr.width), text: h1.textContent.trim().slice(0, 60) },
      imgs,
    };
  });
});

await run("/research", 375, 812, "research-memorial", async (page) => {
  const scrolled = await page.evaluate(() => {
    const el = [...document.querySelectorAll("section, article, div")].find(
      (n) => /Prateesh Goyal/i.test(n.textContent || "") && (n.textContent || "").length < 1200,
    );
    if (!el) return null;
    el.scrollIntoView({ block: "start" });
    const r = el.getBoundingClientRect();
    return { t: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) };
  });
  await page.waitForTimeout(200);
  await page.screenshot({
    path: "scripts/responsive-audit/sections/research-memorial-375.png",
    animations: "disabled",
  });
  return { scrolled };
});

await run("/", 430, 932, "home-hero-430", async (page) => {
  await page.screenshot({
    path: "scripts/responsive-audit/sections/home-hero-430.png",
    animations: "disabled",
  });
  return { ok: true };
});

await run("/", 1024, 768, "home-nav-1024", async (page) => {
  // at 1024, is desktop nav or mobile?
  return page.evaluate(() => {
    const burger = document.querySelector('button[aria-controls="mobile-menu"]');
    const desktop = document.querySelector('nav[aria-label="Primary"] .hidden.lg\\:flex, nav[aria-label="Primary"] > div.hidden');
    const burgerStyle = burger ? getComputedStyle(burger).display : null;
    const allDivs = [...document.querySelectorAll("nav[aria-label='Primary'] > div")].map((d) => ({
      cls: d.className.toString().slice(0, 60),
      display: getComputedStyle(d).display,
    }));
    return { burgerDisplay: burgerStyle, navChildren: allDivs };
  });
});

writeFileSync("scripts/responsive-audit/inspect-more.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();
