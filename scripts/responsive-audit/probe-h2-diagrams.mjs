import { chromium } from "playwright";
import { mkdirSync } from "fs";

const base = (process.env.CAPTURE_BASE || "http://localhost:3141").replace(/\/$/, "");
const out = "scripts/responsive-audit/h2-h3-verify";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

for (const width of [375, 430, 768, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: width >= 1024 ? 900 : 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/?din=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const report = await page.evaluate((w) => {
    const vw = window.innerWidth;
    const interesting = [];

    for (const svg of document.querySelectorAll("svg")) {
      const r = svg.getBoundingClientRect();
      if (r.width < 40 || r.height < 40) continue;
      const section = svg.closest("section");
      const h = (section?.querySelector("h2,h1")?.textContent || "").trim().slice(0, 60);
      const texts = [...svg.querySelectorAll("text")].map((t) => {
        const tr = t.getBoundingClientRect();
        return {
          text: (t.textContent || "").trim().slice(0, 40),
          left: Math.round(tr.left),
          right: Math.round(tr.right),
          clippedL: tr.left < -1,
          clippedR: tr.right > vw + 1,
          offscreen: tr.right < 0 || tr.left > vw,
        };
      });
      const clippedLabels = texts.filter((t) => t.clippedL || t.clippedR || t.offscreen);
      const overflows = r.left < -2 || r.right > vw + 2;
      if (overflows || clippedLabels.length || /philosophy|believe|paths|ambition|domain|Build for/i.test(h)) {
        interesting.push({
          w: Math.round(r.width),
          h: Math.round(r.height),
          left: Math.round(r.left),
          right: Math.round(r.right),
          overflows,
          viewBox: svg.getAttribute("viewBox"),
          aria: svg.getAttribute("aria-label")?.slice(0, 50),
          cls: (svg.getAttribute("class") || "").slice(0, 90),
          sectionH: h,
          labelCount: texts.length,
          clippedLabels,
        });
      }
    }
    return { vw: w, interesting };
  }, width);

  console.log(`\n=== ${width} ===`);
  console.log(JSON.stringify(report, null, 2));

  // Screenshots of belief + philosophy + what-we-do
  const belief = page.locator("section").filter({ hasText: "Technology is changing what a business can be" }).first();
  await belief.scrollIntoViewIfNeeded();
  await belief.screenshot({ path: `${out}/home-belief-${width}-before.png`, animations: "disabled" });

  const phil = page.locator("section").filter({ hasText: /Build for how|Engineering|how the business works/i }).first();
  if (await phil.count()) {
    await phil.scrollIntoViewIfNeeded();
    await phil.screenshot({ path: `${out}/home-philosophy-${width}-before.png`, animations: "disabled" });
  }

  const wwd = page.locator("#what-we-do");
  if (await wwd.count()) {
    await wwd.scrollIntoViewIfNeeded();
    await wwd.screenshot({ path: `${out}/home-wwd-${width}-before.png`, animations: "disabled" });
  }

  await context.close();
}

await browser.close();
