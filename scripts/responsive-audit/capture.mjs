import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { writeFileSync } from "fs";
import path from "path";

const OUT = "scripts/responsive-audit";
await mkdir(OUT, { recursive: true });
await mkdir(path.join(OUT, "pages"), { recursive: true });
await mkdir(path.join(OUT, "sections"), { recursive: true });
await mkdir(path.join(OUT, "nav"), { recursive: true });

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");

const PAGES = [
  { slug: "home", path: "/" },
  { slug: "build", path: "/build" },
  { slug: "transform", path: "/transform" },
  { slug: "research", path: "/research" },
  { slug: "about", path: "/about" },
  { slug: "contact", path: "/contact" },
];

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

const PRIMARY = new Set(["375", "768", "1440"]);

const browser = await chromium.launch();
const metrics = [];

async function settle(page) {
  await page.evaluate(() => {
    const p = document.getElementById("how-we-build-together");
    if (p) p.setAttribute("data-state", "drawn");
  });
  await page.waitForTimeout(400);
}

async function layoutMetrics(page, slug, vp) {
  return page.evaluate(({ slug, vp }) => {
    const doc = document.documentElement;
    const body = document.body;
    const overflowX = doc.scrollWidth > window.innerWidth + 1;
    const sections = [...document.querySelectorAll("main section, main > div > section, [aria-labelledby]")].slice(0, 20);
    const sectionInfo = sections.map((s, i) => {
      const r = s.getBoundingClientRect();
      const style = getComputedStyle(s);
      return {
        i,
        id: s.id || s.getAttribute("aria-labelledby") || null,
        tag: s.tagName,
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top + window.scrollY),
        overflowVisible: style.overflow === "visible" || style.overflowX === "visible",
      };
    });

    // Detect elements wider than viewport
    const wide = [];
    document.querySelectorAll("img, svg, canvas, video, section, div").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > window.innerWidth + 2 && r.height > 20) {
        wide.push({
          tag: el.tagName,
          cls: (el.className?.toString?.() || "").slice(0, 80),
          w: Math.round(r.width),
          left: Math.round(r.left),
        });
      }
    });

    const header = document.querySelector("header");
    const hr = header?.getBoundingClientRect();

    return {
      slug,
      vp,
      scrollWidth: doc.scrollWidth,
      innerWidth: window.innerWidth,
      overflowX,
      bodyH: Math.round(body.scrollHeight),
      headerH: hr ? Math.round(hr.height) : null,
      wide: wide.slice(0, 12),
      sections: sectionInfo.slice(0, 16),
      title: document.title,
    };
  }, { slug, vp });
}

for (const vp of VIEWPORTS) {
  for (const route of PAGES) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("pageerror", (e) => consoleErrors.push(String(e)));

    await page.goto(`${base}${route.path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await settle(page);

    const m = await layoutMetrics(page, route.slug, vp.name);
    m.consoleErrors = consoleErrors;
    metrics.push(m);

    if (PRIMARY.has(vp.name) || vp.name === "390" || vp.name === "1024") {
      await page.screenshot({
        path: path.join(OUT, "pages", `${route.slug}-${vp.name}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }

    // Mobile nav capture once per small viewport on homepage
    if (route.slug === "home" && (vp.name === "375" || vp.name === "768")) {
      const menuBtn = page.locator('button[aria-controls="mobile-menu"]');
      if (await menuBtn.count()) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(OUT, "nav", `mobile-menu-${vp.name}.png`),
          animations: "disabled",
        });
        // Escape / close
        await page.keyboard.press("Escape");
        await page.waitForTimeout(200);
      }
    }

    // Section captures for key pages at 375
    if (vp.name === "375") {
      const selectors = {
        home: ['#our-work', '#what-we-do'],
        build: ['[aria-labelledby="build-hero-title"]', '#how-we-build-together', '[aria-labelledby="build-journey-title"]', '[aria-labelledby="build-wyz-title"]'],
        transform: ['[aria-labelledby="tr-hero-title"]', '[aria-labelledby="tr-where-title"]', '#our-approach', '[aria-labelledby="tr-partner-title"]'],
        research: ['[aria-labelledby]', 'section'],
        about: ['section'],
        contact: ['[aria-labelledby="contact-title"]'],
      };
      const list = selectors[route.slug] || [];
      for (let i = 0; i < list.length; i++) {
        const loc = page.locator(list[i]).first();
        if (await loc.count()) {
          try {
            await loc.scrollIntoViewIfNeeded({ timeout: 3000 });
            await page.waitForTimeout(150);
            await loc.screenshot({
              path: path.join(OUT, "sections", `${route.slug}-375-s${i}.png`),
              animations: "disabled",
              timeout: 8000,
            });
          } catch {
            // skip unstable sections
          }
        }
      }
    }

    // Contact validation state at 375
    if (route.slug === "contact" && vp.name === "375") {
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(250);
      await page.screenshot({
        path: path.join(OUT, "sections", "contact-375-validation.png"),
        fullPage: false,
        animations: "disabled",
      });
    }

    console.log(`ok ${route.slug}@${vp.name} overflow=${m.overflowX} wide=${m.wide.length}`);
    await context.close();
  }
}

// Desktop What We Do dropdown
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.click('button:has-text("What We Do")');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "nav", "desktop-wwd-dropdown-1440.png"), animations: "disabled" });
  await context.close();
}

writeFileSync(path.join(OUT, "metrics.json"), JSON.stringify(metrics, null, 2));
console.log("metrics written", metrics.length);
await browser.close();
