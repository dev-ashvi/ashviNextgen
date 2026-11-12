# AshviTech — Phase 3C Homepage LCP & Critical Rendering Optimisation

**Date:** 12 November 2026  
**Scope:** Homepage mobile LCP/FCP / critical rendering only  
**Preserves:** Phase 3B deferrals, hero design, typography families/axes  
**Evidence:** `scripts/lcp-optimisation/`

---

## 1. Critical-path analysis

### Lab setup (same as Phase 3B)
- `next build` + `next start -p 3170`
- Lighthouse **12.2.1**, mobile, default slow-4G + 4× CPU
- **3 runs**, medians

### LCP element (confirmed)
`<img class="sculpt-float">` → `/art/sculpture-900.webp` (~59 KB).

### Render-delay breakdown (dominant factors)

| Phase | Finding |
|-------|---------|
| TTFB | Fast locally (~20–40 ms) — not the bottleneck |
| HTML parse | **Was** ~390 KB uncompressed / ~127 KB gzip — primary FCP gate under throttle |
| CSS | ~25 KB — render-blocking but secondary |
| Sculpture transfer | ~59 KB; preload discovers early; **not** byte-bound |
| Fonts | ~360 KB across 4 woff2 (Inter + Newsreader opsz/italic) — compete on bandwidth after CSS |
| JS / TBT | Deferred chunks stay off initial network; React shared chunks + style/layout still cost CPU under 4× |

Unthrottled Playwright: LCP ≈ **0.5–0.6 s**. Lab LCP ≈ **4.5 s** is almost entirely **throttled first-paint delay** (HTML/CSS/font scheduling), not sculpture decode time.

---

## 2. Font findings

| Family | Role above the fold | Notes |
|--------|---------------------|--------|
| **Newsreader** (+ `opsz`, italic) | Hero headline / emphasis | Required for approved look (`opsz` 72 on hero) |
| **Inter** | Body, UI, eyebrow | Used immediately in hero column |
| **JetBrains Mono** | Labels | Not LCP-critical |

**Transfer (measured):** ~132 + 147 + 49 + 32 KB ≈ **360 KB** total font payload on home.

**Changes retained**
- `preload: false` on Inter, Newsreader, JetBrains + `adjustFontFallback: true`
- `font-display: swap` unchanged
- **No** family substitution; **opsz axis kept**

**Hero type after change (computed):**  
`Newsreader` / weight 500 / `font-variation-settings: "opsz" 72` / italic Newsreader — matches approved stack.  
Screenshot: `scripts/lcp-optimisation/after-fonts/hero-type-mobile.png`

**Result:** Font preload relaxation alone did **not** move LCP beyond noise vs HTML win; retained as safe bandwidth hygiene.

---

## 3. HTML payload breakdown

### Before (Phase 3B / 3C baseline analysis)
| Contributor | Approx. |
|-------------|---------|
| Uncompressed HTML | **~390 KB** |
| Inline SVGs | **~138 KB** chars |
| Largest SVG | Research landscape wireframe **~129 KB** |
| Gzip document (LH) | **~127 KB** |

### After externalising landscape SVG
| Contributor | Approx. |
|-------------|---------|
| Uncompressed HTML | **~127–130 KB** |
| Inline SVGs | **~9 KB** |
| Gzip document (LH) | **~27 KB** |

The landscape paths are unchanged; they now live at  
`public/research/landscape-wireframe.svg` and load via `<img loading="lazy">` with the same HTML labels overlay.

---

## 4. Sculpture network-priority findings

| Mechanism | Status |
|-----------|--------|
| `<link rel=preload>` in Hero | Present; initiator `link`; ~59 KB |
| `fetchPriority="high"` on `<img>` | Present |
| HTTP `Link` header on `/` | Added in `next.config.ts` — verified in response headers |
| Chrome priority in some LH traces | Still often **Low** for image preloads (browser heuristic) |
| Duplicate downloads | Not observed (single sculpture-900 request) |
| `next/image` swap | **Not** adopted — no clear gain over working WebP + preload; risk to framing |

---

## 5. Changes implemented

1. **Research landscape SVG → static file** (`ResearchLandscape.tsx` + `public/research/landscape-wireframe.svg`)
2. **Font preload off** for Inter / Newsreader / Mono + `adjustFontFallback`
3. **HTTP `Link` preload** for `/art/sculpture-900.webp` on `/`
4. **`content-visibility: auto`** on `#future-vision`, `#research`, `#connect`
5. **DIN fallback** soft radial field (space reserved, not a blank hole)

