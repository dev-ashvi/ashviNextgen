# AshviTech — Phase 5B Privacy-First Website Analytics

**Date:** 12 November 2026  
**Scope:** Vercel Web Analytics only (`@vercel/analytics`)  
**Site:** https://www.ashvi.tech  
**Deploy:** not performed in this phase  

---

## 1. Files modified

| File | Change |
|------|--------|
| `package.json` / `package-lock.json` | Added `@vercel/analytics@^2.0.1` |
| `.npmrc` | `legacy-peer-deps=true` so optional multi-framework peers do not conflict with Vitest’s Vite 5 |
| `src/components/analytics/VercelAnalytics.tsx` | **New** — App Router client wrapper + `beforeSend` privacy filter |
| `src/components/analytics/vercel-analytics.test.ts` | **New** — unit tests for query stripping / API drop |
| `src/app/layout.tsx` | Mount `<VercelAnalytics />` once at end of `<body>` |
| `next.config.ts` | CSP Report-Only comments clarified (same-origin insights; no third-party hosts) |
| `scripts/analytics-setup/verify.mjs` | Local browser verification harness |
| `ASHVITECH_ANALYTICS_SETUP.md` | This document |

**Pre-check:** No prior `@vercel/analytics`, GA/GTM, Plausible, PostHog, or similar trackers in app source.

---

## 2. Integration details

### Package and API

- Official package: `@vercel/analytics` **2.0.1**
- Import: `@vercel/analytics/next` (App Router; tracks initial loads **and** client-side route changes via Next navigation hooks)
- Single mount in root layout only → avoids duplicate page views from multiple `<Analytics />` instances

### Privacy `beforeSend`

```ts
// Strips all query params + hash; drops /api/* paths
sanitizeAnalyticsEvent(event)
```

Rationale: Contact may use `?interest=`; future tokens/ids must not be assumed safe. Prefer strip-all over allowlists.

### Environment behaviour

| Environment | Behaviour |
|-------------|-----------|
| Local `next dev` / `next start` | Script may request `/_vercel/insights/script.js`; **production intake to Vercel dashboards generally requires a Vercel deployment with Web Analytics enabled** |
| Vercel Preview | Collects when Web Analytics is enabled for the project (confirm in dashboard filters by environment) |
| Vercel Production | Page views after enable + deploy |

Mode defaults to **`auto`** (package default): production collection on Vercel; development debug logging without treating local as production traffic.

### Performance

- Analytics is a deferred client script (not in the critical HTML SSR path for content)
- Production build after integration: homepage First Load JS still **123 kB**; shared JS **103 kB** (unchanged vs Phase 5A table)
- No design, animation, SEO, navigation, or Contact API changes
- Reduced-motion paths untouched

### CSP / security headers

- Report-Only CSP keeps `script-src 'self' 'unsafe-inline'` and `connect-src 'self'`
- On Vercel, Web Analytics uses **same-origin** `/_vercel/insights/*` (and resilient same-deployment intake in v2) — **no third-party analytics hosts added**
- No GA/GTM origins introduced
- Existing security headers unchanged in behaviour

---

## 3. Privacy assessment

| Requirement | Status |
|-------------|--------|
| No analytics cookies from our code | **Met** — local verify showed empty `document.cookie` after load + navigation |
| No user identification in our events | **Met** — pageview URLs only; Vercel aggregates without cross-site identity (per Vercel privacy docs) |
| No session recording | **Met** — not using session replay products |
| No contact form field tracking | **Met** — no form listeners / custom events shipped |
| No email/name/message in analytics | **Met** |
| No sensitive query parameters | **Met** — `beforeSend` clears **all** search params |
| No cross-site profiling via our integration | **Met** — first-party Vercel Web Analytics only |

Vercel’s platform still records coarse geo / device / referrer for aggregated stats (documented by Vercel). We do not add extra identifiers.

---

## 4. Measurement plan

### Business questions → Vercel reports

| Question | Use |
|----------|-----|
| 1. How many visitors reach AshviTech? | Visitors / page views over time (Production) |
| 2. Where do they come from? | Referrers filter |
| 3. Which pages attract interest? | Top pages / routes |
| 4. Are visitors exploring Build, Transform, or Research? | Compare `/build`, `/transform`, `/research` page views |
| 5. Are visitors reaching Contact? | `/contact` page views |

Custom events are **not** implemented until plan support is confirmed in the project dashboard.

### Future custom-event plan (do not ship yet)

| Event name | Intended trigger | Properties (allowed) | Forbidden |
|------------|------------------|----------------------|-----------|
| `build_cta_click` | Primary Build CTA | optional `location` (`home` \| `nav` \| `page`) | email, name, message |
| `transform_cta_click` | Primary Transform CTA | optional `location` | PII |
| `research_collaboration_click` | Research collaboration CTA | optional `location` | PII |
| `contact_submit_success` | After successful Contact API `ok: true` | optional `interest` category only if still desired | never name/email/message |

When implementing, call `track()` from `@vercel/analytics` only after confirming custom events are available on the AshviTech Vercel plan.

---

## 5. Verification results

| Check | Result |
|-------|--------|
| Unit tests | **33/33** pass (includes 4 analytics sanitize tests) |
| `next build` | Success on Next.js **15.5.29** |
| Script present (local prod) | `/_vercel/insights/script.js` requested; `window.va` / queue present |
| Cookies after browse | **None** set by our page |
| CSP Report-Only | Still `connect-src 'self'`; no third-party analytics hosts |
| Duplicate `<Analytics />` | Only root layout |
| Form / PII in tracking code | None |
| Actual production metrics | **Must be confirmed in Vercel dashboard after deploy + enabling Web Analytics** |

Evidence: `scripts/analytics-setup/verify-report.json`

---

## 6. Vercel dashboard setup instructions

1. Deploy this commit to the AshviTech Vercel project (when ready — not done in 5B).  
2. Vercel Dashboard → project → **Analytics** → **Enable** Web Analytics (if not already).  
3. Wait for a production deployment that includes `@vercel/analytics`.  
4. Visit https://www.ashvi.tech and navigate `/` → `/build` → `/contact`.  
5. In Analytics, confirm page views appear (may take a few minutes).  
6. Filter by **Production**; review Top Pages and Referrers against the measurement plan above.  
7. Confirm custom events are offered on the current plan before implementing the future event table.

---

## 7. Plan-dependent limitations

- **Custom events** may require a paid Analytics tier — verify before coding `track()`.  
- **Local `next start`** is not a substitute for dashboard collection proof.  
- **Resilient Intake (v2)** may use non-constant paths under the deployment; keep CSP same-origin unless Report-Only ever shows blocked intake (then revisit carefully — do not open wildcard third parties).  
- **`.npmrc` legacy-peer-deps** is required for clean installs of `@vercel/analytics` alongside Vitest; document for contributors.  
- Speed Insights (`@vercel/speed-insights`) was **not** added (out of scope).

---

*Phase 5B complete: privacy-filtered Vercel Web Analytics integrated and verified locally; enable + confirm in the Vercel dashboard after the next deploy.*
