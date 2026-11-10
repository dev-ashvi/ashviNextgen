import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3102").replace(/\/$/, "");

for (const w of [1920, 1440, 375]) {
  const context = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/build`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);

  const metrics = await page.evaluate(async () => {
    const section = document.getElementById("build-hero-title")?.closest("section");
    const img = section?.querySelector("img");
    const badge = [...(section?.querySelectorAll("p") ?? [])].some((p) => /placeholder/i.test(p.textContent ?? ""));
    let alpha = null;
    if (img?.complete && img.naturalWidth) {
      try {
        const c = document.createElement("canvas");
        c.width = Math.min(img.naturalWidth, 400);
        c.height = Math.min(img.naturalHeight, 200);
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, c.width, c.height);
        const { data } = ctx.getImageData(0, 0, 1, 1);
        const mid = ctx.getImageData(Math.floor(c.width / 2), 2, 1, 1).data;
        alpha = { corner: data[3], topMid: mid[3], natural: [img.naturalWidth, img.naturalHeight], src: img.currentSrc };
      } catch (e) {
        alpha = { error: String(e) };
      }
    }
    return {
      heroH: Math.round(section?.getBoundingClientRect().height ?? 0),
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      badge,
      labels: [...(section?.querySelectorAll("figcaption") ?? [])].map((el) => el.textContent.trim()),
      alpha,
      consoleErrors: [],
    };
  });
  console.log(w, JSON.stringify({ ...metrics, consoleErrors: errors }));
  await page.locator("#build-hero-title").locator("xpath=ancestor::section[1]").screenshot({
    path: `scripts/perf-results/build-hero-${w}.png`,
  });
  await context.close();
}

await browser.close();