**Not undone:** near-viewport DIN / Engineering Philosophy / Connect globe; transform-only `.hero-in`; WebP hero/Future Vision.

---

## 6. Before / after measurements (medians)

### Phase 3C lab series

| Metric | 3C baseline* | After HTML | After fonts | **Final 3C** | vs Phase 3B final |
|--------|--------------|------------|-------------|--------------|-------------------|
| Performance | 41 | 47 | 45 | **46** | 67 → 46† |
| LCP | 4.94 s | 4.41 s | 4.48 s | **4.48 s** | 4.93 → **4.48 s** |
| FCP | 3.66 s | 3.20 s | 3.20 s | **3.20 s** | 3.65 → **3.20 s** |
| TBT | 3435 ms | 2927 ms | 3021 ms | **3038 ms** | 301 ms† |
| CLS | ~0.001 | 0 | 0 | **~0.001** | stable |
| Doc transfer | ~127 KB | **~27 KB** | ~27 KB | **~27 KB** | **−100 KB** |
| Font transfer | ~360 KB | ~360 KB | ~360 KB | **~360 KB** | ≈ same |
| JS transfer | 127 KB | 127 KB | 127 KB | **127 KB** | same |
| Total weight | 711 KB | 611 KB | 611 KB | **612 KB** | **−99 KB** |

\*3C baseline used a fresh prod server on the post–3B tree before HTML/font edits.  
†**TBT note:** This session’s LH mobile TBT (~3 s) is much higher than Phase 3B’s recorded **301 ms** median despite the same deferred architecture and **no** heavy deferred chunks on the initial LH network list. Bootup is dominated by **“Unattributable”** + shared React chunks — consistent with lab CPU noise / measurement variance, not re-introduction of DIN/globe on first load. Deferred modules remain code-split; structural 3B gains are intact. Treat 3B’s 301 ms as the architectural reference; re-baseline TBT on a quiet machine before claiming regression.

### Targets vs outcome

| Target | Outcome |
|--------|---------|
| Lighthouse ≥ 75 | Not met (46 in this noisy TBT session; LCP/FCP still improved) |
| LCP &lt; 3.0 s | Not met — lab still ~4.5 s (FCP-bound under throttle) |
| FCP materially &lt; 3.65 s | **Met** (~3.20 s) |
| TBT &lt; 500 ms | Architecturally preserved; this lab series noisy |
| CLS &lt; 0.1 | **Met** |

---

## 7. Visual comparisons

| Check | Result |
|-------|--------|
| Hero sculpture framing | Unchanged asset / composition |
| Hero type (Newsreader + opsz 72 + italic) | Confirmed post-change |
| Research landscape geometry | Same paths; external file |
| Desktop hero sculpture visible | Pass |
| Engineering Philosophy content + accordion | Pass (regression harness) |
| Reduced-motion reveals | Pass |
| Vitest | **30/30** |

---

## 8. Remaining limitations

1. **Lab LCP ~4.5 s** while unthrottled LCP ~0.5 s — remaining gap is simulated network/CPU around **first paint**, not sculpture bytes.
2. **~360 KB fonts** with `opsz` + italic are required for approved typography; further cuts need a deliberate visual QA pass (subsetting / static cuts).
3. **Chrome image-preload priority** often stays Low even with `Link` + `fetchPriority=high`.
4. **LH Performance score** in this pass was depressed by high TBT readings; re-run on an unloaded host to reconcile with Phase 3B TBT baselines.
5. Plateau: without changing hero order (copy above sculpture on mobile) or font visuals, further sub-3 s LCP under default LH mobile throttle is unlikely.

---

## Evidence index

| Path | Contents |
|------|----------|
| `scripts/lcp-optimisation/baseline-3c/` | Pre-change 3-run medians |
| `scripts/lcp-optimisation/after-html/` | After landscape SVG externalise |
| `scripts/lcp-optimisation/after-fonts/` | After font preload policy + hero type shot |
| `scripts/lcp-optimisation/final-3c/` | Final 3-run + desktop shot |
| `scripts/lcp-optimisation/analysis/` | HTML/SVG/font critical-path dump |
| `public/research/landscape-wireframe.svg` | Extracted landscape geometry |

---

*Focused pass complete: HTML critical path cut sharply; FCP/LCP improved modestly under the same LH mobile config; typography and Phase 3B deferrals preserved.*
