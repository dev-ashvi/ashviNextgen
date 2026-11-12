# AshviTech — Phase 3A Production Readiness Audit

**Date:** 12 November 2026 (Asia/Kolkata)  
**Scope:** Six marketing routes — `/`, `/build`, `/transform`, `/research`, `/about`, `/contact`  
**Mode:** Observation and measurement only. No application, CSS, asset, dependency, env, or design changes.  
**Evidence root:** `scripts/production-audit/`

---

## 1. Executive summary

The site builds cleanly (Next.js 15.5.14 / React 19.2.4 / Node v22.14.0) and **30/30 unit tests pass**. Five of six pages serve successfully from a local production build. Desktop Lighthouse performance is strong (71–100); CLS is excellent across measured pages.

**Release is blocked** by a reproducible **HTTP 500 on `/contact`** under `next start` after a clean `.next` rebuild. Contact API validation works, but the page itself does not render. Without a working contact page, the primary conversion path fails.

Beyond that blocker:

| Area | Verdict |
|------|---------|
| Navigation (5 pages) | Pass — dropdown, anchors, mobile menu Escape/focus-first |
| Accessibility (automated) | Strong (96–100); one Build figcaption contrast miss |
| Reduced motion / `AnimatedReveal` | Pass — content remains visible |
| WebGL lifecycle (About + globe) | Largely sound; minor follow-ups only |
| Performance (mobile lab) | Homepage weak (LCP 5.4s, TBT 2.9s); other pages moderate |
| Security / ops | Contact API design is careful; Resend + Upstash unset locally; no custom security headers; npm audit flags Next as critical |
| Field / real devices | Not measured — Chromium lab only |

**Bottom line:** Do not treat the site as production-ready until `/contact` SSR is fixed and live Resend delivery + rate limiting are verified in the deployment environment. Performance and contrast items are important but secondary to the contact outage.

---

## 2. Audit environment

| Item | Value |
|------|--------|
| Next.js | 15.5.14 |
| React / React DOM | 19.2.4 |
| Node | v22.14.0 |
| Test suite | `npm test` — **30 passed** (6 files) |
| Production build | `npm run build` after deleting corrupted `.next` — **success** |
| Server under test | `npx next start -p 3150` |
| Lighthouse | 12.2.1 (lab, headless Chromium) |
| Functional / network | Playwright Chromium |
| Local secrets | **None** — only `.env.example` present |

### Build route table (from build output)

| Route | Mode | First Load JS (build report) |
|-------|------|------------------------------|
| `/` | ○ Static | 127 kB |
| `/build` | ○ Static | 109 kB |
| `/transform` | ○ Static | 102 kB |
| `/research` | ○ Static | 106 kB |
| `/about` | ○ Static | 118 kB |
| `/contact` | ƒ Dynamic | 106 kB |
| `/api/contact` | ƒ Dynamic | 102 kB |
| Shared | — | 102 kB |

Build warnings (non-blocking): `@next/next/no-img-element` on Build/Transform hero `<img>` usages.

Relevant runtime dependencies: `cobe`, `motion`, `resend`, `@upstash/ratelimit`, `@upstash/redis`, `lucide-react`, Tailwind 4.

Artefacts: `scripts/production-audit/environment.json`, `build-output.txt`, `test-output.txt`.

---

## 3. Performance baseline by page

**Method:** Single-run Lighthouse lab on production server (mobile + desktop presets). Values are **lab**, not CrUX/field. **INP was not measured** (no field RUM; Lighthouse lab does not report INP here). Use **TBT** as the lab interaction-blocking proxy.

### Mobile (≈390×844)

| Page | Perf | LCP | FCP | CLS | TBT | Weight | JS xfer | Requests |
|------|------|-----|-----|-----|-----|--------|---------|----------|
| `/` | **41** | **5.4 s** | 3.8 s | 0 | **2,900 ms** | 720 KiB | 150 KB | 21 |
| `/build` | 74 | 4.8 s | 3.6 s | 0 | 70 ms | 813 KiB | 136 KB | 23 |
| `/transform` | 84 | 3.6 s | 2.4 s | 0 | 190 ms | 486 KiB | 132 KB | 19 |
| `/research` | 77 | 4.3 s | 3.3 s | 0.011 | 130 ms | 632 KiB | 132 KB | 19 |
| `/about` | 87 | 3.5 s | 2.3 s | 0.018 | 160 ms | 503 KiB | 136 KB | 20 |
| `/contact` | — | — | — | — | — | — | — | **HTTP 500** |

