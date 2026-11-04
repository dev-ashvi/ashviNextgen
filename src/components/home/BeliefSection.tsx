import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { DualIntelligenceNetwork } from "./DualIntelligenceNetwork";

/** Perf A/B: NEXT_PUBLIC_DISABLE_DIN=1 skips mounting the network (module may still ship). */
const DIN_DISABLED = process.env.NEXT_PUBLIC_DISABLE_DIN === "1";

export function BeliefSection() {
  return (
    <SectionContainer tone="cloud" className="overflow-x-clip py-20 md:py-24 lg:py-28">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
        <AnimatedReveal className="relative min-w-0">
          <p className="label text-mute">
            <span
              className="mx-2.5 inline-block h-px w-6 align-middle bg-tide/70"
              aria-hidden="true"
            />
            What We Believe
          </p>

          <h2 className="mt-6 max-w-[18ch] font-serif text-[clamp(1.85rem,1.1rem+2.4vw,2.85rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink [font-variation-settings:'opsz'_48]">
            Technology is changing what a business can be.
          </h2>

          <div className="mt-7 max-w-[34rem] space-y-4 text-[16px] leading-[1.7] text-ink/70 md:mt-8 md:space-y-5 md:text-[17px]">
            <p>
              For decades, growing a business often meant growing its workforce,
              infrastructure, and operating costs.
            </p>
            <p className="text-ink/80">
              AI is beginning to change that relationship.
            </p>
            <p>
              A small team can potentially deliver capabilities that once
              required a much larger organisation. Domain expertise can be
              translated into intelligent systems. New services can become
              economically viable. Existing businesses can find new ways to
              operate.
            </p>
            <p className="text-ink/80">
              But technology alone does not understand the work.
            </p>
            <p>
              The people who know an industry—its problems, customers,
              processes, and judgement—are essential to building the next
              generation of businesses.
            </p>
          </div>
        </AnimatedReveal>

        {!DIN_DISABLED ? (
          <AnimatedReveal delay={0.08} className="relative min-w-0 lg:pt-1">
            {/* Shared width: diagram+legend module, then belief — ~18% smaller footprint */}
            <div className="mx-auto w-full max-w-[22.5rem] sm:max-w-[24.5rem] lg:mx-0 lg:max-w-[25.5rem]">
              <DualIntelligenceNetwork className="w-full" />

              <blockquote className="mt-6 border-l-[2.5px] border-ink-900 pl-5 sm:mt-7 sm:pl-6">
                <p className="font-serif text-[1.05rem] font-medium leading-[1.35] tracking-[-0.018em] text-ink sm:text-[1.15rem] md:text-[1.2rem]">
                  We believe the future belongs to those who can bring domain
                  expertise and intelligent technology together.
                </p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-mute sm:text-[15px]">
                  That is the opportunity Ashvi Tech exists to explore.
                </p>
              </blockquote>
            </div>
          </AnimatedReveal>
        ) : (
          <AnimatedReveal delay={0.08} className="relative min-w-0">
            <blockquote className="mx-auto max-w-[25.5rem] border-l-[2.5px] border-ink-900 pl-5 sm:pl-6 lg:mx-0">
              <p className="font-serif text-[1.05rem] font-medium leading-[1.35] tracking-[-0.018em] text-ink sm:text-[1.15rem] md:text-[1.2rem]">
                We believe the future belongs to those who can bring domain
                expertise and intelligent technology together.
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-mute sm:text-[15px]">
                That is the opportunity Ashvi Tech exists to explore.
              </p>
            </blockquote>
          </AnimatedReveal>
        )}
      </div>
    </SectionContainer>
  );
}
