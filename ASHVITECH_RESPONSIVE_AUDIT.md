# AshviTech — Responsive Design Audit

**Date:** 2026-05-12  
**Scope:** Observation only — no application code, CSS, assets, or copy were changed.  
**Base URL audited:** `http://localhost:3130` (local production build)  
**Desktop reference:** 1440 × 900  

## 1. Executive summary

Mobile and tablet layouts are mostly structurally sound: document `overflow-x` is **false** on all six routes at every tested width, primary content stacks in a single column, and Contact / Research memorial / Build journey (mobile) already read well.

Two **Critical** defects dominate the audit:

1. **Mobile navigation panel collapses to 0 height** whenever the header applies `backdrop-blur` (scrolled or menu-open states). The hamburger toggles to an “X”, body scroll locks, and menu links exist in the DOM — but the panel is invisible and untappable.
2. **`AnimatedReveal` can leave section copy at `opacity: 0`** when `prefers-reduced-motion: reduce` is set. Confirmed on `/about` (and sample checks on `/`). This is an accessibility / first-paint failure, not merely an audit-tool artefact.

High-priority follow-ons: sticky header covering mid-page section intros when sections are scrolled into view; home decorative SVGs wider than the viewport (clipped, not scrollable); Transform / Build hero sculptures undersized or heavily cropped on small phones; Build journey remaining a cramped five-column layout at 768px.

**Safe fix posture:** Prefer mobile/tablet-only CSS and isolated header/menu/`AnimatedReveal` changes. Do **not** restyle the Transform desktop hero composition in the fix pass.

---

## 2. Method

| Viewport | Role |
|---|---|
| 375 × 812 | Small mobile (required full-page) |
| 390 × 844 | Standard mobile |
| 430 × 932 | Large mobile |
| 768 × 1024 | Tablet portrait (required full-page) |
| 1024 × 768 | Tablet landscape (`lg` desktop nav begins) |
| 1440 × 900 | Desktop reference (required full-page) |

**Artefacts**

- Full-page shots: `scripts/responsive-audit/pages/{page}-{viewport}.png`
- Section crops: `scripts/responsive-audit/sections/`
- Nav states: `scripts/responsive-audit/nav/`
- Metrics / probes: `scripts/responsive-audit/metrics.json`, `inspect.json`, `inspect-more.json`, `final-checks.json`
- Capture helpers: `scripts/responsive-audit/capture.mjs` (+ follow-on inspect scripts)

**Note on reduced motion:** Initial captures used Playwright `reducedMotion: "reduce"`. That correctly surfaces the reveal bug, but made some About/full-page shots look empty. Visible About crops were re-taken with motion allowed after scrolling to trigger IntersectionObserver (`about-hero-375-visible.png`, etc.).

---

## 3. Severity-ranked issue list

