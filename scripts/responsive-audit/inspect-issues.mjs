import { chromium } from "playwright";
import { writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
const browser = await chromium.launch();
const findings = [];

async function check(path, width, height, name, fn) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    const p = document.getElementById("how-we-build-together");
    if (p) p.setAttribute("data-state", "drawn");
  });
  await page.waitForTimeout(500);
  const result = await fn(page);
  findings.push({ name, path, width, ...result });
  await context.close();
}

// Home hero: card vs CTA overlap
await check("/", 375, 812, "home-hero-overlap", async (page) => {
  return page.evaluate(() => {
    const buttons = [...document.querySelectorAll("a, button")].filter((el) =>
      /What We Do|See what|building/i.test(el.textContent || ""),
    );
    const cards = [...document.querySelectorAll("div, aside, article")].filter((el) =>
      /Build\s*[×x]\s*Transform|Create new/i.test(el.textContent || ""),
    );
    const overlaps = [];
    for (const b of buttons.slice(0, 4)) {
      const br = b.getBoundingClientRect();
      for (const c of cards.slice(0, 4)) {
        const cr = c.getBoundingClientRect();
        const hit =
          br.left < cr.right && br.right > cr.left && br.top < cr.bottom && br.bottom > cr.top;
        if (hit) {
          overlaps.push({
            button: (b.textContent || "").trim().slice(0, 40),
            card: (c.textContent || "").trim().slice(0, 40),
            buttonBottom: Math.round(br.bottom),
            cardTop: Math.round(cr.top),
          });
        }
      }
    }
    const h1 = document.querySelector("h1");
    return {
      h1: h1?.textContent?.trim(),
      overlaps,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
});

// Build partnership sticky header covering content
await check("/build", 375, 812, "build-partnership-header", async (page) => {
  const section = page.locator("#how-we-build-together");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const header = document.querySelector("header");
    const title = document.getElementById("build-partnership-title");
    const hr = header.getBoundingClientRect();
    const tr = title.getBoundingClientRect();
    return {
      headerBottom: Math.round(hr.bottom),
      titleTop: Math.round(tr.top),
      titleCovered: tr.top < hr.bottom - 4,
      overlapPx: Math.round(hr.bottom - tr.top),
      titleText: title?.textContent?.trim(),
    };
  });
});

// Build hero annotations crowding
await check("/build", 375, 812, "build-hero-annotations", async (page) => {
  return page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="build-hero-title"]');
    const labels = [...hero.querySelectorAll("span, p, div")].filter((el) =>
      /Domain Expertise|Engineering Capability|AI-Native Venture/i.test(el.textContent || ""),
    );
    return {
      labels: labels.slice(0, 6).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          text: el.textContent.trim().slice(0, 30),
          w: Math.round(r.width),
          left: Math.round(r.left),
          font: getComputedStyle(el).fontSize,
        };
      }),
      heroH: Math.round(hero.getBoundingClientRect().height),
    };
  });
});

// Transform hero sculpture crop
await check("/transform", 375, 812, "transform-hero-mobile", async (page) => {
  return page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="tr-hero-title"]');
    const imgs = [...hero.querySelectorAll("img")];
    return {
      heroH: Math.round(hero.getBoundingClientRect().height),
      imgs: imgs.map((img) => {
        const r = img.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top),
          natural: `${img.naturalWidth}x${img.naturalHeight}`,
          display: getComputedStyle(img.parentElement).display,
        };
      }),
      ctas: [...hero.querySelectorAll("a")].map((a) => (a.textContent || "").trim().slice(0, 40)),
    };
  });
});

// Contact form field stacking
await check("/contact", 375, 812, "contact-form-mobile", async (page) => {
  return page.evaluate(() => {
    const form = document.querySelector("form");
    const inputs = [...form.querySelectorAll("input:not([type=radio]):not([tabindex='-1']), textarea")];
    const radioLabels = [...form.querySelectorAll("fieldset label")];
    return {
      inputLayout: inputs.map((el) => {
        const r = el.getBoundingClientRect();
        return { name: el.getAttribute("name"), w: Math.round(r.width), top: Math.round(r.top) };
      }),
      radioCount: radioLabels.length,
      radioWidths: radioLabels.map((l) => Math.round(l.getBoundingClientRect().width)),
      formW: Math.round(form.getBoundingClientRect().width),
    };
  });
});

// About mobile content visibility
await check("/about", 375, 812, "about-mobile-content", async (page) => {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const h2s = [...document.querySelectorAll("h2")].map((h) => h.textContent.trim().slice(0, 60));
    const sections = [...document.querySelectorAll("section")].map((s) => ({
      id: s.id || s.getAttribute("aria-labelledby"),
      h: Math.round(s.getBoundingClientRect().height),
      textLen: (s.innerText || "").trim().length,
    }));
    return {
      h1: h1?.textContent?.trim()?.slice(0, 80),
      h1Visible: h1 ? getComputedStyle(h1).color : null,
      h2s,
      sections,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
});

// Mobile menu coverage
await check("/", 375, 812, "mobile-menu-coverage", async (page) => {
  await page.click('button[aria-controls="mobile-menu"]');
  await page.waitForTimeout(300);
  const shot = await page.screenshot({ path: "scripts/responsive-audit/nav/mobile-menu-375-recheck.png", animations: "disabled" });
  return page.evaluate(() => {
    const menu = document.getElementById("mobile-menu");
    const style = getComputedStyle(menu);
    const r = menu.getBoundingClientRect();
    const links = [...menu.querySelectorAll("a")].map((a) => a.textContent.trim().slice(0, 20));
    return {
      hiddenAttr: menu.hasAttribute("hidden"),
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      bg: style.backgroundColor,
      h: Math.round(r.height),
      w: Math.round(r.width),
      links,
      z: style.zIndex,
    };
  });
});

// Tablet transform where section
await check("/transform", 768, 1024, "transform-where-tablet", async (page) => {
  const section = page.locator('[aria-labelledby="tr-where-title"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await section.screenshot({ path: "scripts/responsive-audit/sections/transform-where-768.png", animations: "disabled" });
  return page.evaluate(() => {
    const desktop = document.querySelector('[aria-labelledby="tr-where-title"] .hidden.lg\\:block, [aria-labelledby="tr-where-title"] .lg\\:block');
    const mobile = document.querySelector('[aria-labelledby="tr-where-title"] .lg\\:hidden');
    return {
      desktopDisplay: desktop ? getComputedStyle(desktop).display : null,
      mobileDisplay: mobile ? getComputedStyle(mobile).display : null,
    };
  });
});

// Build journey tablet
await check("/build", 768, 1024, "build-journey-tablet", async (page) => {
  const section = page.locator('[aria-labelledby="build-journey-title"]');
  await section.scrollIntoViewIfNeeded();
  await section.screenshot({ path: "scripts/responsive-audit/sections/build-journey-768.png", animations: "disabled" });
  return { ok: true };
});

writeFileSync("scripts/responsive-audit/inspect.json", JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings, null, 2));
await browser.close();
