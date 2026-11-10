import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("scripts/perf-results", { recursive: true });
const browser = await chromium.launch();
const base = (process.env.CAPTURE_BASE || "http://localhost:3128").replace(/\/$/, "");

async function open(path, w, h = 900) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);
  return { page, context, errors };
}

// Full page captures
for (const w of [1440, 375]) {
  const { page, context, errors } = await open("/contact", w, w === 375 ? 1600 : 1100);
  const metrics = await page.evaluate(() => {
    const radios = [...document.querySelectorAll('input[name="interest"]')];
    return {
      title: document.querySelector("#contact-title")?.textContent?.replace(/\s+/g, " ").trim(),
      email: document.querySelector('a[href="mailto:hello@ashvi.tech"]')?.textContent?.trim(),
      checked: radios.find((r) => r.checked)?.value || null,
      links: {
        build: !!document.querySelector('a[href="/build"]'),
        transform: !!document.querySelector('a[href="/transform"]'),
        research: !!document.querySelector('a[href="/research"]'),
      },
      header: !!document.querySelector("header"),
      footer: !!document.querySelector("footer"),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      note: document.body.innerText.includes("Form submissions will be available soon"),
    };
  });
  console.log(`full-${w}`, JSON.stringify({ ...metrics, consoleErrors: errors }));
  await page.screenshot({
    path: `scripts/perf-results/contact-page-${w}.png`,
    fullPage: true,
    animations: "disabled",
  });
  await context.close();
}

// Interest preselection checks
for (const interest of ["build", "transform", "research", "other", "nope"]) {
  const { page, context, errors } = await open(`/contact?interest=${interest}`, 1280);
  const checked = await page.evaluate(() => {
    const radios = [...document.querySelectorAll('input[name="interest"]')];
    return radios.find((r) => r.checked)?.value || null;
  });
  console.log(`interest-${interest}`, JSON.stringify({ checked, consoleErrors: errors }));
  await context.close();
}

// Validation: submit empty form
{
  const { page, context, errors } = await open("/contact", 1280);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(200);
  const validation = await page.evaluate(() => ({
    errors: [...document.querySelectorAll("p")].map((p) => p.textContent || "").filter((t) => /Please /.test(t)),
    sentClaim: document.body.innerText.includes("your message has been sent"),
  }));
  console.log("validation", JSON.stringify({ ...validation, consoleErrors: errors }));
  await context.close();
}

await browser.close();