| ID | Severity | Page(s) | Section | Viewport(s) | What is wrong | Likely root cause | Suggested fix | Screenshot |
|---|---|---|---|---|---|---|---|---|
| C1 | **Critical** | All `< lg` | Site header / mobile menu | 375–768 | Menu open state shows “X” but panel height is **0**; links not visible or tappable. `getBoundingClientRect()` → `top: 84, bottom: 84, height: 0`. Body `overflow: hidden` still applies. | `#mobile-menu` is `position: fixed; top: 84px; bottom: 0` **inside** `<header>` that uses `backdrop-blur-xl`. `backdrop-filter` makes the header the containing block; fixed children resolve against the ~85px header, so `top:84` + `bottom:0` collapses. | Portal the menu to `document.body`, **or** move it outside the blurred header, **or** drop `backdrop-filter` from the header while the menu is open / use an opaque header bg instead. Verify open state covers viewport below 84px, traps focus, and restores scroll. | `nav/mobile-menu-375.png`, `nav/mobile-menu-375-recheck.png`, `nav/mobile-menu-375-full.png` |
| C2 | **Critical** | `/about` (site-wide pattern) | `AnimatedReveal` sections | All (a11y) | With `prefers-reduced-motion: reduce`, hero and subsequent About blocks stay at **`opacity: 0`** indefinitely (`wrapHasOpacity0: true` after 3s; `matchMedia` reports `true`). | `AnimatedReveal` animated branch defaults to `opacity-0` until IntersectionObserver sets `visible`. Reduced-motion early path is not winning in the live bundle/hydration path observed; IO early-return when `reduce` is true can also strand content if the hook flips late. | Fix pass: if reduced motion → always render visible (no opacity-0). Also default `visible` true for above-fold or use CSS `@media (prefers-reduced-motion: reduce) { opacity: 1 !important; transform: none; }` as belt-and-braces. Add a Vitest/Playwright a11y check. | `final-checks.json` → `aboutReduce`; contrast `sections/about-hero-375-visible.png` |
| H1 | **High** | `/`, `/build`, `/transform`, others | Mid-page section intros under sticky header | 375–768 | When a section is scrolled to the top via `scrollIntoView`, the fixed 84px header overlays titles/labels (Build partnership, Transform approach step 01, partnership principles, WYZ “Current collaboration” / “An active collaboration”). Hash navigation with `scroll-mt-*` was OK in spot checks (`#our-work`, `#how-we-build-together`). | Fixed header + insufficient section padding / `scroll-mt` inconsistency; some sections use `scroll-mt-24` (96px) while header is 84px — OK for anchors, but in-page scroll / sticky visual still covers content at rest under the bar. Semi-transparent `bg-paper/80` worsens legibility of white text on dark sections. | Standardise `scroll-mt` to ≥ header height + breathing room; add top padding inside dark sections; consider fully opaque header when scrolled; ensure in-section sticky subheads account for 84px. Scope to shared header + section utilities — avoid per-sculpture edits. | `sections/build-375-s1.png`, `sections/home-375-s0.png`, `sections/transform-approach-375.png`, `sections/transform-375-s3.png`, `sections/build-375-s3.png` |
| H2 | **High** | `/` | Decorative SVG diagrams (philosophy / pathways) | ≤768 | Metrics report SVG nodes ~549px wide with `left: -75` while `overflowX` remains false (clipped). Risk of cropped diagram labels and uneven composition. | Absolutely positioned / oversized SVG art without a matching mobile layout variant. | Mobile-specific SVG viewBox / scale, or swap to a stacked diagram under `md`/`lg`. Keep desktop SVG untouched. | `metrics.json` home `wide[]` at 375/390/430/768 |
| H3 | **High** | `/transform` | Hero sculpture | 375–430 | Mobile sculpture image ~375×154 — short strip under CTAs; limited visual presence vs approved desktop. Text-safe stacking is OK (no copy overlap). | Mobile `<img>` branch uses full-bleed width with intrinsic landscape aspect; desktop sculpture hidden (`display:none` parent). | **Do not change desktop hero.** Only adjust the mobile image branch (min-height, object-position, or alternate mobile crop asset). | `sections/transform-375-s0.png`; `inspect.json` → `transform-hero-mobile` |
| H4 | **High** | `/build` | Journey at tablet | 768 | Five stages remain a horizontal strip; each column is very narrow; body copy feels cramped vs mobile’s comfortable vertical list. | Breakpoint keeps desktop/tablet horizontal journey too early (at `md`/`lg` without an intermediate stacked layout). | Keep vertical stack through 768 (or use 2+3 wrap); introduce horizontal only at ≥1024. Protect 1440 layout. | `sections/build-journey-768.png` |
| M1 | **Medium** | `/` | Hero sculpture + floating card | 375–430 | Sculpture heavily cropped at bottom/sides; “Build × Transform” card sits low over the art. CTAs do **not** geometrically overlap the card (~47px gap) but the first viewport feels crowded. | Absolute/overlay card positions tuned for desktop. | Nudge card / sculpture scale only under `max-lg`; preserve 1440 hero. | `sections/home-hero-375.png`, `sections/home-hero-430.png` |
| M2 | **Medium** | `/build` | Hero annotations | 375 | Sculpture remains clear; annotations readable but compact; large vertical gap between CTAs and sculpture. | Mobile stacking of a desktop-annotated visual. | Tighten vertical rhythm under `md`; optional slightly larger sculpture min-height — avoid changing annotation copy. | `sections/build-375-s0.png` |
| M3 | **Medium** | `/build` | Partnership convergence | 375 vs 768 | 375 uses stacked Domain Partner → AshviTech → Shared Venture (works). 768 uses two-column converging lines (generally good) with denser side labels. | Dual layouts; tablet uses desktop composition early. | Minor label size / padding polish at 768 only if needed after C1/H1. | `sections/build-375-s1.png`, `sections/build-partnership-768.png` |
| M4 | **Medium** | `/transform` | Operating-system / “Where we look” | 375–768 | Mobile vertical list (01–04) is clear. At 768, desktop OS diagram still hidden (`lg` gated) — acceptable, but tablet landscape 1024 jumps to desktop. | `lg` breakpoint (~1024). | Optional tablet-tuned diagram between 768–1023; not required if vertical list stays. | `sections/transform-375-s1.png`, `sections/transform-where-768.png` |
| M5 | **Medium** | `/about` | Institution / shader section | 375 | Tall dark section; on small screens shader host is disabled (by design). Section can feel sparse (glow only) if surrounding copy reveal fails (see C2). | Mobile skips WebGL; copy depends on reveals. | Ensure copy visibility (C2); optional static fallback illustration for mobile — separate from shader perf work. | `sections/about-institution-375.png`, `about-institution-375-visible.png` |
| M6 | **Medium** | `/` | Engineering Philosophy accordion | 375 | Metrics showed some accordion body spans at `h: 0` when collapsed — expected if closed, but verify expanded panels don’t clip. | Collapse animation / grid-template or `hidden`. | Manual tap test in fix phase; ensure expanded content not trapped under sticky header. | `metrics.json` home sections `_r_3_-b-02` etc. |
| L1 | **Low** | `/contact` | Form card | 375 | Form works; fields stack; radios full-width (~279px); validation messages visible. Side margins of the dark card are tight. | Card nearly edge-to-edge by design. | Optional +4–8px horizontal inset under `sm`. | `sections/contact-375-s0.png`, `sections/contact-375-validation.png` |
| L2 | **Low** | `/research` | Hero headline | 375 | Headline wraps to ~4 lines; still readable; landscape art clipped as intentional base. | Narrow width + large serif. | Optional slight clamp tweak under 400px only. | `sections/research-375-s0.png` |
| L3 | **Low** | `/about` | Watermark | 375 | Watermark crops at right edge (`-right-[12%]`, `w-[60vw]`) — intentional peek; ensure it never covers H1 (z-index OK when reveal visible). | Absolute watermark. | Leave unless contrast complaint; verify after C2. | `sections/about-hero-375-visible.png` |
| L4 | **Low** | All | Focus rings / tap targets | 375–768 | Header burger is 44×44 (`h-11 w-11`) — good. Full focus-visible audit incomplete while menu is broken (C1). | — | Re-test focus order after C1 fix. | — |

