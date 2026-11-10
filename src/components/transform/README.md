# /transform — integration notes (Next.js App Router)

## Files
- `TransformPage.tsx` — the six sections: Hero, Beyond Automation, Where We Look, Our Approach, Partnership Approach, Closing.
- `TransformHeroVisual.tsx` — the replaceable hero sculpture (`src`, `width`, `height`), plus `TRANSFORM_HERO_GRADIENT`, which the hero background is matched to.
- `OperatingSystemVisual.tsx` — the layered planes, native SVG. Props: `idPrefix` (must be unique per instance), `connectors`, `markerY`.
- Asset: `public/transform/hero-sculpture-reference.webp`.

## Steps
1. Copy `components/transform/*` and the asset.
2. Create `app/transform/page.tsx`:
   ```tsx
   import { TransformPage } from '@/components/transform/TransformPage'
   export const metadata = { title: 'Transform | AshviTech', description: 'We partner with existing businesses to rethink operations, redesign workflows and build intelligent systems.' }
   export default function Page() { return <TransformPage /> }
   ```
   No client-side JavaScript is needed (no state or effects).
3. The hero runs under a fixed, transparent header and has 120–132px of top padding for it. If your header is not fixed, reduce `pt-[120px] lg:pt-[132px]`.
4. Header tone: the hero is light on the left and dark on the right. In the prototype the nav uses a "split" tone until the page scrolls: navy logo, white links and an outlined white Contact button. Your shared header needs an equivalent variant on this route.
5. Nav: now that `/transform` exists, add Transform → `/transform` to the What We Do dropdown.
6. Uses Tailwind ≥ 3.4 (`text-balance`, arbitrary mask properties) and `font-serif` / `font-mono` from your theme.

## Hero asset
The default image is the sculpture region cropped from the approved reference (876 × 360 px, no text).
It is acceptable at 1× but soft on retina screens. Replace it with the original render at ≥ 1750 px wide.
If the new render's background differs, adjust `TRANSFORM_HERO_GRADIENT` so the left edge still blends.