### Desktop (≈1440×900)

| Page | Perf | LCP | FCP | CLS | TBT | Weight | JS xfer | Requests |
|------|------|-----|-----|-----|-----|--------|---------|----------|
| `/` | 71 | 1.2 s | 0.8 s | 0 | 640 ms | 868 KiB | 154 KB | 28 |
| `/build` | 98 | 1.0 s | 0.8 s | 0.001 | 0 ms | 928 KiB | 140 KB | 28 |
| `/transform` | 99 | 0.8 s | 0.6 s | 0 | 0 ms | 601 KiB | 136 KB | 25 |
| `/research` | 99 | 0.9 s | 0.7 s | 0.002 | 30 ms | 647 KiB | 136 KB | 23 |
| `/about` | 100 | 0.8 s | 0.5 s | 0 | 40 ms | 607 KiB | 136 KB | 24 |
| `/contact` | — | — | — | — | — | — | — | **HTTP 500** |

Reports: `scripts/production-audit/lighthouse/*.report.html` + `summary.json`.

### Asset analysis (disk + runtime)

**Largest on-disk public images (selected):**

| Size | Path | Notes |
|------|------|--------|
| 1591 KB | `public/art/sculpture-1600.png` | Homepage hero `<img>` fallback; WebP sources preferred (~58–124 KB) |
| 632 KB | `public/brand/ashvi-mark-watermark.png` | PNG source; runtime uses WebP (≈53–191 KB) |
| 483 KB | `public/sculptures/emerging-enterprise-opt.png` | Appears unused by current imports |
| 456 / 433 KB | dual-intelligence PNGs | Runtime uses `.webp` (~33 KB) |
| 364 KB | `public/sculptures/emerging-enterprise-stage.png` | **Used** by homepage Future Vision via `next/image` |
| 274 KB | `public/companies/wyz-preview.png` | Prefer checking whether still referenced vs WebP charts |
| 192 KB | `public/build-hero-sculpture.webp` | Build hero family |
| 46 KB | `public/companies/wyz-revenue-margin.webp` | Featured / Build product UI |

**Runtime (Playwright network, approximate decoded sizes — see `network/summary.json`):**

- Homepage mobile: sculpture WebP ~58 KB; fonts + CSS dominate alongside JS (~464 KB script bodies in this capture method).
- Build HTML document alone ~797 KB (large inlined/static markup).
- Research document ~594 KB.
- About watermark WebP ~53 KB.
- Contact failed (500); error path requested Pages-router / development chunks that 404.

**JS / libraries of note:**

- Shared First Load ~102 KB (expected App Router baseline).
- `cobe` + `motion` on homepage globe path; `motion` also in `IntelligenceField`.
- Contact form is client-only React (no heavy third-party form SDK) — good once the page renders.
- Resend / Upstash are server-only for `/api/contact`.

---

## 4. Accessibility results

### Automated (Lighthouse)

| Page | Mobile a11y | Desktop a11y | Failures |
|------|-------------|--------------|----------|
| `/` | 100 | 100 | — |
| `/build` | **96** | **96** | `color-contrast` |
| `/transform` | 100 | 100 | — |
| `/research` | 100 | 100 | — |
| `/about` | 100 | 100 | — |
| `/contact` | n/a | n/a | Page 500 |

**Build contrast (evidence):** figcaption “Product interface · Illustrative demo data” — `#6c778d` on `#eef1f7`, ratio **3.98** vs required **4.5:1** (10.5px mono). Source: `BuildPage.tsx` `text-[#021336]/55`.

### Manual / Playwright