---

## 4. Page-by-page findings

### 4.1 `/` — Homepage

**Works well**

- Hero typography hierarchy (eyebrow → serif headline → tide subline → body → stacked CTAs).
- Build / Transform pathway cards stack cleanly (`sections/home-375-s1.png`).
- WYZ product frame scales to width; caption readable.
- Contact closing + footer stack; no document horizontal scroll.

**Issues**

- **C1** mobile menu unusable.
- **H1** sticky header over WYZ / section labels when scrolled.
- **H2** wide decorative SVGs.
- **M1** cropped hero sculpture + busy lower hero.
- **C2** risk for reveal-wrapped blocks under reduced motion.

**Screenshots:** `pages/home-{375,390,430,768,1024,1440}.png`, `sections/home-hero-375.png`, `sections/home-375-s0.png`, `sections/home-375-s1.png`

### 4.2 `/build` — Build

**Works well**

- Hero copy + dual CTAs readable; annotations (“Domain Expertise”, “Engineering Capability”, “AI-Native Venture”) legible at 375 without horizontal scroll.
- Opportunity prose column comfortable.
- Five-stage journey **vertical** layout on small mobile is clear (`sections/build-375-s2.png`).
- WYZ laptop showcase scales; “illustrative demo data” caption OK.
- Closing wireframe / CTA section readable on dark ground.

