"use client";

import { useState } from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "01",
    title: "Understand the domain",
    body: "Start with real operational challenges, judgement, and the work itself—not a catalogue of tools.",
  },
  {
    id: "02",
    title: "Design for outcomes",
    body: "Shape systems around meaningful business results rather than layering AI onto existing interfaces.",
  },
  {
    id: "03",
    title: "Engineer reliable workflows",
    body: "Build AI-powered products and processes that can be trusted in day-to-day operation.",
  },
  {
    id: "04",
    title: "Evaluate with oversight",
    body: "Measure performance, quality, cost, and the places where human expertise must remain essential.",
  },
  {
    id: "05",
    title: "Improve continuously",
    body: "Refine how technology supports the business—and apply the same principles to how Ashvi itself operates.",
  },
];

export function EngineeringPhilosophySection() {
  const [active, setActive] = useState(0);

  return (
    <SectionContainer tone="white" className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Engineering Philosophy"
            title="Build for how the business works."
          />
          <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-secondary">
            <p>
              We don&apos;t believe putting an AI interface on existing software
              automatically makes a business AI-native.
            </p>
            <p>The real opportunity is to examine the work itself.</p>
            <p>What can intelligent systems reliably perform?</p>
            <p>Where does human expertise remain essential?</p>
            <p>How can both work together to create better outcomes?</p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <ol className="space-y-2">
            {steps.map((step, index) => {
              const open = active === index;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                    className={cn(
                      "group w-full rounded-xl border px-5 py-4 text-left transition-colors duration-300",
                      open
                        ? "border-ashvi-blue/30 bg-ashvi-cloud"
                        : "border-transparent hover:border-line hover:bg-ashvi-cloud/60",
                    )}
                    aria-expanded={open}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="label text-ashvi-teal">{step.id}</span>
                      <span className="text-[17px] font-semibold tracking-tight text-ashvi-ink">
                        {step.title}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-3 max-w-prose pl-10 text-[15px] leading-relaxed text-ink-secondary">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-[14px] text-ink-muted">
            Our approach combines understanding, design, engineering, evaluation,
            and continuous improvement.
          </p>
        </AnimatedReveal>
      </div>
    </SectionContainer>
  );
}
