"use client";

import { useEffect, useId, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type MarkSculptureProps = {
  className?: string;
};

/**
 * Premium hero sculpture inspired by the AshviTech mark:
 * ascending peak, flowing wave cut, restrained teal shard.
 * Original form language — not an extruded logo PNG.
 */
export function MarkSculpture({ className }: MarkSculptureProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const bodyRef = useRef<SVGGElement>(null);
  const accentRef = useRef<SVGGElement>(null);
  const sheenRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;
      const t = (now - start) / 1000;
      const y = Math.sin(t * 0.36) * 5.5;
      const r = Math.sin(t * 0.2) * 0.55;
      const ay = Math.sin(t * 0.42 + 0.9) * 3.5;
      const sheen = 0.85 + Math.sin(t * 0.28) * 0.15;
      bodyRef.current?.setAttribute(
        "transform",
        `translate(0 ${y}) rotate(${r} 318 330)`,
      );
      accentRef.current?.setAttribute("transform", `translate(0 ${ay})`);
      sheenRef.current?.setAttribute("opacity", String(sheen));
      raf = requestAnimationFrame(tick);
    };

    const el = bodyRef.current?.ownerSVGElement;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    if (el) io.observe(el);
    raf = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const gFront = `ms-front-${uid}`;
  const gDepth = `ms-depth-${uid}`;
  const gCut = `ms-cut-${uid}`;
  const gCutRim = `ms-cutrim-${uid}`;
  const gAccent = `ms-accent-${uid}`;
  const gAccentSide = `ms-accentside-${uid}`;
  const gSheen = `ms-sheen-${uid}`;
  const gShadow = `ms-shadow-${uid}`;
  const gGlow = `ms-glow-${uid}`;
  const fSoft = `ms-soft-${uid}`;

  return (
    <div className={cn("relative isolate aspect-square w-full", className)} aria-hidden>
      <div className="pointer-events-none absolute left-1/2 top-[46%] h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,56,118,0.11)_0%,rgba(0,205,184,0.035)_44%,transparent_70%)]" />

      <svg viewBox="0 0 640 640" className="pointer-events-none absolute inset-0 h-full w-full">
        <circle cx="320" cy="328" r="296" fill="none" stroke="#06183D" strokeOpacity="0.055" />
        <circle
          cx="320"
          cy="328"
          r="240"
          fill="none"
          stroke="#06183D"
          strokeOpacity="0.04"
          strokeDasharray="2 8"
        />
        <line x1="36" y1="328" x2="604" y2="328" stroke="#06183D" strokeOpacity="0.035" />
        <line x1="320" y1="36" x2="320" y2="620" stroke="#06183D" strokeOpacity="0.035" />
      </svg>

      <svg viewBox="0 0 640 640" className="relative block h-auto w-full">
        <defs>
          <linearGradient id={gFront} x1="160" y1="90" x2="350" y2="540" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B5FA6" />
            <stop offset="40%" stopColor="#003876" />
            <stop offset="100%" stopColor="#021336" />
          </linearGradient>
          <linearGradient id={gDepth} x1="300" y1="110" x2="480" y2="510" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A3A72" />
            <stop offset="55%" stopColor="#021336" />
            <stop offset="100%" stopColor="#01091A" />
          </linearGradient>
          <linearGradient id={gCut} x1="300" y1="150" x2="420" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3479B8" />
            <stop offset="48%" stopColor="#0E4A84" />
            <stop offset="100%" stopColor="#06183D" />
          </linearGradient>
          <linearGradient id={gCutRim} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8F9FD" stopOpacity="0.38" />
            <stop offset="55%" stopColor="#F8F9FD" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#00CDB8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={gAccent} x1="360" y1="125" x2="470" y2="275" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="42%" stopColor="#00CDB8" />
            <stop offset="100%" stopColor="#0A9E8D" />
          </linearGradient>
          <linearGradient id={gAccentSide} x1="400" y1="145" x2="460" y2="295" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00B5A2" />
            <stop offset="100%" stopColor="#067A6E" />
          </linearGradient>
          <radialGradient
            id={gSheen}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(220 170) rotate(24) scale(148 118)"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gShadow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#021336" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#021336" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00CDB8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00CDB8" stopOpacity="0" />
          </radialGradient>
          <filter id={fSoft} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.45" />
          </filter>
        </defs>

        <ellipse cx="312" cy="556" rx="168" ry="20" fill={`url(#${gShadow})`} />

        <g ref={bodyRef}>
          {/* Depth slab — thickness without crude extrusion */}
          <path
            d="M304 104
               L430 186
               C452 255 462 340 452 412
               C438 486 388 528 312 538
               L312 512
               C368 502 404 466 416 404
               C428 340 420 268 400 214
               L304 146 Z"
            fill={`url(#${gDepth})`}
            opacity="0.94"
          />

          {/*
            Primary volume — logo-inspired silhouette:
            left peak flank + deep wave cut opening to the right
          */}
          <path
            d="M300 92
               L148 492
               C166 518 228 540 308 538
               C358 530 400 500 422 456
               C450 396 452 332 430 280
               C408 230 372 206 352 176
               C336 152 342 132 368 136
               C340 118 318 104 300 92 Z"
            fill={`url(#${gFront})`}
          />

          {/* Inner cut wall — makes the negative form dimensional */}
          <path
            d="M318 150
               C356 198 378 254 386 316
               C394 378 382 438 352 486
               C372 430 382 368 376 312
               C370 256 350 202 318 150 Z"
            fill={`url(#${gCut})`}
            opacity="0.78"
          />

          {/* Soft matte sheen on ascending left face */}
          <path
            ref={sheenRef}
            d="M236 172
               C268 134 298 118 320 150
               C300 194 270 238 238 280
               C226 238 222 200 236 172 Z"
            fill={`url(#${gSheen})`}
          />

          {/* Wave-cut catch light */}
          <path
            d="M346 152
               C378 208 398 272 402 338
               C404 392 390 446 360 492"
            fill="none"
            stroke={`url(#${gCutRim})`}
            strokeWidth="1.65"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Peak ridge */}
          <path
            d="M300 112 L300 512"
            stroke="#F8F9FD"
            strokeOpacity="0.1"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {/* Fold spark inside the cut */}
          <path
            d="M352 286
               C368 260 386 244 408 238"
            fill="none"
            stroke="#F8F9FD"
            strokeOpacity="0.4"
            strokeWidth="1.75"
            strokeLinecap="round"
            filter={`url(#${fSoft})`}
          />
        </g>

        <ellipse cx="408" cy="200" rx="54" ry="40" fill={`url(#${gGlow})`} />

        {/* Teal shard nestled in the wave cut */}
        <g ref={accentRef}>
          <path
            d="M372 148
               L454 204
               L444 268
               L372 212 Z"
            fill={`url(#${gAccentSide})`}
            opacity="0.92"
          />
          <path
            d="M364 136
               L450 194
               L430 262
               C408 236 386 192 364 136 Z"
            fill={`url(#${gAccent})`}
          />
          <path
            d="M378 156
               L428 192
               L416 228
               C402 206 388 176 378 156 Z"
            fill="#FFFFFF"
            opacity="0.15"
          />
          <path
            d="M364 136 L450 194"
            stroke="#FFFFFF"
            strokeOpacity="0.24"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