**Issues**

- **C1** menu.
- **H1** partnership intro under sticky header (`sections/build-375-s1.png`).
- **H4** journey too horizontal/narrow at 768.
- **M2/M3** sculpture spacing / tablet partnership density.

**Screenshots:** `pages/build-*.png`, `sections/build-375-s0..s3.png`, `sections/build-journey-768.png`, `sections/build-partnership-768.png`

### 4.3 `/transform` — Transform

**Works well**

- **Hero text + both CTAs stack without overlapping the sculpture** at 375 (text-safe area preserved).
- Beyond Automation / approach vertical timeline readable once past header overlap.
- Partnership principles list clear.
- At 1024 landscape, desktop nav + side sculpture composition appears (`sections/transform-hero-1024.png`) — treat as desktop-adjacent; **do not regress**.

**Issues**

- **C1** menu.
- **H3** mobile sculpture visually weak (short strip).
- **H1** approach / partnership headings under sticky header.
- Desktop hero must remain locked in the fix phase.

**Screenshots:** `pages/transform-*.png`, `sections/transform-375-s0..s3.png`, `sections/transform-approach-375.png`, `sections/transform-hero-1024.png`

### 4.4 `/research` — Research

**Works well**

- Scientific landscape hero: headline wrap acceptable; keyword row wraps cleanly; mesh art does not cover copy.
- Methodology stages readable on mobile.
- **Prateesh Goyal memorial** retains a thoughtful, readable layout (label, serif name, ruled paragraphs) — `sections/research-memorial-375.png`.
- Collaboration CTA transition is clear.

**Issues**

- **C1** menu; **C2** if reveals wrap research sections under reduced motion (verify in fix phase).
- **L2** long headline wrap (polish only).

**Screenshots:** `pages/research-*.png`, `sections/research-375-s0.png`, `sections/research-memorial-375.png`

### 4.5 `/about` — About

**Works well** *(when reveals are visible)*

- Conviction headline and supporting copy read well at 375 (`sections/about-hero-375-visible.png`).
- Opportunity comparison and Build × Explore content stack.
- Long View editorial columns collapse to a single readable column.
- Invitation / footer transition OK.

**Issues**

- **C2** Critical — reduced-motion users can get a blank-looking page.
- **M5** sparse mobile institution section without shader.
- **L3** watermark crop (acceptable).
- Early audit full-pages looked empty because of C2 + capture settings — not missing DOM content (`textLen` in metrics is substantial).

**Screenshots:** `pages/about-*.png`, `sections/about-hero-375-visible.png`, `sections/about-long-view-375-visible.png`, `sections/about-institution-375-visible.png`

### 4.6 `/contact` — Contact

**Works well**

- Intro headline, `hello@ashvi.tech`, contextual build/transform/research links.
- Form container stacks: name → email → inquiry radios (full width, adequate tap targets) → message → submit.
- Validation errors render inline (`sections/contact-375-validation.png`) — no real submissions made.
- Solid light header on Contact avoids transparent-over-content at top.

**Issues**