| Check | Result |
|-------|--------|
| Skip link `#main` | Present |
| Landmarks | `main` + primary `nav` on sampled pages |
| Single `h1` per page | Observed on five healthy pages |
| Heading hierarchy | Logical H1→H2→H3 on home/about/research samples |
| Mobile menu open | Visible; first focus → `/build` link |
| Mobile Escape | Closes menu; returns usability |
| Mobile focus trap | **Not implemented** — Tab can leave the panel (P2) |
| What We Do keyboard | Enter opens menu; Escape closes |
| `AnimatedReveal` + `prefers-reduced-motion: reduce` | **14** reveals on home; **0** with `opacity: 0`; CSS `!important` safety net present |
| Contact form labels / `aria-live` / validation | **Not fully exercised** — page SSR 500 |
| Text zoom 200% / narrow reflow | Not re-measured in this phase (covered in prior responsive work); no new layout code since 2D |

Artefacts: `functional/report.json`, `functional/reduced-motion-home.json`, screenshots under `functional/`.

---

## 5. WebGL and animation findings

### About — `InstitutionFlowShader`

| Requirement | Status |
|-------------|--------|
| Canvas sized to container | Yes — `ResizeObserver` + `getBoundingClientRect` |
| DPR capped | Yes — `MAX_DPR = 1.5`, longest side ≤ 1600 |
| Pause offscreen | Yes — `IntersectionObserver` stops rAF |
| Reduced motion | Yes — disabled; returns `null` |
| Mobile disable | Yes — `max-width: 767px` disables |
| Cleanup | Yes — cancel rAF, disconnect observers, delete buffer/program, `WEBGL_lose_context` |
| Fallback | Yes — component null; static SVG connectors remain in `AboutInstitution` |
| Failure path | If `getContext('webgl')` fails, effect returns early (no canvas paint); safe |

**Note:** WebGL init failure leaves `enabled` true with an empty/no-op canvas mount briefly until unmount — low practical risk; SVG fallback still present in the section.

### Homepage globe — `ConnectGlobeStage` / `Globe` (COBE)

| Check | Status |
|-------|--------|
| Lazy near-viewport | Yes |
| Pause rotation offscreen / reduced motion | Yes (`autoRotate={inView}`, static CSS fallback) |
| DPR cap | `maxDpr={1.5}` |
| Destroy on unmount | `globe.destroy()` + cancel rAF |
| WebGL probe fallback | Yes |

### Other continuous motion

- `MarkSculpture`: rAF + IO pause + reduced-motion skip + cancel on cleanup — OK.
- `BuildPartnership` draw animation: respects motion-reduce classes; one-shot style — OK.
- `din-playback` / `IntelligenceField`: motion-aware; worth watching for homepage TBT contribution (lab only).

**No code changes made.** No P0 WebGL leaks identified from review.

---

## 6. Functional test results

### HTTP health (production server)

| Path | Status |
|------|--------|
| `/`, `/build`, `/transform`, `/research`, `/about` | **200** |
| `/contact` | **500** |

Server error (repeated):  
`TypeError: Cannot read properties of undefined (reading 'call')` at `.next/server/webpack-runtime.js`  
Digest `2914709352`. Reproduced after deleting `.next`, rebuilding, and restarting. `/api/contact` continues to respond.

### Navigation journeys

| Journey | Result |
|---------|--------|
| What We Do → Build | Pass |
| What We Do → Transform | Pass |
| Our Work → `#our-work` | Pass |
| Research / About | Pass |
| Contact (client nav URL) | URL can change; **SSR document is 500** — treat as fail |
| Mobile menu open / Escape | Pass |
| Back/forward | Not separately timed; Next App Router links behave normally on healthy routes |

### Contact API (no real inbox delivery)

| Case | Result |
|------|--------|
| Validation (short name/message) | **400** with field errors |
| Valid payload, no Resend env | **503** — “Online submission is currently unavailable… hello@ashvi.tech” |
| Honeypot | Covered by unit tests (silent `ok: true`, no send) |
| Body size limit | Unit-tested (12 KB) |
| Rate limit without Upstash | Allows all (`mode: 'unavailable'`) — by design |

Unit coverage: `route.test.ts` (11), `schema.test.ts` (10).

### Links (homepage crawl)

Internal routes OK except `/contact` (500). External: `https://financewyz.ai/`. Mailto: `hello@ashvi.tech` only. No placeholder `href="#"` marketing CTAs found in the crawl set.

---

## 7. Security and configuration findings

