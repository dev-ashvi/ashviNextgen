/**
 * Phase 5A — inspect production HTML for SEO foundation.
 * CAPTURE_BASE=http://127.0.0.1:3200 node scripts/seo-implementation/validate.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = (process.env.CAPTURE_BASE || "http://127.0.0.1:3200").replace(/\/$/, "");
const ORIGIN = "https://www.ashvi.tech";
const ROUTES = ["/", "/build", "/transform", "/research", "/about", "/contact"];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m[1]);
}

async function main() {
  const report = { base, origin: ORIGIN, pages: {}, robots: null, sitemap: null, ok: true, failures: [] };

  const robots = await fetch(`${base}/robots.txt`);
  report.robots = { status: robots.status, body: await robots.text() };
  if (!report.robots.body.includes(`${ORIGIN}/sitemap.xml`)) {
    report.failures.push("robots.txt sitemap URL is not www");
    report.ok = false;
  }

  const sm = await fetch(`${base}/sitemap.xml`);
  const smBody = await sm.text();
  report.sitemap = { status: sm.status, body: smBody };
  for (const r of ROUTES) {
    const loc = r === "/" ? `${ORIGIN}/` : `${ORIGIN}${r}`;
    // Accept with or without trailing slash on home
    const found =
      smBody.includes(`<loc>${loc}</loc>`) ||
      (r === "/" && smBody.includes(`<loc>${ORIGIN}</loc>`));
    if (!found) {
      report.failures.push(`sitemap missing ${loc}`);
      report.ok = false;
    }
    if (smBody.includes("https://ashvi.tech/") && !smBody.includes("www.ashvi.tech")) {
      // apex-only would fail above; flag any leftover apex without www
    }
  }
  if (/https:\/\/ashvi\.tech(?!\/)/.test(smBody.replaceAll("https://www.ashvi.tech", ""))) {
    // crude leftover apex check after stripping www
  }
  if (smBody.includes("https://ashvi.tech/") && !smBody.includes("https://www.ashvi.tech/")) {
    report.failures.push("sitemap still uses apex without www");
    report.ok = false;
  }
  // Prefer: every loc contains www
  const locs = all(smBody, /<loc>([^<]+)<\/loc>/g);
  for (const loc of locs) {
    if (!loc.startsWith(ORIGIN)) {
      report.failures.push(`sitemap loc not www: ${loc}`);
      report.ok = false;
    }
  }

  const expected = {
    "/": {
      title: "AshviTech — Building AI-Native Businesses",
      ogTitle: "AshviTech — Building AI-Native Businesses",
      canonical: `${ORIGIN}/`,
    },
    "/build": {
      title: "Build | AshviTech",
      ogTitle: "Build | AshviTech",
      canonical: `${ORIGIN}/build`,
    },
    "/transform": {
      title: "Transform | AshviTech",
      ogTitle: "Transform | AshviTech",
      canonical: `${ORIGIN}/transform`,
    },
    "/research": {
      title: "Research | AshviTech",
      ogTitle: "Research | AshviTech",
      canonical: `${ORIGIN}/research`,
    },
    "/about": {
      title: "About | AshviTech",
      ogTitle: "About AshviTech",
      canonical: `${ORIGIN}/about`,
    },
    "/contact": {
      title: "Contact | AshviTech",
      ogTitle: "Contact | AshviTech",
      canonical: `${ORIGIN}/contact`,
    },
  };

  for (const route of ROUTES) {
    const res = await fetch(base + route);
    const html = await res.text();
    const title = pick(html, /<title>([^<]*)<\/title>/i);
    const description = pick(
      html,
      /<meta name="description" content="([^"]*)"/i,
    );
    const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/i);
    const ogTitle = pick(html, /<meta property="og:title" content="([^"]*)"/i);
    const ogDescription = pick(
      html,
      /<meta property="og:description" content="([^"]*)"/i,
    );
    const ogUrl = pick(html, /<meta property="og:url" content="([^"]*)"/i);
    const ogImage = pick(html, /<meta property="og:image" content="([^"]*)"/i);
    const twitterCard = pick(html, /<meta name="twitter:card" content="([^"]*)"/i);
    const twitterTitle = pick(html, /<meta name="twitter:title" content="([^"]*)"/i);
    const twitterImage = pick(html, /<meta name="twitter:image" content="([^"]*)"/i);
    const robotsMeta = pick(html, /<meta name="robots" content="([^"]*)"/i);
    const jsonLdBlocks = all(
      html,
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
    ).map((raw) => {
      try {
        return JSON.parse(raw);
      } catch {
        return { parseError: true, raw: raw.slice(0, 120) };
      }
    });

    const exp = expected[route];
    const row = {
      status: res.status,
      title,
      description,
      canonical,
      ogTitle,
      ogDescription,
      ogUrl,
      ogImage,
      twitterCard,
      twitterTitle,
      twitterImage,
      robotsMeta,
      jsonLdBlocks,
      checks: {},
    };

    const expectCanonical = exp.canonical;
    // Next may emit with or without trailing slash on home
    const canonicalOk =
      canonical === expectCanonical ||
      (route === "/" && (canonical === ORIGIN || canonical === `${ORIGIN}/`));
    row.checks.title = title === exp.title;
    row.checks.ogTitle = ogTitle === exp.ogTitle;
    row.checks.canonical = canonicalOk;
    row.checks.ogUrl =
      ogUrl === expectCanonical ||
      (route === "/" && (ogUrl === ORIGIN || ogUrl === `${ORIGIN}/`));
    row.checks.ogImage = Boolean(
      ogImage &&
        (ogImage.includes("/brand/og-image.png") ||
          ogImage.endsWith("og-image.png")),
    );
    row.checks.twitter = twitterCard === "summary_large_image" && Boolean(twitterImage);
    row.checks.twitterTitle = twitterTitle === exp.ogTitle;
    row.checks.description = Boolean(description);
    row.checks.ogDescription = Boolean(ogDescription) && ogDescription === description;
    row.checks.noNoindex = !/noindex/i.test(html) && !/noindex/i.test(robotsMeta || "");
    row.checks.jsonLd = jsonLdBlocks.some(
      (b) => b && b["@type"] === "Organization" && b.url === ORIGIN,
    );
    row.checks.websiteLd = jsonLdBlocks.some((b) => b && b["@type"] === "WebSite");

    for (const [k, v] of Object.entries(row.checks)) {
      if (!v) {
        report.failures.push(`${route} failed check: ${k}`);
        report.ok = false;
      }
    }
    report.pages[route] = row;
  }

  fs.mkdirSync(__dirname, { recursive: true });
  fs.writeFileSync(path.join(__dirname, "validate-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: report.ok, failures: report.failures, pages: Object.fromEntries(
    Object.entries(report.pages).map(([k, v]) => [k, { title: v.title, canonical: v.canonical, ogTitle: v.ogTitle, ogUrl: v.ogUrl, ogImage: v.ogImage, checks: v.checks }]),
  ), robots: report.robots.body, sitemapLocs: locs }, null, 2));
  if (!report.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
