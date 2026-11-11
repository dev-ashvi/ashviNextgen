import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3130").replace(/\/$/, "");
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.click('button[aria-controls="mobile-menu"]');
await page.waitForTimeout(500);

const info = await page.evaluate(() => {
  const menu = document.getElementById("mobile-menu");
  const ancestors = [];
  let el = menu;
  while (el) {
    const s = getComputedStyle(el);
    ancestors.push({
      tag: el.tagName,
      id: el.id || null,
      cls: (el.className || "").toString().slice(0, 100),
      transform: s.transform,
      filter: s.filter,
      backdropFilter: s.backdropFilter,
      willChange: s.willChange,
      overflow: s.overflow,
      position: s.position,
      h: Math.round(el.getBoundingClientRect().height),
      top: s.top,
      bottom: s.bottom,
      display: s.display,
    });
    el = el.parentElement;
  }
  const r = menu.getBoundingClientRect();
  const cs = getComputedStyle(menu);
  return {
    menuRect: { t: r.top, b: r.bottom, h: r.height, w: r.width, l: r.left },
    menuComputed: {
      top: cs.top,
      bottom: cs.bottom,
      position: cs.position,
      display: cs.display,
      height: cs.height,
      maxHeight: cs.maxHeight,
      hidden: menu.hidden,
      hasHiddenAttr: menu.hasAttribute("hidden"),
    },
    bodyOverflow: document.body.style.overflow,
    ancestors,
  };
});

console.log(JSON.stringify(info, null, 2));
await page.screenshot({
  path: "scripts/responsive-audit/nav/mobile-menu-375-full.png",
  fullPage: false,
  animations: "disabled",
});
await browser.close();
