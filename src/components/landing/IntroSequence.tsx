"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

type Phase = 0 | 1 | 2;

type TimerId = ReturnType<typeof globalThis.setTimeout>;

function clearTimerRef(t: { current: TimerId | null }) {
  if (t.current != null) {
    globalThis.clearTimeout(t.current);
    t.current = null;
  }
}

function autoDelayMs(phase: Phase, step: number): number {
  switch (phase) {
    case 0:
      return [1400, 5800, 5200, 5600][step] ?? 5600;
    case 1:
      return [
        1600, 4200, 2400, 2000, 3400, 3400, 3400, 2600, 2400, 3000, 5000,
      ][step] ?? 5000;
    case 2:
      return [1800, 3200, 2000, 2000, 3200, 3000, 7800][step] ?? 7800;
    default:
      return 2000;
  }
}

export function IntroSequence({
  reduced,
  onComplete,
}: {
  reduced: boolean;
  onComplete: () => void;
}) {
  const uid = useId().replace(/:/g, "");
  const fglow = `${uid}-iglow`;
  const fg2 = `${uid}-ig2`;
  const mk = `${uid}-imk`;

  const [phase, setPhase] = useState<Phase>(0);
  const [step, setStep] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const storyRootRef = useRef<HTMLDivElement>(null);
  const seqTimerRef = useRef<TimerId | null>(null);
  const finishOnceRef = useRef(false);
  const phaseRef = useRef(phase);
  const stepRef = useRef(step);

  phaseRef.current = phase;
  stepRef.current = step;

  const finish = useCallback(() => {
    if (finishOnceRef.current) return;
    finishOnceRef.current = true;
    clearTimerRef(seqTimerRef);
    document.documentElement.style.overflow = "";
    onComplete();
    requestAnimationFrame(() => {
      document
        .getElementById("hero")
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  }, [onComplete, reduced]);

  const bumpFromScroll = useCallback(() => {
    clearTimerRef(seqTimerRef);
    const p = phaseRef.current;
    const s = stepRef.current;
    if (p === 0) {
      if (s < 3) setStep(s + 1);
      else {
        setPhase(1);
        setStep(0);
      }
    } else if (p === 1) {
      if (s < 10) setStep(s + 1);
      else {
        setPhase(2);
        setStep(0);
      }
    } else if (p === 2) {
      if (s < 6) setStep(s + 1);
      else finish();
    }
  }, [finish]);

  useEffect(() => {
    if (reduced) {
      finishOnceRef.current = true;
      document.documentElement.style.overflow = "";
      onComplete();
      requestAnimationFrame(() => {
        document.getElementById("hero")?.scrollIntoView({ behavior: "auto" });
      });
      return;
    }

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev || "";
    };
  }, [reduced, onComplete]);

  useEffect(() => {
    if (reduced) return;

    const onWheel = (e: WheelEvent) => {
      if (finishOnceRef.current) return;
      if (Math.abs(e.deltaY) < 2) return;
      e.preventDefault();
      if (e.deltaY > 0) bumpFromScroll();
    };

    const onKey = (e: KeyboardEvent) => {
      if (finishOnceRef.current) return;
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        bumpFromScroll();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduced, bumpFromScroll]);

  useEffect(() => {
    if (reduced || finishOnceRef.current) return;
    const p = phase;
    const s = step;
    const ms = autoDelayMs(p, s);
    seqTimerRef.current = globalThis.setTimeout(() => {
      if (p === 0 && s === 3) {
        setPhase(1);
        setStep(0);
        return;
      }
      if (p === 1 && s === 10) {
        setPhase(2);
        setStep(0);
        return;
      }
      if (p === 2 && s === 6) {
        finish();
        return;
      }
      setStep((x) => x + 1);
    }, ms);

    return () => clearTimerRef(seqTimerRef);
  }, [phase, step, reduced, finish]);

  useLayoutEffect(() => {
    if (phase !== 1 || reduced) return;
    const story = storyRootRef.current;
    if (!story) return;
    if (step < 4) return;

    const lineEls = story.querySelectorAll(".ac-intro-svgl");
    const maxIdx = Math.min(2, step - 4);
    const drawS = 2.45;

    for (let i = 0; i <= maxIdx; i++) {
      const line = lineEls[i] as SVGLineElement | undefined;
      if (!line || line.classList.contains("ac-svgl--drawn")) continue;
      const len = 300;
      line.setAttribute("stroke-dasharray", String(len));
      line.setAttribute("stroke-dashoffset", String(len));
      line.style.transition = `stroke-dashoffset ${drawS}s cubic-bezier(0.4, 0, 0.2, 1)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          line.setAttribute("stroke-dashoffset", "0");
          line.classList.add("ac-svgl--drawn");
        });
      });
    }
  }, [phase, step, reduced]);

  if (reduced) return null;

  const panel = (p: Phase, children: React.ReactNode) => (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-[650ms] ease-out ${
        phase === p
          ? "z-10 opacity-100"
          : "pointer-events-none z-0 opacity-0"
      }`}
      aria-hidden={phase !== p}
    >
      {children}
    </div>
  );

  const showOpenLine1 = phase === 0 && step >= 1;
  const showOpenLine2 = phase === 0 && step >= 2;
  const showOpenNub = phase === 0 && step >= 3;

  const p1Pulse = phase === 1 && step >= 1;
  const p1Label = phase === 1 && step >= 2;
  const p1Svg = phase === 1 && step >= 3;
  const p1Center = phase === 1 && step >= 7;
  const p1Leaves = phase === 1 && step >= 8;
  const p1Texts = phase === 1 && step >= 9;
  const p1Footer = phase === 1 && step >= 10;

  const p2Arc1 = phase === 2 && step >= 1;
  const p2Arc2 = phase === 2 && step >= 2;
  const p2Arc3 = phase === 2 && step >= 3;
  const p2Cap1 = phase === 2 && step >= 4;
  const p2Cap2 = phase === 2 && step >= 5;

  return (
    <div
      ref={wrapRef}
      className="ac-intro fixed inset-0 z-[250] flex items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Introduction"
      onClick={() => bumpFromScroll()}
    >
      <div className="relative h-full min-h-[100dvh] w-full max-w-[900px] px-6">
        {panel(
          0,
          <>
            <div className="text-center">
              <p
                className={`ac-intro-line ${showOpenLine1 ? "ac-intro-line--show" : ""}`}
              >
                Built to ensure great minds can build
                <br />
                without being lost.
              </p>
              <p
                className={`ac-intro-line ac-intro-line2 ${showOpenLine2 ? "ac-intro-line--show" : ""}`}
              >
                This is Ashvi.
              </p>
            </div>
            <div
              className={`ac-scroll-nub pointer-events-none ${showOpenNub ? "ac-intro-nub--show" : "ac-intro-nub"}`}
            >
              <div className="ac-snub-line" />
              <span className="ac-snub-txt">Scroll for next beat</span>
            </div>
          </>,
        )}

        {panel(
          1,
          <div ref={storyRootRef} className="ac-story-in">
            <div
              className={`ac-pulse-stack ac-intro-fade ${p1Pulse ? "ac-intro-fade--show" : ""}`}
            >
              <span className="ac-pring" aria-hidden />
              <span className="ac-pring ac-pring--2" aria-hidden />
              <span className="ac-pring ac-pring--3" aria-hidden />
              <span className="ac-pdot" aria-hidden />
            </div>
            <p
              className={`ac-st-label mt-2 transition-opacity duration-[1.4s] ${p1Label ? "opacity-100" : "opacity-0"}`}
            >
              Every system begins with a signal.
            </p>
            <div
              className={`ac-node-svg mt-4 ${p1Svg ? "ac-intro-svg-gate--show" : "ac-intro-svg-gate"}`}
            >
              <svg
                viewBox="0 0 480 260"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <filter id={fglow}>
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1="240"
                  y1="40"
                  x2="60"
                  y2="210"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth="0.7"
                  className="ac-intro-svgl ac-svgl"
                />
                <line
                  x1="240"
                  y1="40"
                  x2="240"
                  y2="210"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth="0.7"
                  className="ac-intro-svgl ac-svgl"
                />
                <line
                  x1="240"
                  y1="40"
                  x2="420"
                  y2="210"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth="0.7"
                  className="ac-intro-svgl ac-svgl"
                />
                <circle
                  cx="240"
                  cy="40"
                  r="5"
                  fill="#00D4FF"
                  filter={`url(#${fglow})`}
                  className={`ac-intro-svgn ${p1Center ? "opacity-100" : "opacity-0"}`}
                />
                <circle
                  cx="60"
                  cy="210"
                  r="4"
                  fill="rgba(0,212,255,0.6)"
                  filter={`url(#${fglow})`}
                  className={`ac-intro-svgn ${p1Leaves ? "opacity-100" : "opacity-0"}`}
                />
                <circle
                  cx="240"
                  cy="210"
                  r="4"
                  fill="rgba(0,212,255,0.6)"
                  filter={`url(#${fglow})`}
                  className={`ac-intro-svgn ${p1Leaves ? "opacity-100" : "opacity-0"}`}
                />
                <circle
                  cx="420"
                  cy="210"
                  r="4"
                  fill="rgba(0,212,255,0.6)"
                  filter={`url(#${fglow})`}
                  className={`ac-intro-svgn ${p1Leaves ? "opacity-100" : "opacity-0"}`}
                />
                <text
                  x="50"
                  y="238"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.4)"
                  letterSpacing="0.07em"
                  textAnchor="middle"
                  className={`ac-intro-svgt ${p1Texts ? "opacity-100" : "opacity-0"}`}
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                  }}
                >
                  Research
                </text>
                <text
                  x="240"
                  y="238"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.4)"
                  letterSpacing="0.07em"
                  textAnchor="middle"
                  className={`ac-intro-svgt ${p1Texts ? "opacity-100" : "opacity-0"}`}
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                  }}
                >
                  Venture
                </text>
                <text
                  x="432"
                  y="238"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.4)"
                  letterSpacing="0.07em"
                  textAnchor="middle"
                  className={`ac-intro-svgt ${p1Texts ? "opacity-100" : "opacity-0"}`}
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                  }}
                >
                  Capital
                </text>
              </svg>
            </div>
            <p
              className={`ac-st-label transition-opacity duration-[1.35s] ${p1Footer ? "opacity-100" : "opacity-0"}`}
            >
              Three layers. One unified system.
            </p>
          </div>,
        )}

        {panel(
          2,
          <div className="ac-loop-in">
            <div className="ac-loop-svg-w">
              <svg
                viewBox="0 0 480 480"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <filter id={fg2}>
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <marker
                    id={mk}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M2 2L8 5L2 8"
                      fill="none"
                      stroke="rgba(0,212,255,0.4)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </marker>
                </defs>
                <circle
                  cx="240"
                  cy="240"
                  r="170"
                  fill="none"
                  stroke="rgba(255,255,255,0.035)"
                  strokeWidth="0.7"
                />
                <circle
                  cx="240"
                  cy="240"
                  r="108"
                  fill="none"
                  stroke="rgba(0,212,255,0.04)"
                  strokeWidth="0.7"
                />
                <path
                  d="M240 70 A170 170 0 0 1 387 355"
                  fill="none"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="0.8"
                  markerEnd={`url(#${mk})`}
                  className={`ac-intro-larc ac-larc ${p2Arc1 ? "ac-larc--flow" : ""}`}
                />
                <path
                  d="M387 355 A170 170 0 0 1 93 355"
                  fill="none"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="0.8"
                  markerEnd={`url(#${mk})`}
                  className={`ac-intro-larc ac-larc ${p2Arc2 ? "ac-larc--flow" : ""}`}
                />
                <path
                  d="M93 355 A170 170 0 0 1 240 70"
                  fill="none"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="0.8"
                  markerEnd={`url(#${mk})`}
                  className={`ac-intro-larc ac-larc ${p2Arc3 ? "ac-larc--flow" : ""}`}
                />
                <circle
                  cx="240"
                  cy="240"
                  r="30"
                  fill="rgba(0,212,255,0.04)"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="0.7"
                />
                <text
                  x="240"
                  y="244"
                  fontSize="8"
                  fontWeight="300"
                  fill="rgba(0,212,255,0.55)"
                  letterSpacing="0.18em"
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                  }}
                >
                  ASHVI
                </text>
                <circle cx="240" cy="70" r="7" fill="#00D4FF" filter={`url(#${fg2})`} />
                <circle
                  cx="240"
                  cy="70"
                  r="18"
                  fill="rgba(0,212,255,0.05)"
                  stroke="rgba(0,212,255,0.14)"
                  strokeWidth="0.6"
                />
                <text
                  x="240"
                  y="44"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.5)"
                  letterSpacing="0.07em"
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                  }}
                >
                  Research
                </text>
                <circle
                  cx="387"
                  cy="355"
                  r="7"
                  fill="rgba(0,212,255,0.7)"
                  filter={`url(#${fg2})`}
                />
                <circle
                  cx="387"
                  cy="355"
                  r="18"
                  fill="rgba(0,212,255,0.04)"
                  stroke="rgba(0,212,255,0.12)"
                  strokeWidth="0.6"
                />
                <text
                  x="424"
                  y="359"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.5)"
                  letterSpacing="0.07em"
                  textAnchor="start"
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                  }}
                >
                  Venture
                </text>
                <circle
                  cx="93"
                  cy="355"
                  r="7"
                  fill="rgba(0,212,255,0.7)"
                  filter={`url(#${fg2})`}
                />
                <circle
                  cx="93"
                  cy="355"
                  r="18"
                  fill="rgba(0,212,255,0.04)"
                  stroke="rgba(0,212,255,0.12)"
                  strokeWidth="0.6"
                />
                <text
                  x="55"
                  y="359"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.5)"
                  letterSpacing="0.07em"
                  textAnchor="end"
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                  }}
                >
                  Capital
                </text>
              </svg>
            </div>
            <div className="flex flex-col items-center gap-4 px-4">
              <p
                className={`ac-loop-caption transition-opacity duration-[1.45s] ${p2Cap1 ? "opacity-100" : "opacity-0"}`}
              >
                Intelligence alone is not enough.
                <br />
                It needs <em>systems, support, and belief.</em>
              </p>
              <p
                className={`ac-loop-sub transition-opacity duration-[1.35s] ${p2Cap2 ? "opacity-100" : "opacity-0"}`}
              >
                Ashvi exists to provide that system.
              </p>
            </div>
          </div>,
        )}
      </div>
    </div>
  );
}
