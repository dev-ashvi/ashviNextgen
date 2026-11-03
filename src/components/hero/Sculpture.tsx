import type { ReactNode } from "react";
import { Stage } from "./Stage";

/**
 * The approved Dual Intelligence sculpture (Firefly_RemoveBackground.png),
 * shown untouched, standing on a softly lit studio surface (see Stage).
 * The object floats a few pixels; the floor shadows tighten as it rises.
 */
export function Sculpture({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[1698/1266] ${className}`}>
      <Stage layer="back" />
      <Stage layer="shadow" />

      <picture>
        <source
          type="image/webp"
          srcSet="/art/sculpture-900.webp 900w, /art/sculpture-1600.webp 1600w"
          sizes="(min-width: 1500px) 42vw, (min-width: 1024px) min(46vw, 720px), 110vw"
        />
        <img
          src="/art/sculpture-1600.png"
          alt="Dual Intelligence: a navy architectural form and a translucent teal ribbon interlocking — human expertise and artificial intelligence working together."
          width={1698}
          height={1266}
          fetchPriority="high"
          decoding="async"
          className="sculpt-float relative block h-full w-full select-none object-contain"
          draggable={false}
        />
      </picture>

      {children}
    </div>
  );
}
