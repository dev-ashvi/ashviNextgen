"use client";

import { useEffect, useId, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  AIS,
  GRID_EDGES,
  HUMANS,
  HYBRID_EDGES,
  PLAY_MS,
  VB,
  VISIBILITY_RATIO,
  curvePath,
  linePath,
  pointMap,
  type Pt,
} from "./din-geometry";

function stagesLabelSafe(final: boolean) {
  return final
    ? "Expertise × intelligent systems"
    : "People-dependent structure";
}

/** Survives React Strict Mode remounts for a single page visit. */
let pageVisitCompleted = false;
let pageVisitStarted = false;

type DualIntelligenceNetworkProps = {
  className?: string;
  /** Force a progress 0–1 (for tests / screenshots). */
  progressOverride?: number;
};

/**
 * Static SVG first paint + deferred one-shot playback.
 * Animation engine (`din-playback`) loads only when the diagram is about to run.
 */
export function DualIntelligenceNetwork({
  className = "",
  progressOverride,
}: DualIntelligenceNetworkProps) {
  const reduce = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);

  const forceFinal =
    reduce ||
    pageVisitCompleted ||
    (typeof progressOverride === "number" && progressOverride >= 1);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("din");
    if (raw == null && progressOverride == null) return;
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;

    void (async () => {
      const { applyFrame, cacheHandles } = await import("./din-playback");
      if (cancelled || !rootRef.current) return;
      const handles = cacheHandles(rootRef.current, uid);
      const t =
        progressOverride != null
          ? Math.min(1, Math.max(0, progressOverride))
          : Math.min(1, Math.max(0, Number(raw)));
      applyFrame(handles, t * (PLAY_MS / 1000), 1);
      if (t >= 1) pageVisitCompleted = true;
    })();

    return () => {
      cancelled = true;
    };
  }, [progressOverride, uid]);

  useEffect(() => {
    if (progressOverride != null) return;
    if (new URLSearchParams(window.location.search).has("din")) return;
    if (reduce) {
      pageVisitCompleted = true;
      return;
    }

    const root = rootRef.current;
    if (!root) return;
    if (pageVisitCompleted) return;

    const stage = root.querySelector<HTMLElement>(`[data-din-stage="${uid}"]`);
    const sentinel = root.querySelector<HTMLElement>(
      `[data-din-sentinel="${uid}"]`,
    );
    const vh = window.innerHeight || 1;
    const stageH = (stage ?? root).getBoundingClientRect().height || 1;
    const useSentinel = Boolean(sentinel) && stageH > vh * 0.95;
    const observeTarget = useSentinel ? sentinel! : (stage ?? root);
    const threshold = useSentinel ? 0.6 : VISIBILITY_RATIO;

    let cancelled = false;
    let abort: AbortController | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (pageVisitStarted || pageVisitCompleted) {
          observer.disconnect();
          return;
        }
        if (entry.intersectionRatio + 1e-3 < threshold) return;
        observer.disconnect();
        pageVisitStarted = true;

        void (async () => {
          const compact =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(max-width: 640px)").matches;
          const { cacheHandles, playOnce, applyFrame } = await import(
            "./din-playback"
          );
          if (cancelled || pageVisitCompleted || !rootRef.current) return;
          const handles = cacheHandles(rootRef.current, uid);
          abort = new AbortController();
          const ctrl = playOnce(handles, {
            compact,
            signal: abort.signal,
          });
          await ctrl.done;
          if (!cancelled) {
            pageVisitCompleted = true;
            applyFrame(handles, PLAY_MS / 1000, 1);
          }
        })();
      },
      {
        threshold: [0.35, 0.5, 0.55, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 1],
        rootMargin: "0px",
      },
    );

    observer.observe(observeTarget);

    return () => {
      cancelled = true;
      abort?.abort();
      observer.disconnect();
      if (!pageVisitCompleted) pageVisitStarted = false;
    };
  }, [progressOverride, reduce, uid]);

  const pts0 = pointMap(forceFinal ? 1 : 0);
  const gridEdgeT = forceFinal ? 0 : 1;
  const hybridEdgeT = forceFinal ? 1 : 0;
  const removeT = forceFinal ? 1 : 0;
  const aiT = forceFinal ? 1 : 0;
  const relocateT = forceFinal ? 1 : 0;

  return (
    <figure ref={rootRef} className={`relative w-full ${className}`}>
      <div
        data-din-stage={uid}
        className="relative -mb-7 sm:-mb-8"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: `${VB.w}px ${VB.h}px`,
        }}
      >
        {/* Soft atmospheric field — not a card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[50%] top-[50%] h-[62%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,205,184,0.07)_0%,rgba(0,56,118,0.035)_38%,transparent_70%)]"
        />

        <span
          data-din-sentinel={uid}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[42%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-0"
        />
        {/* Stage status for a11y / playback updates — not a visible diagram title */}
        <p data-din-label={uid} className="sr-only">
          {stagesLabelSafe(forceFinal)}
        </p>

        <NetworkSvg
          uid={uid}
          pts={pts0}
          gridEdgeT={gridEdgeT}
          hybridEdgeT={hybridEdgeT}
          removeT={removeT}
          aiT={aiT}
          relocateT={relocateT}
        />
      </div>

      {/* Legend as label-row of the diagram — optically tight to node ink (stage -mb) */}
      <figcaption className="relative mt-0">
        <ul
          className="flex flex-wrap items-start gap-x-5 gap-y-2 sm:gap-x-6"
          aria-hidden="true"
        >
          <li className="flex items-center gap-2">
            <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
              <span className="block h-[11px] w-[11px] rounded-full bg-[#003876] ring-1 ring-[#021336]/90" />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block text-[11.5px] font-medium tracking-[-0.01em] text-ink/75">
                Domain Experts
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-mute">
                Human knowledge &amp; judgement
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
              <span className="block h-[11px] w-[11px] rounded-[3px] bg-[#021336] ring-[1.5px] ring-[#00CDB8]/85" />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block text-[11.5px] font-medium tracking-[-0.01em] text-ink/75">
                Intelligent Systems
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-mute">
                Technology extending capabilities
              </span>
            </span>
          </li>
        </ul>
        <p className="sr-only">
          Illustrative diagram. Circles represent domain experts; squares
          represent intelligent systems. The animation shows a possible
          operating-model shift—not a proven staffing outcome.
        </p>
      </figcaption>
    </figure>
  );
}

