import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3143").replace(/\/$/, "");
const out = "scripts/responsive-audit/phase-2d-verify";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const findings = {};

async function withPage(width, height, reduced, fn) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reduced,
  });
  const page = await context.newPage();
  try {
    return await fn(page);
  } finally {
    await context.close();
  }
}

findings.m1 = await withPage(375, 812, "reduce", async (page) => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.locator('[aria-labelledby="hero-title"]').screenshot({
    path: `${out}/m1-home-hero-375.png`,
    animations: "disabled",
  });
  return page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="hero-title"]');
    const h1 = document.getElementById("hero-title");
    const ctas = [...hero.querySelectorAll("a")].slice(0, 2).map((a) => {
      const r = a.getBoundingClientRect();
      return { t: Math.round(r.top), b: Math.round(r.bottom), text: a.textContent.trim().slice(0, 30) };
    });
    const cards = [...hero.querySelectorAll("div")].filter(
      (el) =>
        /Build\s*[×x]\s*Transform/i.test(el.textContent || "") &&
        (el.textContent || "").length < 80,
    );
    const card = cards[0]?.getBoundingClientRect();
    const img = hero.querySelector("img.sculpt-float, img[alt*='Dual Intelligence']");
    const ir = img?.getBoundingClientRect();
    const lastCta = ctas[ctas.length - 1];
    return {
      heroH: Math.round(hero.getBoundingClientRect().height),
      h1Bottom: Math.round(h1.getBoundingClientRect().bottom),
      ctas,
      card: card ? { t: Math.round(card.top), b: Math.round(card.bottom), l: Math.round(card.left) } : null,
      sculpture: ir ? { t: Math.round(ir.top), b: Math.round(ir.bottom), h: Math.round(ir.height) } : null,
      ctaCardGap: card && lastCta ? Math.round(card.top - lastCta.b) : null,
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
});

findings.m2 = await withPage(375, 812, "reduce", async (page) => {
  await page.goto(`${base}/build`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.locator('[aria-labelledby="build-hero-title"]').screenshot({
    path: `${out}/m2-build-hero-375.png`,
    animations: "disabled",
  });
  return page.evaluate(() => {
    const hero = document.querySelector('[aria-labelledby="build-hero-title"]');
    const links = [...hero.querySelectorAll("a")];
    const last = links[links.length - 1]?.getBoundingClientRect();
    const img = hero.querySelector("img");
    const ir = img?.getBoundingClientRect();
    return {
      ctaBottom: last ? Math.round(last.bottom) : null,
      artTop: ir ? Math.round(ir.top) : null,
      gap: last && ir ? Math.round(ir.top - last.bottom) : null,
      artH: ir ? Math.round(ir.height) : null,
      heroH: Math.round(hero.getBoundingClientRect().height),
    };
  });
});

findings.m3 = await withPage(768, 1024, "reduce", async (page) => {
  await page.goto(`${base}/build`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const p = document.getElementById("how-we-build-together");
    if (p) p.setAttribute("data-state", "drawn");
  });
  await page.waitForTimeout(400);
  const section = page.locator("#how-we-build-together");
  await section.scrollIntoViewIfNeeded();
  await section.screenshot({ path: `${out}/m3-partnership-768.png`, animations: "disabled" });
  return page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    title: document.getElementById("build-partnership-title")?.textContent?.trim(),
  }));
});

findings.m4 = {};
for (const w of [768, 1024]) {
  findings.m4[w] = await withPage(w, 900, "reduce", async (page) => {
    await page.goto(`${base}/transform`, { waitUntil: "networkidle" });
    const section = page.locator('[aria-labelledby="tr-where-title"]');
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: `${out}/m4-where-${w}.png`, animations: "disabled" });
    return page.evaluate(() => {
      const section = document.querySelector('[aria-labelledby="tr-where-title"]');
      const mobile = section.querySelector(".lg\\:hidden");
      const desktop = [...section.querySelectorAll("div")].find(
        (d) => d.className.toString().includes("lg:block") && d.className.toString().includes("hidden"),
      );
      return {
        mobileDisplay: mobile ? getComputedStyle(mobile).display : null,
        desktopDisplay: desktop ? getComputedStyle(desktop).display : null,
      };
    });
  });
}

