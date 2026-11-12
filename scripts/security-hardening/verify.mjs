/**
 * Phase 4A regression: pages, headers, contact validation, console errors.
 * Perf snapshot: use scripts/stability/measure-home.mjs separately (1 run).
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const base = (process.env.CAPTURE_BASE || "http://127.0.0.1:3190").replace(/\/$/, "");

const REQUIRED_HEADERS = [
  "x-content-type-options",
  "referrer-policy",
  "x-frame-options",
  "permissions-policy",
  "content-security-policy-report-only",
  "strict-transport-security",
];

const PAGES = ["/", "/build", "/transform", "/research", "/about", "/contact"];

async function checkHeaders(url) {
  const res = await fetch(url, { redirect: "manual" });
  const headers = {};
  for (const [k, v] of res.headers) headers[k.toLowerCase()] = v;
  const missing = REQUIRED_HEADERS.filter((h) => !headers[h]);
  return {
    status: res.status,
    missing,
    sample: Object.fromEntries(REQUIRED_HEADERS.map((h) => [h, headers[h] || null])),
    link: headers.link || null,
  };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const report = {
    base,
    startedAt: new Date().toISOString(),
    headers: {},
    pages: {},
    contact: {},
    interactive: {},
    consoleErrors: [],
  };

  for (const p of PAGES) {
    report.headers[p] = await checkHeaders(base + p);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  page.on("pageerror", (err) =>
    report.consoleErrors.push({ type: "pageerror", message: String(err) }),
  );
  page.on("console", (msg) => {
    if (msg.type() === "error")
      report.consoleErrors.push({ type: "console", message: msg.text() });
  });

  for (const route of PAGES) {
    const entry = { ok: false };
    try {
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(350);
      entry.title = await page.title();
      entry.mainVisible = await page.locator("body").isVisible();
      entry.homeLink = await page.locator('a[href="/"]').count();
      const menuBtn = page.locator("header button").filter({ hasText: /menu/i }).first();
      if ((await menuBtn.count()) === 0) {
        // aria-label Menu
        const alt = page.locator('header button[aria-label*="Menu" i], header button[aria-label*="menu" i]').first();
        if (await alt.count()) {
          await alt.click();
          await page.waitForTimeout(200);
          entry.menuOpened = (await page.locator('a[href="/contact"]').count()) > 0;
          await alt.click().catch(() => {});
        }
      } else {
        await menuBtn.click();
        await page.waitForTimeout(200);
        entry.menuOpened = (await page.locator('a[href="/contact"]').count()) > 0;
        await menuBtn.click().catch(() => {});
      }
      entry.ok = Boolean(entry.mainVisible && entry.title);
    } catch (e) {
      entry.error = String(e);
    }
    report.pages[route] = entry;
  }

  // Desktop Build/Transform links
  {
    const desk = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const dpage = await desk.newPage();
    await dpage.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
    report.pages.desktopNav = {
      build: await dpage.locator('header a[href="/build"]').count(),
      transform: await dpage.locator('header a[href="/transform"]').count(),
      research: await dpage.locator('header a[href="/research"]').count(),
      about: await dpage.locator('header a[href="/about"]').count(),
      contact: await dpage.locator('header a[href="/contact"]').count(),
    };
    await desk.close();
  }

  // Homepage deferrals + reduced motion
  {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.4)));
    await page.waitForTimeout(900);
    const din = await page.locator("#belief-visual, [id*='belief']").count();
    await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.55)));
    await page.waitForTimeout(900);
    const accordion = await page.locator("button[aria-expanded]").count();
    await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.75)));
    await page.waitForTimeout(900);
    const landscape = await page.locator('img[src*="landscape"], #research img').count();
    const connect = await page.getByRole("heading", { name: /connect|build with/i }).count();
    report.interactive = {
      dinNear: din,
      engAccordionButtons: accordion,
      landscape: landscape,
      connectHeading: connect,
      reducedMotionHiddenReveals: await page.evaluate(() => {
        const nodes = [...document.querySelectorAll("[data-reveal], .reveal")];
        return nodes.filter((n) => getComputedStyle(n).opacity === "0").length;
      }),
    };
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }

  // About canvas / fallback
  {
    await page.goto(base + "/about", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(700);
    report.interactive.aboutCanvas = await page.locator("canvas").count();
  }

  // Contact validation — no real email
  {
    await page.goto(base + "/contact", { waitUntil: "domcontentloaded", timeout: 60000 });
    const apiRes = await page.evaluate(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "", email: "bad", message: "x", interest: "build" }),
      });
      return { status: res.status, body: await res.json().catch(() => null) };
    });
    report.contact.apiInvalid = apiRes;
    const honeypot = await page.evaluate(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Bot",
          email: "bot@example.com",
          message: "spam spam spam spam",
          interest: "build",
          company_website: "https://spam.example",
        }),
      });
      return { status: res.status, body: await res.json().catch(() => null) };
    });
    report.contact.honeypot = honeypot;
  }

  // Secret boundary: Resend/Upstash must not appear in homepage HTML/JS bundles
  {
    const html = await (await fetch(base + "/")).text();
    report.secrets = {
      htmlHasResendKey: /re_[A-Za-z0-9]/.test(html) || /RESEND_API_KEY/.test(html),
      htmlHasUpstash: /UPSTASH_REDIS/.test(html),
    };
  }

  await browser.close();
  report.finishedAt = new Date().toISOString();
  report.summary = {
    allPagesOk: PAGES.every((p) => report.pages[p]?.ok),
    allHeadersPresent: PAGES.every((p) => (report.headers[p]?.missing || []).length === 0),
    consoleErrorCount: report.consoleErrors.length,
  };
  fs.writeFileSync(path.join(outDir, "verify-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.summary.allPagesOk || !report.summary.allHeadersPresent) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