- **C1** still blocks mobile IA.
- **L1** tight card side inset.
- Keyboard / virtual-keyboard occlusion not fully device-tested; recommend iOS Safari check in fix QA (focus field → ensure submit not trapped under keyboard).

**Screenshots:** `pages/contact-*.png`, `sections/contact-375-s0.png`, `sections/contact-375-validation.png`

---

## 5. Navigation and interactions

| Check | Result |
|---|---|
| Mobile menu open/close | **Fail (C1)** — icon state toggles; panel height 0 |
| Build/Transform submenu (mobile) | Present in DOM under “What We Do”; unreachable while C1 stands |
| Desktop What We Do dropdown @ 1440 | Captured — `nav/desktop-wwd-dropdown-1440.png` |
| Body scroll while menu open | `overflow: hidden` applied (good) but meaningless while panel collapsed |
| Sticky header | Works; contributes to H1 overlays |
| Anchor scroll (`/#our-work`, `/build#how-we-build-together`) | Spot-checked OK (gap ~113–115px below header) |
| Nav at 1024 | Desktop nav (`lg:flex`); burger hidden |
| Focus visibility | Incomplete until C1 fixed |
| Orientation switch | Not separately filmed; expect C1 + H4 to dominate landscape tablet |

---

## 6. Desktop (1440) regression risks

Fixes that are **dangerous** if scoped too broadly:

| Area | Risk |
|---|---|
| Transform hero sculpture positioning / gradient | Prior regressions; **mobile-only** image branch changes |
| Build partnership converging SVG geometry | Desktop two-column line math; don’t retune control points globally |
| Home hero absolute card + sculpture | Desktop composition approved; use `max-lg:` overrides |
| Header `backdrop-blur` removal without replacement | Can change desktop scrolled header look — prefer opaque bg **or** portal menu |
| Shared `AnimatedReveal` | Site-wide; fix is correct for a11y but re-test homepage reveals don’t “pop” harshly |
| Journey breakpoint | Raising stack breakpoint affects tablet only if carefully gated below 1024/1440 |

**Documented horizontal overflow:** none at 1440. No genuine desktop layout defect required action from this pass.

---

## 7. Sections that already work well

- Contact form structure, validation chrome, and inquiry options on mobile.
- Research memorial tone and readability.
- Build mobile journey (vertical five-stage).
- Transform mobile “Where we look” numbered list.
- Homepage Build / Transform pathway cards.
- Consistent horizontal padding language (`px-6` / shell) across most marketing sections.
- No page-level horizontal scrolling at tested widths.

---

## 8. Recommended correction order

1. **C1 — Mobile menu containing-block / backdrop-filter** (unblocks all mobile QA).  
2. **C2 — `AnimatedReveal` + `usePrefersReducedMotion` hydration/visibility** (a11y; About blank page).  
3. **H1 — Sticky header vs section intros** (`scroll-mt`, section padding, opaque scrolled header on dark bands).  
4. **H4 — Build journey tablet stacking.**  
5. **H3 — Transform mobile sculpture prominence only** (leave desktop hero untouched).  
6. **H2 — Home SVG mobile scaling.**  
7. **M1–M6** spacing / density polish.  
8. **L1–L4** and full focus/keyboard pass after menu works.

---

## 9. Screenshot index

```
scripts/responsive-audit/
  pages/           # home|build|transform|research|about|contact × 375,390,430,768,1024,1440
  sections/        # targeted crops (heroes, WYZ, partnership, journey, memorial, contact, about)
  nav/             # mobile menu attempts + desktop What We Do dropdown
  metrics.json     # overflow, section boxes, wide-node probe
  inspect.json     # menu/hero/form probes
  inspect-more.json
  final-checks.json
  capture.mjs      # primary capture harness
```

---

## 10. Out of scope (per brief)

- No React/CSS/breakpoint edits in this pass.  
- No Transform hero redesign.  
- No asset regeneration.  
- No shader performance testing.  
- No real contact form submissions.

---

**Audit first. Fix second.**
