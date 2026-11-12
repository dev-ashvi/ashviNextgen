/**
 * TransformHeroVisual — "fragmentation to intelligence".
 *
 * A replaceable decorative image: separate translucent panels on the left are reorganised, through a
 * luminous central point, into larger connected panels on the right. No text inside the artwork.
 *
 * The default source is the sculpture region of the approved reference (876 × 360 px, no text). It is
 * crisp at 1× but soft on high-density screens; replace `src` with the original render at ≥ 2× when available.
 * The image carries its own light-to-dark background, so the hero's CSS gradient is matched to its edges
 * (see TRANSFORM_HERO_GRADIENT) and the left and top edges are feathered into it.
 *
 * `presentation="mobileHero"` is for the stacked mobile branch only — a taller framed crop that keeps
 * the central transformation point. Desktop must keep the default presentation.
 */

import { cn } from "@/lib/utils";

export const TRANSFORM_HERO_GRADIENT =
  "linear-gradient(90deg,#F5F7FC 0%,#F3F6FB 30%,#E2EAF3 38%,#C4D3E3 43%,#6B88A3 56%,#233F5C 70%,#0C283E 84%,#061830 100%)";

const DESKTOP_MASK =
  "[mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent_0%,#000_9%),linear-gradient(180deg,transparent_0%,#000_16%)] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_9%),linear-gradient(180deg,transparent_0%,#000_16%)]";

/** Softer feather so more of the sculpture reads in a taller mobile frame. */
const MOBILE_MASK =
  "[mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent_0%,#000_5%),linear-gradient(180deg,transparent_0%,#000_7%)] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_5%),linear-gradient(180deg,transparent_0%,#000_7%)]";

export function TransformHeroVisual({
  src = "/transform/hero-sculpture-reference.webp",
  width = 876,
  height = 360,
  className = "",
  presentation = "default",
}: {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
  /** `mobileHero` — cover-crop into a framed mobile slot. Never use on the desktop branch. */
  presentation?: "default" | "mobileHero";
}) {
  const mobile = presentation === "mobileHero";

  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden="true">
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        decoding="async"
        fetchPriority="high"
        className={cn(
          "block",
          mobile
            ? cn(
                "h-full w-full max-w-none object-cover object-[center_42%]",
                MOBILE_MASK,
              )
            : cn("h-auto w-full", DESKTOP_MASK),
        )}
      />
    </div>
  );
}
