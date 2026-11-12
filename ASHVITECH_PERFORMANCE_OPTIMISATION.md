# AshviTech — Phase 3B Homepage Mobile Performance Optimisation

**Date:** 12 November 2026  
**Scope:** Homepage (`/`) mobile loading & interaction — no redesign  
**Evidence:** `scripts/performance-optimisation/`

---

## 1. Reproduced baseline

| Item | Value |
|------|--------|
| Server | `next build` + `next start -p 3160` |
| Tool | Lighthouse **12.2.1**, mobile form factor |
| Viewport | 390×844, DPR 2 |
| Throttling | Lighthouse default mobile (sim. slow 4G + 4× CPU) |
| Runs | **3** per label; medians reported |
| Node / Next / React | v22.14.0 / 15.5.14 / 19.2.4 |

### Baseline median (`scripts/performance-optimisation/baseline/`)

| Metric | Median |
|--------|--------|
| Performance | **43** |
| LCP | **5.22 s** |
| FCP | **3.64 s** |
| TBT | **3,092 ms** |
| CLS | **0** |
| Total weight | **737 KB** |
| JS transferred | **150 KB** |
| Requests | **21** |

Aligned with the Phase 3A audit (Perf 41 / LCP 5.4 s / TBT 2.9 s; single-run variance).

---

## 2. Identified LCP element

**Element (Playwright PerformanceObserver, unthrottled):**  
`<img class="sculpt-float …">` → `/art/sculpture-900.webp`  
(~61k CSS px area). Not the headline.

**Critical path findings:**

1. **Hero entrance used `opacity: 0` → 1** (`.hero-in` with `animation-fill-mode: both`), including the sculpture wrapper — delays paint of the LCP image under CPU throttle.
2. Img **fallback previously pointed at a 1.5 MB PNG**; WebP sources existed but PNG was the `src`.
3. Responsive `<link rel=preload imageSrcSet>` was observed at **priority: Low** while fonts stayed **VeryHigh**.
4. Under LH throttle, **FCP ~3.7 s** still gates LCP; large HTML (~127 KB transfer) + CSS + multi-font payload dominate time-to-paint. Image bytes (~59 KB) are modest once discovered.

Lighthouse’s own LCP-element gatherer errored in some runs (`frame_sequence`); element identity relies on the PerformanceObserver probe + network audits.

---

## 3. Main-thread blocking analysis (baseline)

Top contributors (bootup / main-thread from baseline LH):

| # | Contributor | Evidence |
|---|-------------|----------|
| 1 | **Shared React/Next chunk** (`255-*.js`) | ~4.2 s scripting in Phase 3A bootup; large under 4× CPU |
| 2 | **Eager homepage client modules** | DIN SVG hydration, Engineering Philosophy (full `"use client"`), COBE/`motion` via Connect globe dynamic starting at hydration |
| 3 | **Style/layout on large DOM/HTML** | Main-thread “Style & Layout” + ~1k+ DOM; document parse of heavy homepage HTML |

`din-playback` was already dynamically imported; the **SVG client tree and below-fold interactive sections** still evaluated on first load.

---

## 4. Changes implemented

### A — LCP critical path (kept)
- `.hero-in` keyframes: **transform-only** (removed opacity) — same duration/easing.
- Sculpture: WebP `src`, `decoding="sync"`, `fetchPriority="high"`, tighter `sizes`.
- Early `<link rel="preload" as="image" href="/art/sculpture-900.webp">` in `Hero`.
- Header logo `priority={false}` to avoid competing image preload.
- Newsreader + JetBrains Mono: `preload: false` (still load via CSS/`font-display: swap`).

### B — TBT / JS deferral (kept — largest measured win)
- `HomeNearViewport` — IntersectionObserver-gated dynamic `import()`.
- **Dual Intelligence Network** deferred; aspect-ratio + accessible fallback until near view.
- **Engineering Philosophy** deferred; **server fallback** keeps heading, copy, and all six principles visible (no blank section).
- **Connect globe** (COBE + `motion`) only downloads near the Connect panel.
- Future Vision image → existing **`.webp`** + lazy.

### C — Shared utilities
- `engineering-philosophy-data.ts` shared by interactive + fallback.
- No Next/React version changes; other routes’ designs untouched aside from logo priority / font preload flags (global, low visual risk).

