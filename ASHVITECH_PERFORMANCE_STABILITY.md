# AshviTech — Phase 3D Performance Regression Verification

**Date:** 12 November 2026  
**Scope:** Verify whether Phase 3C caused a real mobile TBT regression vs Phase 3B  
**Primary tree:** unchanged for the 3B bench (side copy at `C:\Users\apoor\ashvi-3b-bench`)  
**Evidence:** `scripts/stability/`

---

## Verdict

**Phase 3C did not cause a reproducible, Phase-3C-specific TBT regression.**

Under identical controlled conditions, **high TBT (~2.4–5.3 s)** appears on **both** Phase 3B-equivalent and Phase 3C builds. Ranges overlap; medians differ by ~0.5 s inside ~1.1 s stdev. Phase 3B’s published **301 ms** median is **not reproducible** on this host in this session. Phase 3C’s **HTML / LCP / FCP** gains remain real and stable. **No code correction** was applied.

---

## 1. Controlled lab setup

| Item | Value |
|------|--------|
| Node | v22.14.0 |
| Lighthouse | 12.2.1 |
| Form factor / viewport | Mobile / 390×844 (LH default) |
| Throttling | LH default mobile (sim. slow 4G + 4× CPU) |
| Build | `next build` + `next start` |
| Phase 3C server | `http://localhost:3180` |
| Phase 3B-equivalent server | `http://localhost:3181` (isolated tree; primary worktree untouched) |
| Runs | **5 sequential** per build; no concurrent LH / builds |
| Harness | `scripts/stability/measure-home.mjs` |

**Note on Phase 3B source:** Phase 3B was never a separate git commit on this branch (3B+3C lived as sequential uncommitted work). The 3B bench is a **file-level revert of Phase 3C deltas** (landscape externalisation, font `preload: false` expansion, HTTP Link sculpture preload, `content-visibility`, etc.) while **keeping Phase 3B deferrals**. JS transfer stayed **127 KB** on both — deferral architecture intact on both sides.

---

## 2. Phase 3C — five runs (current)

Source: `scripts/stability/phase-3c-current/summary.json`

| Run | Perf | LCP | FCP | TBT | CLS | HTML xfer | JS xfer |
|-----|------|-----|-----|-----|-----|-----------|---------|
| 1 | 43 | 4.48 s | 3.20 s | **5338 ms** | 0 | 27 KB | 127 KB |
| 2 | 45 | 4.47 s | 3.20 s | **3251 ms** | 0 | 27 KB | 127 KB |
| 3 | 46 | 4.39 s | 3.19 s | **3138 ms** | 0.001 | 27 KB | 127 KB |
| 4 | 47 | 4.47 s | 3.20 s | **2460 ms** | 0.001 | 27 KB | 127 KB |
| 5 | 46 | 4.46 s | 3.19 s | **3163 ms** | 0 | 27 KB | 127 KB |
| **Median** | **46** | **4.47 s** | **3.20 s** | **3163 ms** | **0** | **27 KB** | **127 KB** |

**Variability:** TBT min 2460 / max 5338 / mean 3470 / **stdev ≈ 1091 ms**. LCP stdev ≈ **36 ms** (stable).

---

## 3. Phase 3B-equivalent — five runs (same environment)

Source: `scripts/stability/phase-3b-bench/summary.json`

| Run | Perf | LCP | FCP | TBT | CLS | HTML xfer | JS xfer |
|-----|------|-----|-----|-----|-----|-----------|---------|
| 1 | 40 | 4.92 s | 3.65 s | **5131 ms** | 0 | 125 KB | 127 KB |
| 2 | 42 | 4.94 s | 3.66 s | **3187 ms** | 0.001 | 125 KB | 127 KB |
| 3 | 44 | 4.89 s | 3.65 s | **2373 ms** | 0.001 | 125 KB | 127 KB |
| 4 | 43 | 4.91 s | 3.64 s | **2444 ms** | 0 | 125 KB | 127 KB |
| 5 | 43 | 4.92 s | 3.64 s | **2707 ms** | 0.001 | 125 KB | 127 KB |
| **Median** | **43** | **4.92 s** | **3.65 s** | **2707 ms** | **0.001** | **125 KB** | **127 KB** |

**Variability:** TBT min 2373 / max 5131 / mean 3169 / **stdev ≈ 1143 ms**. LCP stdev ≈ **20 ms**.

---

## 4. Comparison — did 3C uniquely regress TBT?

| Metric | 3B report (final2, 3 runs) | 3B bench (this session, 5) | 3C report (3C doc) | 3C current (this session, 5) |
|--------|----------------------------|----------------------------|--------------------|------------------------------|
| Perf | **67** | 43 | 46 | **46** |
| LCP | 4.93 s | 4.92 s | 4.48 s | **4.47 s** |
| FCP | ~3.7 s | 3.65 s | 3.20 s | **3.20 s** |
| TBT | **301 ms** | **2707 ms** | 3038 ms | **3163 ms** |
| HTML | ~127 KB | 125 KB | 27 KB | **27 KB** |
| JS | 127 KB | 127 KB | 127 KB | **127 KB** |

### Interpretation (evidence-based)