| Topic | Finding |
|-------|---------|
| Env usage | `RESEND_*`, `CONTACT_*`, `UPSTASH_*` server-only; `NEXT_PUBLIC_DISABLE_DIN` is the only public flag spotted |
| Secret boundary | No API keys in client bundles from review of contact/email paths |
| Contact validation | Schema + length limits; HTML escaped in email bodies |
| Request size | 12 000 byte cap |
| Honeypot | `company_website` |
| Rate limiting | Requires Upstash; **unset locally** → unlimited |
| Provider failure | Generic client errors; logs `{ code }` only |
| Security headers | **None configured** in `next.config.ts` (no CSP, HSTS, frame-ancestors, etc.) |
| `X-Powered-By` | `Next.js` present |
| npm audit | **21** advisories (3 critical, 8 high, 10 moderate) — includes **`next` critical** range spanning 15.x; also vitest/esbuild toolchain issues |
| DNS / Vercel / prod env | Not modified; not inspected live |

**Live Resend delivery:** **Not verified** — outstanding production requirement.

---

## 8. Browser compatibility findings

| Target | Coverage |
|--------|----------|
| Chromium desktop (lab) | Yes — Lighthouse + Playwright |
| Mobile Chromium emulation | Yes |
| Firefox / WebKit desktop | **Not tested** |
| Real iOS / Android devices | **Not tested** |
| Reduced-motion Chromium | Yes — AnimatedReveal + globe path |

Limitation: results are Chromium-lab only. SVG-heavy pages and WebGL fallbacks should be spot-checked on Safari/Firefox before launch.

---

## 9. Severity-ranked issue list

### P0 — Release blockers

#### P0-1 — `/contact` returns HTTP 500 in production mode
- **Page/component:** `src/app/contact/page.tsx` / contact server bundle  
- **Evidence:** Curl/Playwright/Lighthouse all 500; server log webpack `undefined.call`; persists after clean rebuild  
- **Repro:** `npm run build && npx next start -p 3150` → open `http://localhost:3150/contact`  
- **Likely cause:** Dynamic App Router render / module graph failure for the contact page only (static pages OK; `require(page.js)` loads but request render fails)  
- **Recommended correction:** Isolate render stack (Next debug), simplify dynamic `searchParams` boundary if needed, ensure error UI uses App Router `error.tsx`; verify on CI Linux as well as Windows  
- **Regression risk:** Medium — touches only contact route if scoped carefully  

#### P0-2 — Contact conversion unavailable without working page + verified email
- **Page/component:** Contact UX + Resend  
- **Evidence:** Page 500; API returns 503 without `RESEND_API_KEY` / `CONTACT_FROM_EMAIL`  
- **Repro:** POST valid JSON to `/api/contact` with empty env  
- **Likely cause:** Missing production secrets (expected until configured) compounded by P0-1  
- **Recommended correction:** After P0-1, configure verified Resend domain/sender and send one controlled test  
- **Regression risk:** Low for config; medium for email templates  

### P1 — High priority

#### P1-1 — Homepage mobile lab performance
- **Evidence:** Perf 41, LCP 5.4s, TBT 2900 ms  
- **Likely cause:** Main-thread work (hero/animation/JS) + LCP media/fonts under mobile throttling  
- **Correction:** Profile long tasks; defer non-critical client islands; keep hero WebP path; consider font subsetting  
- **Regression risk:** Medium (visual motion)  

#### P1-2 — Shared rate limiting inactive without Upstash
- **Evidence:** `rate-limit.ts` returns `allowed: true, mode: 'unavailable'`  
- **Correction:** Set Upstash REST credentials in production before public launch  
- **Regression risk:** Low  

#### P1-3 — Next.js security advisories (npm audit critical)
- **Evidence:** `npm audit` flags `next@15.5.14` in a critical range; full list in `npm-audit.json`  
- **Correction:** Map each advisory to 15.5.14 applicability; plan a **post-audit** dependency upgrade (out of scope for 3A)  
- **Regression risk:** High if upgraded without regression suite  

#### P1-4 — Build page colour contrast failure
- **Evidence:** Lighthouse color-contrast on WYZ figcaption (3.98:1)  
- **Correction:** Darken caption token slightly (e.g. raise opacity above `/55`) without redesigning layout  
- **Regression risk:** Low  

### P2 — Medium

