# AshviTech — Post-Deployment Verification & SEO Audit

**Date:** 12 November 2026  
**Scope:** Live production smoke test + SEO readiness (audit only — no code or deploy changes)  
**Production host:** `https://www.ashvi.tech` (apex `https://ashvi.tech` → **308** to www)  
**Evidence:** `scripts/launch-readiness/live-audit.json`, `nav-recheck.json`, `headers-raw.txt`

---

## Executive summary

The Phase 4A deploy is **live and functionally healthy**: all six routes return **200** on www, Phase 4A **security headers** are present, navigation (including **What We Do** and mobile menu) works, Contact validation works without sending mail, and there is **no accidental noindex**.

SEO foundations exist (unique titles/descriptions, robots allow, sitemap lists six pages, OG image asset serves). The main gaps before treating search/social as “launch complete” are:

1. **Canonical / sitemap / metadataBase use apex `ashvi.tech` while the preferred live domain is `www.ashvi.tech`.**  
2. **No Organization (or WebSite) JSON-LD.**  
3. **Page-level Open Graph is incomplete** on several routes (About missing `og:image`; Build/Transform/Research/Contact largely inherit homepage OG title/URL).  
4. **Upstash rate limiting remains inactive** (intentional; Resend delivery already confirmed by owner).  
5. **Google Search Console** is not yet evidenced (no verification meta/DNS token in the app).

---

## 1. Verified live behaviour

### 1.1 HTTP status and redirects

| URL pattern | Result |
|-------------|--------|
| `https://ashvi.tech/{six routes}` | **308** → `https://www.ashvi.tech/...` |
| `https://www.ashvi.tech/{six routes}` | **200** |

HTTPS is in force. Apex consistently redirects to **www** (preferred browsing domain).

### 1.2 Security headers (www)

Confirmed on `/`, `/build`, `/transform`, `/research`, `/about`, `/contact`:

| Header | Present |
|--------|---------|
| `X-Content-Type-Options: nosniff` | Yes |
| `Referrer-Policy: strict-origin-when-cross-origin` | Yes |
| `X-Frame-Options: DENY` | Yes |
| `Permissions-Policy` (camera/mic/geo/payment/usb disabled) | Yes |
| `Content-Security-Policy-Report-Only` | Yes |
| `Strict-Transport-Security: max-age=63072000` | Yes (no `includeSubDomains` / `preload`) |

Homepage also emits sculpture `Link` preload. Apex redirect responses carry HSTS via Cloudflare but not the full app header set (expected for 308).

### 1.3 Navigation

| Check | Result |
|-------|--------|
| Desktop links Build / Transform / Research / About / Contact | Present |
| **What We Do** disclosure (`aria-haspopup="menu"`) | Opens; Build + Transform items visible |
| **Our Work** → `/#our-work` | Hash set; featured/work section detectable |
| Mobile **Open menu** | Opens portal; Build, Transform, Our Work, Contact reachable |

### 1.4 Artwork, fonts, motion

| Check | Result |
|-------|--------|
| Hero sculpture `/art/sculpture-900.webp` | Present and visible; asset **200** |
| Brand logos in header/footer | Present; `alt="AshviTech"` |
| OG / icons | `/brand/og-image.png`, icon-32/48/180 all **200** |
| Fonts | Inter + Newsreader faces load; hero uses `font-serif` (Newsreader stack). Headless computed `h1` sometimes still reported Inter — treat as measurement noise; spot-check in a real browser. |
| Animations | Document animations present (`getAnimations` count &gt; 0); hero opacity mid-transition observed |
| `prefers-reduced-motion: reduce` | Body copy / hero text remain visible; no opacity-0 reveal trap counted |

### 1.5 Contact form

| Check | Result |
|-------|--------|
| Form renders | Yes |
| Client validation on empty submit | Yes |
| API invalid payload | **400** with field errors (no email sent) |
| Live Resend delivery | **Confirmed by owner** — not re-tested here |
| Upstash rate limit | **Inactive** when Redis env unset — fail-open by design (`mode: 'unavailable'`). **Do not treat as production abuse protection until Upstash is configured.** |

