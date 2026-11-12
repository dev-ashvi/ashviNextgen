/**
 * Production functional + a11y capture (Chromium via Playwright).
 * Does not submit real contact messages.
 */
import { mkdirSync, writeFileSync } from "fs";
import { chromium } from "playwright";
import path from "path";

const base = (process.env.CAPTURE_BASE || "http://localhost:3150").replace(/\/$/, "");
const outDir = "scripts/production-audit/functional";
mkdirSync(outDir, { recursive: true });

const pages = ["/", "/build", "/transform", "/research", "/about", "/contact"];

const report = {
  base,
  startedAt: new Date().toISOString(),
  routes: [],
  navigation: [],
  contact: {},
  a11yManual: {},
  links: [],
  errors: [],
};

async function statusFor(pagePath) {
  const res = await fetch(`${base}${pagePath}`);
  return { path: pagePath, status: res.status, ok: res.ok };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on("pageerror", (err) => report.errors.push({ type: "pageerror", message: String(err) }));
page.on("console", (msg) => {
  if (msg.type() === "error") report.errors.push({ type: "console", message: msg.text() });
});

for (const p of pages) {
  const http = await statusFor(p);
  report.routes.push(http);
  if (!http.ok) continue;
  await page.goto(`${base}${p}`, { waitUntil: "networkidle", timeout: 60000 });
  const landmarks = await page.evaluate(() => {
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((el) => ({
      tag: el.tagName,
      text: (el.textContent || "").trim().slice(0, 80),
    }));
    const mains = document.querySelectorAll("main").length;
    const navs = document.querySelectorAll("nav").length;
    const skip = !!document.querySelector('a[href="#main"], a.skip-link');
    const h1 = document.querySelectorAll("h1").length;
    return { headings, mains, navs, skip, h1 };
  });
  await page.screenshot({ path: path.join(outDir, `${p === "/" ? "home" : p.slice(1)}-desktop.png`), fullPage: false });
  report.a11yManual[p] = landmarks;
}

// Mobile menu + nav journeys at 390
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 60000 });
const openBtn = page.getByRole("button", { name: /open menu/i });
await openBtn.click();
const menuVisible = await page.locator("#mobile-menu").isVisible();
const firstFocus = await page.evaluate(() => document.activeElement?.tagName + ":" + (document.activeElement?.getAttribute("href") || document.activeElement?.textContent?.slice(0, 40)));
await page.screenshot({ path: path.join(outDir, "mobile-menu-open.png") });
await page.keyboard.press("Escape");
const menuHidden = await page.locator("#mobile-menu").evaluate((el) => el.hasAttribute("hidden") || getComputedStyle(el).display === "none");
report.navigation.push({ test: "mobile-menu-open-escape", menuVisible, firstFocus, menuHiddenAfterEscape: menuHidden });

// Desktop What We Do → Build
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 60000 });
await page.getByRole("button", { name: /what we do/i }).click();
await page.getByRole("menuitem", { name: /^Build/i }).click();
await page.waitForURL("**/build");
report.navigation.push({ test: "wwd-build", url: page.url() });

await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 60000 });
await page.getByRole("button", { name: /what we do/i }).click();
await page.getByRole("menuitem", { name: /^Transform/i }).click();
await page.waitForURL("**/transform");
report.navigation.push({ test: "wwd-transform", url: page.url() });

await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 60000 });
await page.getByRole("link", { name: /^Our Work$/i }).first().click();
await page.waitForTimeout(500);
report.navigation.push({ test: "our-work-anchor", url: page.url(), hash: new URL(page.url()).hash });

for (const dest of ["/research", "/about", "/contact"]) {
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  try {
    if (dest === "/contact") {
      await page.getByRole("link", { name: /^Contact$/i }).first().click({ timeout: 5000 });
    } else {
      await page.getByRole("link", { name: new RegExp(`^${dest.slice(1)}$`, "i") }).first().click({ timeout: 5000 });
    }
    await page.waitForTimeout(800);
    report.navigation.push({ test: `nav-${dest}`, url: page.url(), statusOk: !page.url().includes("_error") });
  } catch (e) {
    report.navigation.push({ test: `nav-${dest}`, error: String(e) });
  }
}

// Contact form validation (no real send)
const contactHttp = report.routes.find((r) => r.path === "/contact");
if (contactHttp?.ok) {
  await page.goto(`${base}/contact?interest=build`, { waitUntil: "networkidle", timeout: 60000 });
  const preselected = await page.locator('input[type="radio"][value="build"]').isChecked();
  await page.getByRole("button", { name: /send your message/i }).click();
  const nameErr = await page.locator("text=Please add your name").count();
  const live = await page.locator("[aria-live]").count();
  // Fill invalid email only
  await page.fill('input[name="name"]', "Audit Bot");
  await page.fill('input[name="email"]', "not-an-email");
  await page.getByRole("button", { name: /send your message/i }).click();
  const emailErr = await page.locator("text=Please add a valid email").count();
  report.contact = { preselectedBuild: preselected, validationNameError: nameErr > 0, validationEmailError: emailErr > 0, ariaLiveRegions: live };
} else {
  report.contact = { skipped: true, reason: "contact route not healthy", status: contactHttp?.status };
}

// Collect internal links from homepage
await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
const hrefs = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter(Boolean),
);
const unique = [...new Set(hrefs)];
for (const href of unique) {
  if (href.startsWith("mailto:") || href.startsWith("http") || href.startsWith("#")) {
    report.links.push({ href, kind: href.startsWith("mailto:") ? "mailto" : href.startsWith("http") ? "external" : "hash" });
    continue;
  }
  const url = href.startsWith("/") ? `${base}${href.split("#")[0]}` : `${base}/${href}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    report.links.push({ href, status: res.status, ok: res.ok || res.status === 308 || res.status === 307 });
  } catch (e) {
    report.links.push({ href, error: String(e) });
  }
}

// Reduced motion AnimatedReveal check
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/build`, { waitUntil: "networkidle", timeout: 60000 });
const reveal = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll(".ashvi-reveal")];
  return nodes.slice(0, 12).map((el) => {
    const cs = getComputedStyle(el);
    return {
      opacity: cs.opacity,
      visibility: cs.visibility,
      hasVisibleClass: el.classList.contains("ashvi-reveal--visible"),
      text: (el.textContent || "").trim().slice(0, 40),
    };
  });
});
report.a11yManual.reducedMotionReveal = reveal;

report.finishedAt = new Date().toISOString();
writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
