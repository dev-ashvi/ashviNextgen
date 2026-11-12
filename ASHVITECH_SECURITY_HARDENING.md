# AshviTech — Phase 4A Security Hardening & Dependency Remediation

**Date:** 12 November 2026  
**Scope:** Dependencies + HTTP security headers (+ Build caption contrast)  
**Out of scope:** Resend/Upstash production credential wiring; Contact SSR local-only issue; Next.js 16; redesign  
**Evidence:** `scripts/security-hardening/`, `scripts/stability/phase-4a-guard/`

---

## Verdict

- **Next.js patched** `15.5.14` → **`15.5.29`** (Maintenance LTS November 2026 security line).  
- **React unchanged** at **19.2.4**.  
- **Site-wide security headers** added in `next.config.ts`, including CSP **Report-Only**.  
- **Build figcaption contrast** raised to WCAG AA (`/55` → `/60`).  
- **All six pages** render; Contact validation + honeypot behave; Vitest **30/30**; production build succeeds.  
- **Homepage deferrals retained** (build First Load JS home **123 kB**; HTML transfer still **~27 KB**).  
- **Not deployed** (per scope).

---

## 1. Vulnerabilities identified

### 1.1 Next.js (authoritative + npm audit)

Authoritative source: [November 2026 Security Release](https://nextjs.org/blog/november-2026-security-release) and `npm audit` against `next@15.5.14`.

`npm audit` also listed many earlier 15.5.x advisories (DoS, middleware bypasses, image RCE, etc.) with fix floors through **15.5.24 / 15.5.27 / 15.5.28**. Official Maintenance LTS patched release for the November bundle is **`15.5.29`** (also the latest `15.5.*` on npm at time of patch).

| Advisory / theme | Severity | Affected (15.x) | Fixed | Used by AshviTech? | Mitigation |
|------------------|----------|-----------------|-------|--------------------|------------|
| GHSA-2xp9-vwfh-vxw4 — Image Optimization AVIF RCE | Critical | `<15.5.24` | ≥15.5.24 (superseded by 15.5.29) | **Yes** — `images.formats` includes `avif` | Upgrade |
| GHSA-2464-fhr4-w9xw — Image Optimization SVG RCE | Critical | `≤15.5.27` | ≥15.5.28 / 15.5.29 | Image optimizer in use; SVG not allowlisted | Upgrade |
| GHSA-p293-qw3h-jr36 — Windows-hosted unauthenticated RCE | Critical | `<15.5.24` | ≥15.5.24 | Local Windows builds; prod is Vercel | Upgrade |
| Multiple high: RSC/Server Action DoS, SSRF, middleware/proxy bypasses (e.g. GHSA-q4gf-8mx6-v5v3, GHSA-8h8q-6873-q5fj, GHSA-c4j6-fc7j-m34r, GHSA-492v-c6pp-mqqv, GHSA-267c-6grr-h53f, GHSA-26hh-7cqf-hhc6, GHSA-m99w-x7hq-7vfj, …) | High | variously `<15.5.15`–`<15.5.21` | ≤15.5.21+ floors | Partially — App Router yes; **no custom middleware** | Upgrade |
| GHSA-7qx7-33qx-rqx2 — SVG rejection bypass in image optimizer | Medium | through 15.5.28 | **15.5.29** | Optimizer on; `dangerouslyAllowSVG` not enabled | Upgrade |
| GHSA-f3mh-rxg3-f5g2 — HttpOnly cookie leak on **Edge** routes | Medium | through 15.5.28 | **15.5.29** | **No** — Contact is `runtime = 'nodejs'`; no Edge handlers | Upgrade (defence in depth) |
| GHSA-pc58-hwjq-p385 — cross-client response injection (self-hosted + fetched Response) | Medium | (self-hosted patterns) | **15.5.29** | **No** matching proxy Response-forwarding pattern | Upgrade |
| Cache Components / `use cache` / `unstable_cache` disclosure & shell poisoning (GHSA-mfr8-8qww-v76h High, plus Medium siblings) | High–Medium | primarily Cache Components configs | **15.5.29** | **No** — codebase has **no** `use cache` / `unstable_cache` | Upgrade |

**Clean `npm audit` ≠ no vulns:** even after patching, `next` remains listed **via transitive `postcss`**, and toolchain packages still report issues. Framework CVE remediation required reading GitHub/Next advisories, not audit alone.

### 1.2 Remaining after Next patch (not production app runtime)

| Package | Severity | Notes | Action this phase |
|---------|----------|-------|-------------------|
| `vitest` / `tinypool` | Critical | Dev test runner / UI server advisories | **Deferred** — not shipped to Vercel; upgrading Vitest is a major bump |
| `playwright` | High | Browser download SSL verify (dev) | Deferred |
| `brace-expansion`, `js-yaml`, `nanoid`, `source-map-js` | High | Transitive via eslint/typescript-eslint tooling | Deferred (`npm audit fix` where non-breaking later) |
| `postcss` / `sharp` (via Next) | High/Moderate | Bundled with Next; fixAvailable often points at **Next 16** | Documented; **no Next 16 migration** |
| `esbuild` / `vite` (via Vitest) | Moderate | Dev-server exposure | Deferred |

---

## 2. Patched dependency versions

| Package | Before | After |
|---------|--------|-------|
| `next` | 15.5.14 | **15.5.29** |
| `eslint-config-next` | 15.5.14 | **15.5.29** |
| `react` / `react-dom` | 19.2.4 | **19.2.4** (unchanged) |

Lockfile updated via `npm install next@15.5.29 eslint-config-next@15.5.29 --save-exact`.

---

## 3. Files modified

| File | Change |
|------|--------|
| `package.json` / `package-lock.json` | Next + eslint-config-next → 15.5.29 |
| `next.config.ts` | Site-wide security headers + CSP Report-Only; retain homepage sculpture `Link` preload |
| `src/components/build/BuildPage.tsx` | Figcaption opacity `/55` → `/60` |
| `scripts/security-hardening/*` | Audit snapshots + verify harness |
| `ASHVITECH_SECURITY_HARDENING.md` | This report |

---

## 4. Security headers added

Implemented in `next.config.ts` for `/:path*`:

| Header | Value |
|--------|--------|
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Content-Security-Policy-Report-Only` | See §5 |
| `Strict-Transport-Security` | `max-age=63072000` (**no** `includeSubDomains`, **no** `preload`) |

Homepage retains:

`Link: </art/sculpture-900.webp>; rel=preload; as=image; type=image/webp`

### Deployed environment (observed before app-header ship)

`https://www.ashvi.tech/` (Vercel behind Cloudflare):

- Already had **`Strict-Transport-Security: max-age=63072000`** (no includeSubDomains/preload).
- Did **not** expose app-level `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or CSP.
- Apex `ashvi.tech` → 308 → `www.ashvi.tech`.

App headers therefore **fill gaps**; HSTS max-age mirrors the platform (no stricter subdomain/preload claims). After the next deploy, expect both platform and app HSTS with the same max-age (browsers tolerate duplicate HSTS).

Local `next start` previously had **no** security headers — now verified present on all six routes.

---

## 5. CSP policy and limitations

**Mode:** `Content-Security-Policy-Report-Only` (not enforced).

**Policy string:**

```
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
form-action 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self' data:;
connect-src 'self';
worker-src 'self' blob:;
media-src 'self';
manifest-src 'self'
```

**Rationale**

- Next.js App Router emits **inline** bootstrap/runtime script and style without a nonce pipeline in this app.
- Fonts are self-hosted via `next/font` (no `fonts.googleapis.com` at runtime).
- Images/art/WebGL/canvas/COBE are same-origin; Contact API is same-origin `POST /api/contact`.
- External navigations (`financewyz.ai`) are top-level links — not `connect-src`.
- **`unsafe-eval` omitted** (not required for this production build in assessment).
- **`unsafe-inline` retained only in Report-Only** for script/style so the policy remains realistic for Next without breaking hydration when flipped later.

**Path to enforcement**

1. Introduce request nonce middleware (`script-src`/`style-src` `'nonce-…'`).  
2. Confirm zero Report-Only violations across six pages + Contact submit.  
3. Remove `'unsafe-inline'`.  
4. Promote header to `Content-Security-Policy`.

Clickjacking is already **enforced** via `X-Frame-Options: DENY` (+ Report-Only `frame-ancestors 'none'`).

---

## 6. Contact API security assessment

Reviewed `src/app/api/contact/route.ts`, `lib/contact/{schema,email,rate-limit}.ts` — **no redesign**.

| Control | Status |
|---------|--------|
| Runtime | `nodejs` (not Edge) |
| Body size | `Content-Length` + raw length cap **12 000** bytes → 413 |
| Validation | Server-side `validateContactInput` |
| Honeypot | `company_website` → fake `ok: true` without send |
| Errors | Generic client messages; logs only `{ code }` (no PII/body) |
| Secrets | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, Upstash URL/token via `process.env` only |
| Browser exposure | **Not** in `.next/static` client bundles; env names not in homepage HTML |
| Rate limit | Upstash sliding window **5 / 15 m** when configured; **fail-open** (`allowed: true`, `mode: 'unavailable'`) without credentials |

**Production configuration (separate from defects):** Resend + Upstash still require env on Vercel (handled outside Phase 4A). Fail-open rate limiting is intentional documentation debt, not a silent “in-memory fake.”

Verified this session: invalid payload → **400** with field errors; honeypot → **200 `{ ok: true }`** without requiring mail. No real email sent.

---

## 7. Accessibility contrast correction

| Item | Detail |
|------|--------|
| Element | Build WYZ figcaption — “Product interface · Illustrative demo data” |
| Before | `text-[#021336]/55` ≈ **3.98:1** on `#eef1f7` |
| After | `text-[#021336]/60` ≈ **4.68:1** on `#eef1f7` / **4.80:1** on `#F8F9FD` |
| Layout | Unchanged (colour opacity only) |

---

## 8. Regression results

| Check | Result |
|-------|--------|
| `npm test` | **30/30** pass |
| `next build` (15.5.29) | Success (one transient `next/font` network flake; rebuild OK) |
| Routes `/`, `/build`, `/transform`, `/research`, `/about`, `/contact` | **200**, titles OK |
| Mobile menu | Opens; Contact link reachable |
| Desktop header links | Build / Transform / Research / About / Contact present |
| Eng. Philosophy accordion | Interactive buttons present after scroll |
| Research landscape | External SVG image present |
| Reduced motion | No hidden reveal nodes counted |
| About WebGL | Headless Chromium often reports 0 canvases — not treated as a regression vs prior audits |
| Contact API validation / honeypot | Pass |
| Console | Only expected `400` from intentional invalid API probe |
| Security headers | Present on all six routes locally |
| Deferrals | Home route size **3.17 kB**; First Load JS **123 kB** (was ~122 kB) |

Evidence: `scripts/security-hardening/verify-report.json`.

---

## 9. npm audit before / after

| | Before (`15.5.14`) | After (`15.5.29`) |
|--|--------------------|-------------------|
| Total | **21** | **21** |
| Critical | **3** | **2** |
| High | **8** | **8** |
| Moderate | **10** | **11** |

**Critical before:** dominated by **`next`** (image/Windows RCE family).  
**Critical after:** **`vitest` / `tinypool` only** (dev).  
**`next` direct advisories:** cleared to **moderate via transitive `postcss`**, with `fixAvailable` often **16.4.x** (rejected for this phase).

Snapshots:

- `scripts/security-hardening/npm-audit-before.json`
- `scripts/security-hardening/npm-audit-after.json`

---

## 10. Remaining production configuration requirements

1. **Deploy** this patch (Next 15.5.29 + headers) to Vercel — not done in 4A.  
2. **Resend:** set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (+ optional `CONTACT_TO_EMAIL`); controlled real send.  
3. **Upstash:** set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`; confirm 429 after >5 posts / 15 min / IP.  
4. **CSP enforcement** via nonce middleware when ready.  
5. **Dev toolchain** advisories (Vitest/Playwright/eslint transitive) — schedule non-breaking bumps.  
6. **Confirm subdomains** before ever adding HSTS `includeSubDomains` / `preload`.  
7. Note: live `Access-Control-Allow-Origin: *` on HTML was observed from the current deployment platform; not introduced by this change — review at deploy time if still present.

---

## Performance protection (vs Phase 3D baseline)

Single Lighthouse mobile run (`scripts/stability/phase-4a-guard/`, LH 12.2.1):

| Metric | Phase 3D median (5) | Phase 4A guard (1) |
|--------|---------------------|--------------------|
| LCP | ~4.47 s | **4.56 s** |
| FCP | ~3.20 s | **3.21 s** |
| HTML | ~27 KB | **27 KB** |
| JS transfer | ~127 KB | **133 KB** |
| Perf score | 46 | 44 |
| TBT | noisy ~3.2 s band | 3122 ms |

No major regression warranting revert of the security patch. JS +6 KB is consistent with a framework patch bump, not re-eager DIN/globe. HTML win retained.

---

## Success criteria checklist

- [x] Applicable Next critical/high advisories remediated via **15.5.29**, with unused Cache Components / Edge items explicitly scoped.  
- [x] Security headers appropriate for app + existing Vercel/CF HSTS.  
- [x] Six pages + interactions functional; tests + production build green.  
- [x] No automatic deploy.

*Phase 4A complete.*