### 1.6 Console / indexing traps

- No `pageerror` noise in the live audit run.  
- No `noindex` in HTML; no `X-Robots-Tag` on sampled responses.  
- Intentional invalid Contact API call may log a 400 in network console only.

---

## 2. SEO findings

### 2.1 Titles and meta descriptions (unique — good)

| Route | Title | Description |
|-------|-------|-------------|
| `/` | AshviTech — Building AI-Native Businesses | AI-native company building with domain experts / transforming operations |
| `/build` | Build \| AshviTech | Co-building AI-native ventures… |
| `/transform` | Transform \| AshviTech | Partner to rethink operations… |
| `/research` | Research \| AshviTech | Independent inquiry into intelligent systems… |
| `/about` | About \| AshviTech | Technology institution framing… |
| `/contact` | Contact \| AshviTech | Venture / challenge / technical question CTA |

Copy aligns with approved positioning; no invented customers, metrics, or credentials observed in metadata or sampled body text.

### 2.2 Canonical URLs vs preferred www

Live canonicals resolve to **apex**:

- `https://ashvi.tech/` … `/contact`  
- About uses relative `/about` → absolutised to apex via `metadataBase: https://ashvi.tech`

**Preferred user-facing host is www** (308 from apex). Search engines usually consolidate via redirect, but sitemap + canonicals + `robots` sitemap URL all advertise **non-www**, which is inconsistent with the redirect target.

### 2.3 robots.txt

```
User-Agent: *
Allow: /

Sitemap: https://ashvi.tech/sitemap.xml
```

- Allows crawling of the public site.  
- Sitemap URL is apex (same www mismatch).  
- No Disallow of `/api/` (optional hygiene).

### 2.4 sitemap.xml

- **200**, lists all **six** public pages.  
- Priorities/changefreq set.  
- Locs are apex `https://ashvi.tech/...` (not www).

### 2.5 Open Graph / Twitter

| Item | Status |
|------|--------|
| Homepage OG + Twitter complete | Yes (`og:image` 1200×630, alt AshviTech) |
| OG image file | Serves **200** `image/png` |
| Build / Transform / Research / Contact | `<title>` unique, but **OG title/URL often still homepage** (root metadata inheritance) |
| About | Custom `og:title` / `og:description` / `og:url`; **`og:image` missing** in live DOM |
| Twitter card | `summary_large_image` sitewide; image points at apex OG URL |

Social shares of inner pages may preview as the homepage story rather than page-specific copy (except About title/description).

### 2.6 Logo and social image

- Official horizontal logos used in chrome with meaningful alt.  
- Watermark / some sculpture references use **empty alt** (decorative — acceptable if purely decorative).  
- `/brand/og-image.png` is the social share image.

### 2.7 Structured data

- **No** `application/ld+json` on any of the six pages.  
- **Organization** / **WebSite** schema absent.

### 2.8 Semantics and content accessibility to crawlers

| Check | Result |
|-------|--------|
| One `h1` per page | Yes (all six) |
| Heading hierarchy | Sensible H1→H2→H3 samples |
| Main copy in HTML | Yes — not JS-only shells; body text samples include approved positioning |
| Images missing `alt` attribute | **None** in audit |
| Empty `alt` | Decorative watermark / some hero sculpture refs (Build/Transform/About) |

### 2.9 Search Console readiness

- No `google-site-verification` meta tag in live HTML.  
- No app-owned DNS TXT documentation in-repo.  
- Domain is crawlable (`Allow: /`) and sitemap is fetchable — ready for **manual** GSC property setup on the preferred host once verification is added outside this audit.

---

## 3. Missing metadata and indexing requirements