findings.m5 = await withPage(375, 812, "reduce", async (page) => {
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const section = page.locator('[aria-labelledby="about-institution-title"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await section.screenshot({ path: `${out}/m5-institution-375-reduce.png`, animations: "allow" });
  return page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="about-institution-title"]');
    const reveals = [...section.querySelectorAll(".ashvi-reveal")].map((el) => ({
      opacity: getComputedStyle(el).opacity,
      text: el.textContent.trim().slice(0, 40),
    }));
    return {
      sectionH: Math.round(section.getBoundingClientRect().height),
      reveals,
      hiddenReveals: reveals.filter((r) => Number.parseFloat(r.opacity) < 0.5).length,
    };
  });
});

findings.m5Normal = await withPage(375, 812, "no-preference", async (page) => {
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  for (let y = 0; y < 3500; y += 350) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(200);
  }
  const section = page.locator('[aria-labelledby="about-institution-title"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await section.screenshot({ path: `${out}/m5-institution-375-motion.png`, animations: "allow" });
  return page.evaluate(() => {
    const section = document.querySelector('[aria-labelledby="about-institution-title"]');
    const reveals = [...section.querySelectorAll(".ashvi-reveal")];
    return {
      hidden: reveals.filter((el) => Number.parseFloat(getComputedStyle(el).opacity) < 0.5).length,
      total: reveals.length,
      sectionH: Math.round(section.getBoundingClientRect().height),
    };
  });
});

findings.m6 = await withPage(375, 812, "no-preference", async (page) => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const section = page
    .locator("section")
    .filter({ hasText: /Build for how the business works/i })
    .first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const buttons = section.locator("[aria-expanded]");
  const count = await buttons.count();
  const results = [];
  for (let i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(400);
    const info = await btn.evaluate((b) => {
      const expanded = b.getAttribute("aria-expanded") === "true";
      const root = b.closest("li") || b.parentElement;
      const body = root?.querySelector("span.block, p");
      const bodies = [...(root?.querySelectorAll("span, p") || [])]
        .map((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            text: el.textContent.trim().slice(0, 60),
            h: Math.round(r.height),
            opacity: cs.opacity,
            visible: r.height > 4 && Number.parseFloat(cs.opacity) > 0.5,
          };
        })
        .filter((x) => x.text.length > 30);
      return { expanded, label: b.textContent.trim().slice(0, 50), bodies: bodies.slice(0, 4) };
    });
    results.push(info);
    await section.screenshot({
      path: `${out}/m6-philosophy-open-${i}-375.png`,
      animations: "disabled",
    });
    await btn.click();
    await page.waitForTimeout(200);
  }
  if (count > 0) {
    await buttons.nth(0).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
  }
  const keyExpanded = count ? await buttons.nth(0).getAttribute("aria-expanded") : null;
  return { count, results, keyExpanded };
});

findings.l1 = await withPage(375, 812, "reduce", async (page) => {
  await page.goto(`${base}/contact`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.locator("form").screenshot({
    path: `${out}/l1-contact-form-375.png`,
    animations: "disabled",
  });
  return page.evaluate(() => {
    const form = document.querySelector("form");
    const fr = form.getBoundingClientRect();
    return {
      formW: Math.round(fr.width),
      sideInset: Math.min(Math.round(fr.left), Math.round(innerWidth - fr.right)),
    };
  });
});

findings.l2 = await withPage(375, 812, "reduce", async (page) => {
  await page.goto(`${base}/research`, { waitUntil: "networkidle" });
  await page.locator("h1").screenshot({
    path: `${out}/l2-research-h1-375.png`,
    animations: "disabled",
  });
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      text: h1.textContent.trim(),
      lines: h1.getClientRects().length,
      fontSize: getComputedStyle(h1).fontSize,
    };
  });
});

writeFileSync(`${out}/inspect.json`, JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings, null, 2));
await browser.close();
