import { chromium } from "playwright";

const base = (process.env.CAPTURE_BASE || "http://localhost:3141").replace(/\/$/, "");
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto(`${base}/build#how-we-build-together`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const m = await page.evaluate(() => {
  const header = document.querySelector("header");
  const section = document.getElementById("how-we-build-together");
  const title = document.getElementById("build-partnership-title");
  const eyebrow = [...section.querySelectorAll("p")].find((el) =>
    /How we build together/i.test(el.textContent || ""),
  );
  const hr = header.getBoundingClientRect();
  const sr = section.getBoundingClientRect();
  const er = eyebrow.getBoundingClientRect();
  const tr = title.getBoundingClientRect();
  return {
    headerBottom: Math.round(hr.bottom),
    sectionTop: Math.round(sr.top),
    eyebrowTop: Math.round(er.top),
    titleTop: Math.round(tr.top),
    sectionGap: Math.round(sr.top - hr.bottom),
    eyebrowGap: Math.round(er.top - hr.bottom),
    titleGap: Math.round(tr.top - hr.bottom),
    scrollY: Math.round(window.scrollY),
  };
});

console.log(JSON.stringify(m, null, 2));
await page.screenshot({
  path: "scripts/responsive-audit/h1-h4-verify/build-partnership-anchor-375-recheck.png",
  animations: "disabled",
});
await browser.close();
