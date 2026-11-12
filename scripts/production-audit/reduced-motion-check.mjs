import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("scripts/production-audit/functional", { recursive: true });
const base = process.env.CAPTURE_BASE || "http://localhost:3150";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 60000 });

const reveal = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll(".ashvi-reveal")];
  return {
    count: nodes.length,
    sample: nodes.slice(0, 10).map((el) => ({
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      visibleClass: el.classList.contains("ashvi-reveal--visible"),
      text: (el.textContent || "").trim().slice(0, 50),
    })),
  };
});

const focusSample = await page.evaluate(() => {
  const results = [];
  const focusables = [
    ...document.querySelectorAll(
      'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
    ),
  ].slice(0, 20);
  for (const el of focusables) {
    el.focus();
    const cs = getComputedStyle(el);
    results.push({
      tag: el.tagName,
      name: (el.getAttribute("aria-label") || el.textContent || "")
        .trim()
        .slice(0, 40),
      outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
    });
  }
  return results;
});

// Desktop What We Do keyboard
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.getByRole("button", { name: /what we do/i }).focus();
await page.keyboard.press("Enter");
const menuOpen = await page.getByRole("menu").isVisible();
await page.keyboard.press("Escape");
const menuClosed = !(await page.getByRole("menu").isVisible().catch(() => false));

writeFileSync(
  "scripts/production-audit/functional/reduced-motion-home.json",
  JSON.stringify({ reveal, focusSample, wwdKeyboard: { menuOpen, menuClosed } }, null, 2),
);
console.log(
  JSON.stringify(
    {
      revealCount: reveal.count,
      hiddenCount: reveal.sample.filter((s) => s.opacity === "0").length,
      first: reveal.sample[0],
      wwdKeyboard: { menuOpen, menuClosed },
    },
    null,
    2,
  ),
);
await browser.close();