1. **High TBT is reproducible on both builds** under today’s quiet sequential protocol — not unique to 3C.
2. **Median TBT delta (3C − 3B) ≈ +456 ms** with **overlapping ranges** and **stdev > 1 s** on both → not attributable to 3C alone.
3. **Phase 3B’s 301 ms** (recorded in `scripts/performance-optimisation/final2/`) was a **real historical reading** but **not reproducible** here: same LH version, same throttle, same deferral JS weight (~127 KB), yet main-thread “Other” + shared React chunks dominate again (~4–6.5 s unattributable bootup on noisy runs).
4. **LCP / FCP / HTML** improvements from 3C **are reproducible** and low-variance (LCP stdev ~36 ms).
5. Bootup / main-thread profiles are **structurally similar** on both builds:
   - Dominant: **Unattributable** + document + shared framework chunks (`255-*` / `544-*`)
   - Style & Layout ~1.2–1.6 s
   - Script Evaluation ~0.8–1.5 s  
   No evidence that landscape externalisation, font preload flags, HTTP Link sculpture preload, `content-visibility`, or deferred mounting uniquely introduced a new long task class.

**Causality conclusion:** Do **not** treat the 3C Perf 46 / TBT ~3 s vs 3B Perf 67 / TBT 301 ms narrative as a code regression. Treat **301 ms as an unreproducible lucky/low-noise sample**; treat **~2.5–3.5 s median TBT** as the trustworthy lab band on this machine for both architectures.

---

## 5. Investigation of Phase 3C-only levers (no speculative fixes)

Checked against the question “did this change cause TBT?”:

| Change | Finding |
|--------|---------|
| Research landscape externalisation | HTML 125→27 KB; landscape loads as lazy `<img>` — **helps FCP/LCP**, not a TBT regressor vs 3B bench |
| Font `preload: false` | Present on both sides of this compare for Inter/Newsreader/Mono; no unique 3C TBT signature |
| HTTP Link sculpture preload | LCP stable ~4.47 s; no TBT-specific task |
| `content-visibility` on `#future-vision` / `#research` / `#connect` | Visual checks pass; text accessible; no CLS spike |
| Deferred mounting (3B) | Still effective — initial JS **127 KB** both builds; DIN/globe/EngPhil not on first-paint critical path |
| Shared React/Next | Same class of cost on both; primary scripting attribution |

**Correction applied:** none. Retaining Phase 3C HTML/LCP/FCP improvements.

---

## 6. Visual / deferral behaviour (Phase 3C on :3180)

Source: `scripts/stability/visual/report.json` — **all checks passed**

| Check | Result |
|-------|--------|
| Hero / sculpture visible | Pass |
| DIN mounts on scroll | Pass |
| Engineering Philosophy accordion | Pass |
| Research landscape in view | Pass (external SVG renders) |
| Connect globe area | Pass (heading/area present; near-viewport activation) |
| Reduced motion — text accessible | Pass (0 hidden reveals) |
| `content-visibility` text accessible | Pass (research + connect copy readable) |

Vitest: **30/30** pass (re-run after measurements).

---

## 7. Whether Phase 3B deferral improvements remain effective

**Yes.**

- Initial JS transfer remains **127 KB** (was 150 KB pre-3B).
- Deferred modules (DIN, Engineering Philosophy interactive, Connect globe) still mount near viewport.
- Engineering Philosophy server fallback + accordion still work.
- The historical **301 ms TBT** is not a reliable claim of permanent lab TBT; the **architectural** win (smaller initial JS, deferred heavy clients) remains intact and verified by network + visual checks.

---

## 8. Final trustworthy performance baseline

Use **Phase 3C five-run medians** as the current lab baseline (this machine, LH 12.2.1 mobile):

| Metric | Baseline (median of 5) | Notes |
|--------|------------------------|-------|
| Performance | **46** | Depressed by lab TBT band; not a 3C-only cliff |
| LCP | **4.47 s** | Stable; improved vs 3B ~4.92 s |
| FCP | **3.20 s** | Stable; improved vs 3B ~3.65 s |
| TBT | **3163 ms** (band ~2.5–5.3 s) | High variance; same band as 3B bench |
| CLS | **0** | Stable |
| HTML transfer | **27 KB** | vs 3B ~125 KB |
| JS transfer | **127 KB** | Deferrals held |
| Total weight | **~597 KB** | vs 3B bench ~696 KB |

**Do not** compare a single future TBT reading to Phase 3B’s 301 ms without a fresh multi-run series on the same host.

---

## 9. Restrictions observed

- No redesign, font/artwork changes, dependency bumps, or deploy.
- No speculative TBT “fixes.”
- Contact SSR local issue not investigated.
- Primary working tree not altered for the 3B benchmark.

---

## Evidence index

| Path | Contents |
|------|----------|
| `scripts/stability/measure-home.mjs` | 5-run LH harness |
| `scripts/stability/prepare-3b-worktree.mjs` | Builds 3B-equivalent side tree |
| `scripts/stability/visual-verify.mjs` | Deferral / a11y / content-visibility checks |
| `scripts/stability/phase-3c-current/` | 5-run LH + summary (current 3C) |
| `scripts/stability/phase-3b-bench/` | 5-run LH + summary (3B-equivalent) |
| `scripts/stability/visual/report.json` | Visual verification results |
| `scripts/performance-optimisation/final2/` | Historical 3B series that recorded ~301 ms TBT |

---

*Stop condition met: performance stability verified; no code correction required; Phase 3C LCP/HTML gains retained.*
