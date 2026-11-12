# AshviTech — Phase 5A SEO Foundation Implementation

**Date:** 12 November 2026  
**Canonical origin:** `https://www.ashvi.tech`  
**Reference:** `ASHVITECH_LAUNCH_READINESS.md`  
**Evidence:** `scripts/seo-implementation/validate-report.json`  
**Deploy:** not performed (Phase 5A stop condition)

---

## 1. Files changed

| File | Change |
|------|--------|
| `src/lib/seo.ts` | **New** — site origin, OG helpers, `buildPageMetadata()`, Organization/WebSite JSON-LD builders |
| `src/components/seo/JsonLd.tsx` | **New** — safe JSON-LD `<script>` serializer |
| `src/app/layout.tsx` | `metadataBase` → www; homepage canonical/OG/Twitter on www; inject Organization + WebSite JSON-LD once |
| `src/app/build/page.tsx` | Full per-page metadata via `buildPageMetadata` |
| `src/app/transform/page.tsx` | Full per-page metadata |
| `src/app/research/page.tsx` | Full per-page metadata |
| `src/app/about/page.tsx` | Full per-page metadata (keeps OG title “About AshviTech”; restores `og:image`) |
| `src/app/contact/page.tsx` | Full per-page metadata |
| `src/app/sitemap.ts` | All six `<loc>` values use www |
| `src/app/robots.ts` | Sitemap directive → `https://www.ashvi.tech/sitemap.xml` |
| `scripts/seo-implementation/validate.mjs` | Local production HTML/robots/sitemap checker |

DNS, Cloudflare, and apex→www **308** redirect were **not** modified.

---

## 2. Canonical URL mapping

| Route | Canonical |
|-------|-----------|
| `/` | `https://www.ashvi.tech` (emitted; equivalent to `…/`) |
| `/build` | `https://www.ashvi.tech/build` |
| `/transform` | `https://www.ashvi.tech/transform` |
| `/research` | `https://www.ashvi.tech/research` |
| `/about` | `https://www.ashvi.tech/about` |
| `/contact` | `https://www.ashvi.tech/contact` |

`metadataBase` is `https://www.ashvi.tech`.  
Apex `https://ashvi.tech` continues to **308** → www (verified separately against live DNS; unchanged by this phase).

---

## 3. Per-page metadata table

| Page | Document title | Meta description (unchanged approved copy) | `og:title` | `og:url` | `og:image` | Twitter |
|------|----------------|--------------------------------------------|------------|----------|------------|---------|
| Home | AshviTech — Building AI-Native Businesses | AI-native company… | same as title | www `/` | `/brand/og-image.png` | `summary_large_image` + same title/image |
| Build | Build \| AshviTech | Co-building AI-native ventures… | Build \| AshviTech | www `/build` | same image | yes |
| Transform | Transform \| AshviTech | Partner to rethink operations… | Transform \| AshviTech | www `/transform` | same image | yes |
| Research | Research \| AshviTech | Ashvi Research — independent inquiry… | Research \| AshviTech | www `/research` | same image | yes |
| About | About \| AshviTech | Technology institution framing… | **About AshviTech** | www `/about` | same image | yes |
| Contact | Contact \| AshviTech | Venture / challenge / question CTA… | Contact \| AshviTech | www `/contact` | same image | yes |

`buildPageMetadata()` always re-specifies `openGraph.images` and Twitter fields so nested Open Graph objects do **not** drop the image or inherit the homepage OG title/URL.

No new social artwork; no page body copy changes.

---

## 4. Structured-data implementation

Injected **once** in the root layout (not duplicated per route module):

**Organization**

- `@type`: Organization  
- `name`: AshviTech  
- `url`: `https://www.ashvi.tech`  
- `logo`: `https://www.ashvi.tech/brand/logo-horizontal.png`  
- `email`: `hello@ashvi.tech`  

**WebSite** (optional, included)

- `@type`: WebSite  
- `name`: AshviTech  
- `url`: `https://www.ashvi.tech`  
- `publisher`: Organization name + url only  

No founding year, address, employee counts, awards, sameAs, or invented credentials.  
JSON is serialized with `<` → `\u003c` escaping via `JsonLd`.

---

## 5. Sitemap and robots verification

**robots.txt** (local production):

```
User-Agent: *
Allow: /

Sitemap: https://www.ashvi.tech/sitemap.xml
```

**sitemap.xml** locs:

- `https://www.ashvi.tech/`
- `https://www.ashvi.tech/build`
- `https://www.ashvi.tech/transform`
- `https://www.ashvi.tech/about`
- `https://www.ashvi.tech/research`
- `https://www.ashvi.tech/contact`

No `/api/*` entries. Public pages remain indexable (no `noindex` in validated HTML).

---

## 6. Build and test results

| Check | Result |
|-------|--------|
| `npm test` | **30/30** pass |
| `next build` (15.5.29) | Success |
| HTML validation (six routes on `next start :3200`) | **All checks pass** — see `scripts/seo-implementation/validate-report.json` |
| `robots.txt` / `sitemap.xml` | www-aligned |
| Live apex redirect (unchanged) | **308** → `https://www.ashvi.tech/` |
| Accidental noindex | None |
| JSON-LD parse | Organization + WebSite present |
| OG image URL | `https://www.ashvi.tech/brand/og-image.png` on all six |

---

## 7. Google Search Console setup (manual)

Verification is **Domain property** for `ashvi.tech` via **Cloudflare DNS** — no meta tags and no DNS changes in this phase.

After this build is **deployed**:

1. Open [Google Search Console](https://search.google.com/search-console) → **Add property** → **Domain** → enter `ashvi.tech`.  
2. Copy the Google TXT verification record.  
3. In **Cloudflare** → DNS for `ashvi.tech` → add the TXT record exactly as Google provides.  
4. Click **Verify** in Search Console (DNS may take a few minutes).  
5. Confirm the preferred browsing host is www (existing 308 is sufficient).  
6. **Sitemaps** → submit `https://www.ashvi.tech/sitemap.xml`.  
7. Use URL Inspection on homepage + one inner page after indexing begins.  
8. Do **not** add placeholder `google-site-verification` meta tags in the app unless you later choose URL-prefix verification instead of Domain DNS.

---

## 8. Remaining SEO limitations

| Item | Notes |
|------|-------|
| Shared OG image | All pages use the same `/brand/og-image.png` (by design this phase) |
| No per-page JSON-LD beyond sitewide Organization/WebSite | Adequate for launch; WebPage/ContactPage optional later |
| No `sameAs` social profiles | None approved |
| `/api/` still crawlable in robots | Optional future `Disallow: /api/` |
| Apex vs www in older indexes | Expect consolidation via 308 + www canonicals after deploy/recrawl |
| Analytics / Search Console API | Not added |
| Upstash / rate limit | Unrelated; still deferred |
| Not deployed in 5A | Live site still serves pre-5A apex canonicals until a deploy |

---

*Phase 5A complete: technical SEO foundation implemented and validated locally; deploy and GSC DNS verification are follow-on steps.*
