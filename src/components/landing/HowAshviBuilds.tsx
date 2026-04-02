"use client";

import { useId, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SWEEP_MS = 52000;

/** Clockwise from top, 72° apart: Sense → Research → Architect → Build & Validate → Venture & Scale */
const STEPS = [
  {
    name: "Sense",
    label: "Sense",
    text: "We identify problems worth solving — not just opportunities, but gaps that matter.",
  },
  {
    name: "Research",
    label: "Research",
    text: "We go deeper than surface solutions — exploring technology, systems, and possibilities.",
  },
  {
    name: "Architect",
    label: "Architect",
    text: "We design systems, not features — defining how everything connects and scales.",
  },
  {
    name: "Build & Validate",
    label: "Build & validate",
    text: "We create and test in the real world — refining through feedback, usage, and iteration.",
  },
  {
    name: "Venture & Scale",
    label: "Venture",
    text: "We shape what works into companies — and support their growth through systems and capital.",
  },
] as const;

const R_OUTER = 198;
const SIGNAL_R = 156;
const CONCENTRIC_R = [40, 76, 114, 150, 186];

/** Even 72° spacing from Sense at top (270°). SVG: 0° = right, 90° = bottom, 270° = top. */
const STAGE_CENTER_DEG: readonly number[] = STEPS.map(
  (_, i) => (270 + i * 72) % 360,
);

/** CSS placement from 12 o’clock, clockwise — same as stage order (72° steps). */
const LABEL_PLACE_DEG: readonly number[] = STEPS.map((_, i) => i * 72);

function polarDeg(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

function flowArcPath(progressDeg: number, r: number): string {
  const start = polarDeg(270, r);
  if (progressDeg < 0.35) return `M ${start.x} ${start.y}`;
  if (progressDeg >= 359.5) {
    const mid = polarDeg(90, r);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${mid.x} ${mid.y} A ${r} ${r} 0 1 1 ${start.x} ${start.y}`;
  }
  const end = polarDeg(270 + progressDeg, r);
  const large = progressDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

function signalCoords() {
  return STEPS.map((_, i) => {
    const deg = STAGE_CENTER_DEG[i];
    const rad = (deg * Math.PI) / 180;
    return {
      i,
      cx: SIGNAL_R * Math.cos(rad),
      cy: SIGNAL_R * Math.sin(rad),
    };
  });
}

/**
 * psi: sweep progress 0–360 over one cycle (time).
 * Leading edge at (270 + psi)° — clockwise from Sense at top.
 */
function activeIndexFromSweep(psi: number): number {
  const phi = ((270 + psi) % 360 + 360) % 360;
  let best = 0;
  let bestD = 400;
  for (let i = 0; i < 5; i++) {
    const c = STAGE_CENTER_DEG[i];
    let d = Math.abs(phi - c);
    if (d > 180) d = 360 - d;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export function HowAshviBuilds() {
  const rid = useId().replace(/:/g, "");
  const reduced = usePrefersReducedMotion();
  const startRef = useRef<number | null>(null);
  const [sweepDeg, setSweepDeg] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pulseKey, setPulseKey] = useState<number[]>(() => [0, 0, 0, 0, 0]);
  const prevActive = useRef(0);
  const [cyclesDone, setCyclesDone] = useState(0);
  const prevCycleRef = useRef(0);
  const [burstKey, setBurstKey] = useState(0);
  const [diskCycleFlash, setDiskCycleFlash] = useState(false);

  const signals = signalCoords();

  useEffect(() => {
    if (reduced) return;
    startRef.current = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const t0 = startRef.current ?? now;
      const elapsed = now - t0;
      const psi = ((elapsed % SWEEP_MS) / SWEEP_MS) * 360;
      setSweepDeg(psi);
      setActiveIndex(activeIndexFromSweep(psi));
      setCyclesDone(Math.floor(elapsed / SWEEP_MS));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) {
      setSweepDeg(0);
      setActiveIndex(0);
      return;
    }
  }, [reduced]);

  useEffect(() => {
    if (prevActive.current !== activeIndex) {
      setPulseKey((pk) => {
        const next = [...pk];
        next[activeIndex] = next[activeIndex] + 1;
        return next;
      });
    }
    prevActive.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (reduced) return;
    const prev = prevCycleRef.current;
    if (cyclesDone <= prev) return;
    prevCycleRef.current = cyclesDone;
    setBurstKey((k) => k + 1);
    setDiskCycleFlash(true);
    const t = window.setTimeout(() => setDiskCycleFlash(false), 920);
    return () => window.clearTimeout(t);
  }, [cyclesDone, reduced]);

  const sweepTransform = ((270 + (reduced ? 0 : sweepDeg)) % 360 + 360) % 360;
  const flowProgress = reduced ? 360 : sweepDeg;
  const showCycleClose = cyclesDone >= 1 || reduced;

  const stageHeadline = STEPS[activeIndex].name.toUpperCase();

  return (
    <section
      className={`ac-build-radar${reduced ? " ac-build-radar--reduced" : ""}`}
      id="how-builds"
      aria-labelledby="how-builds-heading"
    >
      <div className="ac-build-radar-grid">
        <div className="ac-build-radar-visual ac-fi ac-fi-d2">
          <div
            className={`ac-build-radar-disk${diskCycleFlash && !reduced ? " ac-build-radar-disk--cycle-flash" : ""}`}
          >
        {STEPS.map((step, i) => {
          const place = LABEL_PLACE_DEG[i] ?? 0;
          const isWide = step.name === "Build & Validate";
          return (
            <div
              key={step.name}
              className={`ac-build-radar-label${
                i === activeIndex
                  ? " ac-build-radar-label--active"
                  : " ac-build-radar-label--idle"
              }${isWide ? " ac-build-radar-label--wide" : ""}`}
              style={{
                transform: `translate(-50%, -50%) rotate(${place}deg) translateY(calc(-1 * var(--ac-build-orbit) - var(--ac-build-label-gap, 10px))) rotate(${-place}deg)`,
              }}
            >
              <span className="ac-build-radar-label-text">{step.label}</span>
            </div>
          );
        })}

        <svg
          className="ac-build-radar-svg"
          viewBox="-220 -220 440 440"
          preserveAspectRatio="xMidYMid meet"
          role="presentation"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${rid}-sweep`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#00d4ff" stopOpacity="0.14" />
              <stop offset="0.5" stopColor="#00d4ff" stopOpacity="0.045" />
              <stop offset="1" stopColor="#00d4ff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`${rid}-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 212, 255, 0.09)" />
              <stop offset="70%" stopColor="rgba(0, 212, 255, 0.02)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
            <filter
              id={`${rid}-node`}
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={0} cy={0} r={118} fill={`url(#${rid}-core)`} />

          {CONCENTRIC_R.map((r) => (
            <circle
              key={r}
              cx={0}
              cy={0}
              r={r}
              fill="none"
              stroke="rgba(0, 212, 255, 0.038)"
              strokeWidth={1}
            />
          ))}

          {STAGE_CENTER_DEG.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x2 = R_OUTER * Math.cos(rad);
            const y2 = R_OUTER * Math.sin(rad);
            return (
              <line
                key={`stage-spoke-${deg}`}
                x1={0}
                y1={0}
                x2={x2}
                y2={y2}
                stroke="rgba(0, 212, 255, 0.032)"
                strokeWidth={0.55}
              />
            );
          })}

          <g className="ac-build-radar-mesh">
            <polygon
              points="-98,-128 108,-72 152,38 58,142 -118,108 -158,-22"
              fill="rgba(0, 212, 255, 0.014)"
              stroke="rgba(0, 212, 255, 0.045)"
              strokeWidth={0.5}
            />
            <g className="ac-build-radar-mesh-inner">
              <polygon
                points="-72,-98 92,-55 122,48 48,122 -98,92 -122,-15"
                fill="rgba(0, 212, 255, 0.009)"
                stroke="rgba(0, 212, 255, 0.032)"
                strokeWidth={0.45}
              />
            </g>
          </g>

          <circle
            className="ac-build-radar-flow-base"
            cx={0}
            cy={0}
            r={SIGNAL_R}
            fill="none"
            stroke="rgba(0, 212, 255, 0.075)"
            strokeWidth={0.6}
          />
          <path
            className="ac-build-radar-flow-progress"
            d={flowArcPath(flowProgress, SIGNAL_R)}
            fill="none"
            stroke="rgba(0, 212, 255, 0.3)"
            strokeWidth={1.05}
            strokeLinecap="round"
          />

          {signals.map(({ cx, cy, i }) => {
            const isHot = i === activeIndex;
            return (
              <line
                key={`conn-${i}`}
                x1={0}
                y1={0}
                x2={cx}
                y2={cy}
                className="ac-build-radar-conn"
                stroke="rgba(0, 212, 255, 0.12)"
                strokeWidth={isHot ? 0.85 : 0.48}
                opacity={isHot ? 0.52 : 0.13}
              />
            );
          })}

          <g transform={`rotate(${sweepTransform})`}>
            <path
              d="M 0 0 L 210 0 A 210 210 0 0 1 105 182.14 Z"
              fill={`url(#${rid}-sweep)`}
              opacity={0.58}
            />
          </g>

          {signals.map(({ cx, cy, i }) => {
            const isHot = i === activeIndex;
            const nr = isHot ? 4.35 : 2.25;
            const fill = isHot
              ? "rgba(0, 234, 255, 0.95)"
              : "rgba(0, 212, 255, 0.26)";
            const op = isHot ? 1 : 0.34;
            return (
              <g key={i}>
                {!reduced && isHot && pulseKey[i] > 0 && (
                  <g
                    key={pulseKey[i]}
                    className="ac-build-radar-hit-pulse"
                    transform={`translate(${cx} ${cy})`}
                  >
                    <circle
                      r={16}
                      fill="none"
                      stroke="rgba(0, 234, 255, 0.4)"
                      strokeWidth={0.9}
                    />
                  </g>
                )}
                <g transform={`translate(${cx} ${cy})`}>
                  {isHot && (
                    <circle
                      cx={0}
                      cy={0}
                      r={nr * 2.35}
                      fill="rgba(0, 234, 255, 0.14)"
                      className="ac-build-radar-node-glow"
                      opacity={0.95}
                    />
                  )}
                  <circle
                    cx={0}
                    cy={0}
                    r={nr}
                    fill={fill}
                    filter={`url(#${rid}-node)`}
                    className={isHot ? "ac-build-radar-node--hot" : ""}
                    opacity={op}
                  />
                </g>
              </g>
            );
          })}

          {!reduced && burstKey > 0 && (
            <g key={burstKey} className="ac-build-radar-cycle-burst">
              <circle
                cx={0}
                cy={0}
                r={SIGNAL_R}
                fill="none"
                stroke="rgba(0, 234, 255, 0.45)"
                strokeWidth={1.2}
              />
            </g>
          )}
        </svg>
          </div>
        </div>

        <div className="ac-build-radar-editorial ac-fi ac-fi-d2">
          <header className="ac-build-radar-lead">
            <h2 className="ac-build-radar-title" id="how-builds-heading">
              How Ashvi Builds
            </h2>
            <p className="ac-build-radar-sub">
              A research-driven path from insight to venture.
            </p>
          </header>

          <div
            className="ac-build-radar-live"
            aria-live="polite"
            aria-atomic="true"
          >
            <p
              className="ac-build-radar-live-stage"
              key={`stage-${activeIndex}`}
            >
              {stageHeadline}
            </p>
            <p
              className="ac-build-radar-live-copy"
              key={`copy-${activeIndex}`}
            >
              {STEPS[activeIndex].text}
            </p>
          </div>

          <p className="ac-build-radar-principle">
            From sense to venture — and back again. This is a continuous
            system.
          </p>

          <p
            className={`ac-build-radar-close${showCycleClose ? " ac-build-radar-close--complete" : ""}`}
          >
            <span className="ac-build-radar-close-line">
              Every insight feeds the next.
            </span>
            <span className="ac-build-radar-close-line">
              Every system strengthens the loop.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