function NetworkSvg({
  uid,
  pts,
  gridEdgeT,
  hybridEdgeT,
  removeT,
  aiT,
  relocateT,
}: {
  uid: string;
  pts: Map<string, Pt>;
  gridEdgeT: number;
  hybridEdgeT: number;
  removeT: number;
  aiT: number;
  relocateT: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className="relative mx-auto block h-auto w-full max-w-full"
      role="img"
      aria-label="Animation of a business operating structure transforming from a regular human staffing grid into a hybrid network of domain experts and intelligent systems"
    >
      <defs>
        <linearGradient
          id={`din-link-human-${uid}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#003876" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#003876" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient
          id={`din-link-teal-${uid}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00CDB8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#003876" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <g
        data-din-grid={uid}
        opacity={gridEdgeT}
        stroke="#003876"
        strokeWidth="0.9"
      >
        {GRID_EDGES.map((e) => {
          const a = pts.get(e.from)!;
          const b = pts.get(e.to)!;
          return (
            <path
              key={e.id}
              d={linePath(a, b)}
              fill="none"
              strokeOpacity={0.22 * gridEdgeT}
            />
          );
        })}
      </g>

      <g data-din-hybrid={uid} opacity={hybridEdgeT}>
        {HYBRID_EDGES.map((e) => {
          const a = pts.get(e.from)!;
          const b = pts.get(e.to)!;
          const aiLink = e.from.startsWith("a") || e.to.startsWith("a");
          return (
            <path
              key={e.id}
              data-from={e.from}
              data-to={e.to}
              d={curvePath(a, b, aiLink ? 0.1 : 0.06)}
              fill="none"
              stroke={
                aiLink
                  ? `url(#din-link-teal-${uid})`
                  : `url(#din-link-human-${uid})`
              }
              strokeWidth={aiLink ? 1.05 : 0.85}
              strokeLinecap="round"
              strokeOpacity={0.42 + hybridEdgeT * 0.28}
              style={{
                strokeDasharray: 180,
                strokeDashoffset: 180 * (1 - hybridEdgeT),
              }}
            />
          );
        })}
      </g>

      {HUMANS.map((h) => {
        const p = pts.get(h.id)!;
        const opacity = h.retained ? 1 : 1 - removeT;
        const scale = h.retained ? 1 + relocateT * 0.04 : 1 - removeT * 0.18;
        return (
          <g
            key={h.id}
            data-din-human={h.id}
            transform={`translate(${p.x} ${p.y}) scale(${scale})`}
            opacity={opacity}
            style={{ display: opacity < 0.02 ? "none" : undefined }}
          >
            <circle r="14" fill="#F8F9FD" />
            <circle r="11.5" fill="#003876" stroke="#021336" strokeWidth="0.9" />
            <circle cx="0" cy="-2.9" r="2.85" fill="#F8F9FD" opacity="0.92" />
            <path
              d="M -5.1 6.6 C -5.1 2.9 -2.8 1.1 0 1.1 C 2.8 1.1 5.1 2.9 5.1 6.6"
              fill="#F8F9FD"
              opacity="0.92"
            />
          </g>
        );
      })}

      {AIS.map((a) => {
        const p = pts.get(a.id)!;
        // Slightly larger than human nodes for restrained emphasis.
        const scale = 0.58 + aiT * 0.5;
        return (
          <g
            key={a.id}
            data-din-ai={a.id}
            transform={`translate(${p.x} ${p.y}) scale(${scale})`}
            opacity={aiT}
            style={{ display: aiT < 0.02 ? "none" : undefined }}
          >
            <rect
              x="-13.5"
              y="-13.5"
              width="27"
              height="27"
              rx="5.5"
              fill="#021336"
              stroke="#00CDB8"
              strokeWidth="1.45"
              strokeOpacity={0.78 + aiT * 0.18}
            />
            <rect
              x="-5.5"
              y="-5.5"
              width="11"
              height="11"
              rx="1.75"
              fill="none"
              stroke="#00CDB8"
              strokeWidth="1.1"
              strokeOpacity="0.82"
            />
            <circle cx="0" cy="0" r="2.05" fill="#00CDB8" />
          </g>
        );
      })}
    </svg>
  );
}
