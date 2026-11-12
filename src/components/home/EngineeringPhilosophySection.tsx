"use client";

import { useId, useState } from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { cn } from "@/lib/utils";

import { ENGINEERING_PRINCIPLES as PRINCIPLES } from "@/components/home/engineering-philosophy-data";

const CX = 200;
const CY = 200;
const R = 142;
const LABEL_R = 176;
const GAP = 7;
const SWEEP = (360 - PRINCIPLES.length * GAP) / PRINCIPLES.length;
const TRANSITION = "duration-[200ms] ease-calm motion-reduce:transition-none";

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(startDeg: number, endDeg: number) {
  const start = polar(CX, CY, R, startDeg);
  const end = polar(CX, CY, R, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function segmentAngles(index: number) {
  const start = index * (SWEEP + GAP);
  const end = start + SWEEP;
  const mid = start + SWEEP / 2;
  return { start, end, mid };
}

function EngineeringCircle({
  active,
  selected,
  onHover,
  onSelect,
  labelledBy,
}: {
  active: number;
  selected: number;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  labelledBy: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      role="group"
      aria-labelledby={labelledBy}
      className="mx-auto h-auto w-full max-w-[360px] touch-manipulation md:max-w-[350px] lg:mx-0 lg:ml-auto lg:max-w-[380px] xl:max-w-[410px]"
      onMouseLeave={() => onHover(null)}
    >
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#E4EAF2"
        strokeWidth="1"
      />

      {PRINCIPLES.map((principle, index) => {
        const { start, end, mid } = segmentAngles(index);
        const isActive = active === index;
        const isSelected = selected === index;
        const label = polar(CX, CY, LABEL_R, mid);
        return (
          <g key={principle.id}>
            <path
              d={arcPath(start, end)}
              fill="none"
              stroke="transparent"
              strokeWidth={30}
              strokeLinecap="round"
              className="cursor-pointer outline-none focus-visible:stroke-[#00CDB8]/45"
              role="button"
              tabIndex={0}
              aria-label={`${principle.id} ${principle.title}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(index)}
              onMouseEnter={() => onHover(index)}
              onFocus={() => onSelect(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(index);
                }
                if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                  e.preventDefault();
                  onSelect((index + 1) % PRINCIPLES.length);
                }
                if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  onSelect((index - 1 + PRINCIPLES.length) % PRINCIPLES.length);
                }
              }}
            />
            <path
              d={arcPath(start, end)}
              fill="none"
              stroke={isActive ? "#003876" : "#C9D4E4"}
              strokeWidth={isActive ? 15 : 10}
              strokeLinecap="round"
              className={cn(
                "pointer-events-none transition-[stroke,stroke-width]",
                TRANSITION,
              )}
            />
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isActive ? "#003876" : "#7A8DA5"}
              fontSize="11.5"
              fontWeight="500"
              letterSpacing="0.06em"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {principle.id}
            </text>
          </g>
        );
      })}

      <circle
        cx={CX}
        cy={CY}
        r={20}
        fill="none"
        stroke="#00CDB8"
        strokeOpacity="0.5"
        strokeWidth="1.35"
      />
      <circle cx={CX} cy={CY} r={5} fill="#021336" />

      <text
        x={CX}
        y={CY + 44}
        textAnchor="middle"
        fill="#021336"
        fontSize="13.5"
        fontWeight="700"
        letterSpacing="0.15em"
      >
        HUMAN × AI
      </text>
      <text
        x={CX}
        y={CY + 64}
        textAnchor="middle"
        fill="#6E7F96"
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="0.2em"
      >
        ENGINEERING
      </text>
    </svg>
  );
}

export function EngineeringPhilosophySection() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? selected;
  const activePrinciple = PRINCIPLES[active];
  const diagramTitleId = useId();
  const panelId = useId();

  const select = (index: number) => {
    setHovered(null);
    setSelected(index);
  };

  return (
    <SectionContainer tone="white" className="py-20 md:py-24 lg:py-28">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-8 xl:gap-10">
        {/* Left: eyebrow + headline + diagram */}
        <div className="min-w-0">
          <AnimatedReveal>
            <p className="label text-mute">
              <span
                className="mr-2.5 inline-block h-px w-6 align-middle bg-tide/70"
                aria-hidden="true"
              />
              Our Engineering Philosophy
            </p>

            <h2 className="mt-6 max-w-[16ch] font-serif text-[clamp(1.85rem,1.1rem+2.4vw,2.85rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink [font-variation-settings:'opsz'_48]">
              Build for how the business works.
            </h2>
          </AnimatedReveal>

          <AnimatedReveal delay={0.06} className="mt-7 md:mt-8 lg:mt-7">
            <p id={diagramTitleId} className="sr-only">
              Six interconnected engineering principles. Selecting a segment
              highlights the related principle. Centre label: Human times AI
              Engineering.
            </p>
            <EngineeringCircle
              active={active}
              selected={selected}
              onHover={setHovered}
              onSelect={select}
              labelledBy={diagramTitleId}
            />
            <p
              aria-live="polite"
              className="mx-auto mt-3 max-w-[360px] text-center text-[13px] font-medium leading-snug tracking-[-0.01em] text-ink-900/75 md:max-w-[350px] lg:mx-0 lg:ml-auto lg:max-w-[380px] lg:text-right xl:max-w-[410px]"
            >
              <span className="text-ashvi-teal">{activePrinciple.id}</span>
              <span className="mx-1.5 text-ink/25" aria-hidden="true">
                ·
              </span>
              <span>{activePrinciple.title}</span>
            </p>
          </AnimatedReveal>
        </div>

        {/* Right: intro copy + interactive principles */}
        <AnimatedReveal delay={0.08} className="min-w-0 lg:pt-1">
          <div className="max-w-[32rem] space-y-4 text-[16px] leading-[1.7] text-ink/70 md:text-[17px]">
            <p>
              Adding an AI interface to existing software does not make a
              business AI-native.
            </p>
            <p>
              The opportunity is in understanding the workflows themselves, and
              thoughtfully combining intelligent systems with the human expertise
              that makes them work.
            </p>
          </div>

          <div
            role="list"
            aria-label="Engineering principles"
            className="mt-8 divide-y divide-line/80 border-y border-line/80 md:mt-9"
            onMouseLeave={() => setHovered(null)}
          >
            {PRINCIPLES.map((principle, index) => {
              const open = active === index;
              const isSelected = selected === index;
              const headingId = `${panelId}-h-${principle.id}`;
              const bodyId = `${panelId}-b-${principle.id}`;

              return (
                <div key={principle.id} role="listitem">
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={open}
                    aria-controls={bodyId}
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() => select(index)}
                    onMouseEnter={() => setHovered(index)}
                    onFocus={() => select(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select(index);
                      }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        select((index + 1) % PRINCIPLES.length);
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        select(
                          (index - 1 + PRINCIPLES.length) % PRINCIPLES.length,
                        );
                      }
                      if (e.key === "Home") {
                        e.preventDefault();
                        select(0);
                      }
                      if (e.key === "End") {
                        e.preventDefault();
                        select(PRINCIPLES.length - 1);
                      }
                    }}
                    className={cn(
                      "group flex min-h-[3.25rem] w-full scroll-mt-[var(--site-header-scroll-margin)] items-start gap-4 py-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 md:py-[1.05rem]",
                      TRANSITION,
                      open ? "text-ink-900" : "text-[#5A6B86]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 text-[12px] font-medium tracking-[0.08em] transition-colors",
                        TRANSITION,
                        open ? "text-ashvi-teal" : "text-[#5E8FA3]",
                      )}
                    >
                      {principle.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[16.5px] font-semibold tracking-[-0.018em] transition-colors md:text-[17.5px]",
                          TRANSITION,
                          open ? "text-ink-900" : "text-[#4A5D78]",
                        )}
                      >
                        {principle.title}
                      </span>
                      <span
                        id={bodyId}
                        role="region"
                        aria-labelledby={headingId}
                        aria-hidden={!open}
                        className={cn(
                          "grid transition-[grid-template-rows]",
                          TRANSITION,
                          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="mt-2.5 block max-w-[36rem] text-[14.5px] font-normal leading-[1.65] text-ink-secondary md:text-[15px]">
                            {principle.body}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </AnimatedReveal>
      </div>
    </SectionContainer>
  );
}
