/**
 * Phase 5B local verification of Vercel Analytics integration (no deploy).
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const base = (process.env.CAPTURE_BASE || "http://127.0.0.1:3210").replace(/\/$/, "");
const outDir = path.dirname(fileURLToPath(import.meta.url));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const requests = [];
page.on("request", (req) => {
  const u = req.url();
  if (/vercel|insights|\/_vercel\//i.test(u) || /\/view$|\/event$/.test(u)) {
    requests.push({ url: u, method: req.method() });
  }
});

await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 }).catch(() =>
  page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 60000 }),
);
await page.waitForTimeout(1500);

const home = await page.evaluate(() => {
  const html = document.documentElement.outerHTML;
  return {
    hasVaQueue: typeof window.va === "function" || Array.isArray(window.vaq),
    scriptTags: [...document.querySelectorAll("script[src]")].map((s) => s.src),
    mentionsAnalytics:
      html.includes("vercel") ||
      html.includes("insights") ||
      [...document.querySelectorAll("script")].some((s) =>
        /analytics|vaq|vai/i.test(s.textContent || ""),
      ),
    cookieNames: document.cookie
      ? document.cookie.split(";").map((c) => c.split("=")[0].trim())
      : [],
  };
});

// Client navigation
await page.click('a[href="/build"]').catch(() => page.goto(base + "/build"));
await page.waitForTimeout(1200);
await page.click('a[href="/contact"]').catch(() => page.goto(base + "/contact?interest=build"));
await page.waitForTimeout(1200);

const afterNav = await page.evaluate(() => ({
  path: location.pathname + location.search,
  cookieNames: document.cookie
    ? document.cookie.split(";").map((c) => c.split("=")[0].trim())
    : [],
}));

const csp = (await fetch(base + "/")).headers.get("content-security-policy-report-only");

const report = {
  base,
  home,
  afterNav,
  analyticsNetwork: requests,
  cspConnectSelf: csp?.includes("connect-src 'self'") ?? false,
  cspNoThirdPartyAnalytics:
    csp != null &&
    !/googletagmanager|google-analytics|plausible|hotjar/i.test(csp),
  notes: [
    "Local/production next start typically does not emit Vercel intake requests; collection is confirmed in the Vercel dashboard after deploy + enabling Web Analytics.",
    "Duplicate Analytics components: only root layout mounts VercelAnalytics once.",
  ],
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "verify-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