| Gap | Why it matters |
|-----|----------------|
| Align **canonical**, **metadataBase**, **sitemap `<loc>`**, and **robots Sitemap:** with preferred host (**`https://www.ashvi.tech`**) *or* reverse the redirect policy to apex | Avoid split signals between www and apex |
| Per-page **Open Graph** (title, description, url, image) for Build, Transform, Research, Contact; restore **og:image** on About | Correct link previews |
| **Organization** (+ optional **WebSite**) JSON-LD using only approved facts (name, url, logo, `hello@ashvi.tech`) | Knowledge panel / entity clarity |
| Optional `WebPage`/`ContactPage` types | Low priority |
| Google Search Console verification (meta or DNS) on the **www** property (and apex if required) | Index monitoring, sitemap submit |
| Submit sitemap in GSC after host alignment | Discovery |
| Optional `robots` Disallow for `/api/` | Reduce useless API crawls |

Do **not** invent Organization extras (founding date, employee counts, sameAs socials, awards) unless approved.

---

## 4. Remaining security or deployment concerns

| Item | Severity | Notes |
|------|----------|-------|
| **Upstash unset → contact rate limit fail-open** | High (ops) | Owner deferred Redis; document as **known residual risk**. Resend works. |
| **`Access-Control-Allow-Origin: *`** on many HTML responses | Medium | Observed on www static/prerender responses; unusual for a marketing site; review Vercel/CF config (not introduced as an app header in Phase 4A). |
| **CSP Report-Only only** | Medium (planned) | Enforced CSP still needs nonce path (Phase 4A). |
| HSTS without `includeSubDomains` / `preload` | Low / intentional | Correct until all subdomains are confirmed HTTPS. |
| Next **15.5.29** shipped | — | Critical Next advisories addressed in 4A. |
| Dev-only npm audit residuals (Vitest etc.) | Low | Not runtime. |
| Large HTML on `/build` (~817 KB) and `/research` (~609 KB) transfer sizes | Perf residual | Unrelated to 4A security; watch for crawl/perf budget later. |
| Contact remains dynamic (`private, no-store`) | Expected | Fine for personalized `interest` query. |

---

## 5. Recommended changes (priority)

### P0 — Do soon (indexing / trust)

1. **Pick one canonical host and align everything** — Given live **www** preference: set `metadataBase`, canonicals, `sitemap.ts` locs, and `robots.ts` sitemap URL to `https://www.ashvi.tech`. Keep apex → www 308.  
2. **Configure Upstash** (when ready) so Contact is not unlimited — separate from this audit; do not implement Redis in-app now.  
3. **Verify site in Google Search Console** (www property) and submit sitemap after host alignment.

### P1 — Social + entity SEO

4. Add **page-specific Open Graph** (and matching Twitter) for Build, Transform, Research, Contact; ensure About includes **og:image**.  
5. Add minimal **Organization** JSON-LD (name, url, logo, email) — approved facts only.  
6. Investigate / remove unnecessary **`Access-Control-Allow-Origin: *`** on document responses if it is platform-configurable.

### P2 — Hardening & polish

7. Plan **CSP enforcement** (nonce middleware) after Report-Only is clean.  
8. Optional `Disallow: /api/` in robots.  
9. Spot-check Newsreader on the homepage hero in Safari/Chrome (automated font-family string was ambiguous).  
10. Later: HTML weight on Build/Research if crawl/LCP budgets tighten.

### Explicit non-actions (this audit)

- No redesign, no application code changes, no deploy performed.  
- No additional Contact emails sent.  
- No Upstash/Redis implementation.

---

## Evidence index

| Path | Contents |
|------|----------|
| `scripts/launch-readiness/live-audit.json` | Full live HTTP, SEO DOM extraction, smoke results |
| `scripts/launch-readiness/nav-recheck.json` | Mobile menu + What We Do dropdown + font face check |
| `scripts/launch-readiness/headers-raw.txt` | Apex/www header dump |
| `scripts/launch-readiness/live-audit.mjs` | Reproducible live audit harness |

---

*Audit complete. Production is usable; SEO/host alignment and rate-limit configuration are the primary launch residuals.*