---

## 5. Before / after (measured medians)

| Metric | Baseline | After LCP-only | **Final (final2)** | Target |
|--------|----------|----------------|--------------------|--------|
| Performance | 43 | 44 | **67** | 75+ |
| LCP | 5.22 s | 5.06 s | **4.93 s** | &lt; 3.0 s |
| FCP | 3.64 s | 3.64 s | **3.65 s** | — |
| TBT | 3,092 ms | 2,922 ms | **301 ms** | &lt; 500 ms |
| CLS | 0 | 0 | **~0.001** | &lt; 0.1 |
| Weight | 737 KB | 737 KB | **711 KB** | — |
| JS xfer | 150 KB | 150 KB | **127 KB** | — |
| Requests | 21 | 21 | **19** | — |

**Desktop spot-check (final2):** Performance **98**, LCP **1.0 s**, TBT **0 ms** — no regression vs Phase 3A desktop strength.

Unthrottled Playwright LCP for the sculpture: ~684 ms → ~426 ms (directional only; not LH).

---

## 6. JavaScript and asset savings (measured)

| Item | Before | After |
|------|--------|-------|
| Homepage route size (build) | 8.04 kB | **3.02 kB** |
| Homepage First Load JS | 127 kB | **122 kB** |
| LH JS transfer (mobile) | 150 KB | **127 KB** |
| LH total weight | 737 KB | **711 KB** |
| Future Vision on-disk | 364 KB PNG | **~22 KB WebP** (when requested) |

Deferred chunks (DIN, Engineering Philosophy, globe/motion/cobe) no longer sit on the initial critical path.

---

## 7. Visual regression results

| Check | Result |
|-------|--------|
| Hero composition / sculpture / CTAs | Intact (screenshots under `regression/`) |
| Desktop hero | Pass |
| Engineering Philosophy content without waiting forever | Fallback shows full principles; interactive enhances near viewport |
| Globe | Still renders when Connect nears viewport; navy panel always present |
| Hero motion | Entrance retained via transform; float animations unchanged |

---

## 8. Accessibility / functional regression

| Check | Result |
|-------|--------|
| Vitest | **30/30** pass |
| Hero CTAs | Pass |
| Engineering Philosophy accordion (after hydrate) | Pass |
| `AnimatedReveal` + reduced motion | Pass (0 hidden reveals) |
| Keyboard / nav appearance | Unchanged by design |

Responsive fixes from 2A–2D preserved (no layout token / menu / scroll-anchor edits beyond logo priority).

---

## 9. Remaining bottlenecks

1. **Mobile LCP still ~4.9 s under LH throttle** — FCP ~3.7 s; large **font files** (~360 KB combined Inter/Newsreader) at high priority; HTML ~127 KB; Chrome still marks sculpture preload as **Low** in some traces.
2. **Performance score 67 vs 75+ aspiration** — mostly residual LCP/FCP, not TBT.
3. **DIN placeholder** is an empty aspect box until near viewport (accessible label present; diagram not visible until JS mount).
4. Newsreader **opsz** axis still ships large variable fonts (typography preserved; next lever if LCP work continues).

---

## 10. Recommended next steps

1. Font strategy: subset / drop unused opsz if visual QA allows; or self-host a leaner Newsreader cut for hero only.
2. Investigate High-priority LCP fetch via `next/image` + `priority` for the sculpture (verify no quality regression).
3. Further HTML weight reduction on homepage SSR (editorial density vs bytes).
4. Re-measure on real mid-tier Android + field RUM (INP/LCP) — lab ≠ field.
5. Separate track: Contact SSR / npm advisories (out of 3B scope).

---

## Evidence index

| Path | Contents |
|------|----------|
| `scripts/performance-optimisation/baseline/` | Pre-change 3-run median |
| `scripts/performance-optimisation/after-lcp/` | After hero/LCP CSS+image |
| `scripts/performance-optimisation/after-defer/` | After near-viewport deferrals |
| `scripts/performance-optimisation/final2/` | Final 3-run mobile + desktop LH |
| `scripts/performance-optimisation/regression/` | Functional/a11y checks + screenshots |
| `scripts/performance-optimisation/measure-home.mjs` | Repeatable harness |

---

*Profile → optimise → measure → retain verified improvements. TBT target met; LCP remains the primary open performance item.*