#### P2-1 — Mobile menu lacks focus trap / return focus completeness
- Escape + initial focus exist; Tab can escape panel; reopen focus restore is only via Escape path to button  
- **Correction:** Standard dialog focus trap when open  

#### P2-2 — No application security headers
- Missing CSP / frame / referrer / permissions policies at app or platform layer  

#### P2-3 — Oversized source assets still shipped / used
- `emerging-enterprise-stage.png` (364 KB) used on homepage; large PNG masters remain in `public/`  
- Prefer existing WebP variants where quality allows  

#### P2-4 — Large static HTML documents (Build ~797 KB, Research ~594 KB)
- Inflates TTFB/weight; investigate SVG/markup density  

#### P2-5 — Contact field errors not in `aria-live`
- Status messages use `aria-live="polite"`; field errors rely on focus move only (OK-ish once page works; improve for SR users)  

#### P2-6 — Homepage desktop TBT 640 ms
- Secondary to mobile but still elevated  

### P3 — Low

#### P3-1 — Unused / duplicate PNG masters in `public/`
#### P3-2 — Hero PNG 1.5 MB fallback (WebP preferred via `<picture>`)
#### P3-3 — `X-Powered-By: Next.js`
#### P3-4 — ESLint `no-img-element` warnings on intentional hero `<img>`s
#### P3-5 — Toolchain advisories (vitest/esbuild) — not in production browser path

---

## 10. Recommended optimisation order

1. **Fix `/contact` SSR 500** and add a smoke check in CI against `next start`.  
2. **Configure and verify Resend** (controlled real send) + **Upstash rate limit**.  
3. **Address Next advisory applicability** and schedule a safe framework patch window.  
4. **Homepage mobile performance** (TBT/LCP) — measure again after contact work so baselines stay honest.  
5. **Build figcaption contrast**.  
6. **Security headers** (platform or `headers` in Next config).  
7. **Mobile menu focus trap**.  
8. **Asset hygiene** — WebP for Future Vision sculpture; prune unused PNG masters.  
9. **Optional:** markup weight on Build/Research; font strategy.

Do not compress or redesign assets until contact is green and baselines are re-run.

---

## 11. Outstanding manual production checks

- [ ] Fix and re-verify `/contact` on the same OS as production (and Windows if used for local prod).  
- [ ] Deploy env: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.  
- [ ] Send **one** real contact message in staging/production and confirm inbox + Reply-To.  
- [ ] Confirm Resend domain/DNS verification for ashvi.tech.  
- [ ] Set Upstash Redis and confirm 429 after >5 posts / 15 min / IP.  
- [ ] Confirm Vercel (or host) security headers / HTTPS redirects.  
- [ ] CrUX or RUM for **INP**, LCP, CLS (lab ≠ field).  
- [ ] Safari (macOS + iOS) and Firefox smoke: header, menu, SVG, WebGL fallback, form.  
- [ ] Physical phone check of homepage LCP feel and sticky header.  
- [ ] External link `financewyz.ai` still correct.  
- [ ] Re-run Lighthouse after P0 fixes; store a new dated folder under `scripts/production-audit/`.

---

## Evidence index

| Path | Contents |
|------|----------|
| `scripts/production-audit/environment.json` | Versions, routes, audit meta |
| `scripts/production-audit/build-output.txt` | Production build log |
| `scripts/production-audit/test-output.txt` | Vitest summary |
| `scripts/production-audit/lighthouse/` | HTML/JSON reports + `summary.json` |
| `scripts/production-audit/functional/` | Nav/a11y capture + screenshots |
| `scripts/production-audit/network/summary.json` | Transfer approximations |
| `scripts/production-audit/npm-audit.json` | Full advisory dump |
| `scripts/production-audit/run-lighthouse.mjs` | Repeatable LH runner |
| `scripts/production-audit/functional-a11y-capture.mjs` | Functional harness |
| `scripts/production-audit/perf-network-capture.mjs` | Network harness |
| `scripts/production-audit/reduced-motion-check.mjs` | Reduced-motion check |

**Convention note:** These artefacts are not listed in `.gitignore`. They were generated for this audit and were **not committed** in this phase.

---

*Phase 3A complete: measure first. Optimise in a subsequent phase after P0 contact recovery.*
