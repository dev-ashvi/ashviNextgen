import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

/**
 * Section 05 — Beyond Today's Businesses
 * Left: intro copy. Right: sculpture exhibit + Long-Term Vision caption.
 */
export function FutureVisionSection() {
  return (
    <SectionContainer
      id="future-vision"
      tone="cloud"
      className="py-16 md:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[52%] bg-[radial-gradient(ellipse_at_72%_50%,rgba(232,240,248,0.35)_0%,transparent_72%)]"
      />

      <div className="relative grid items-start gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-8 xl:gap-10">
        {/* Left — section introduction only */}
        <AnimatedReveal className="relative z-10 min-w-0 lg:max-w-[30rem]">
          <p className="label text-ashvi-blue">
            <span className="text-ink/35">05</span>
            <span
              className="mx-2.5 inline-block h-px w-6 align-middle bg-tide/60"
              aria-hidden="true"
            />
            Beyond Today&apos;s Businesses
          </p>

          <h2 className="mt-6 max-w-[15ch] font-serif text-[clamp(1.85rem,1.05rem+2.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink-900 [font-variation-settings:'opsz'_48]">
            Making entrepreneurship more accessible.
          </h2>

          <div className="mt-6 max-w-[34rem] space-y-4 text-[16px] leading-[1.7] text-ink/70 md:mt-7 md:space-y-5 md:text-[17px]">
            <p>
              As intelligent technology becomes more capable, the skills
              required to build a successful business may change. Someone with
              deep expertise in finance, support, recruitment, or logistics may
              increasingly be able to operate a business with a much smaller
              team.
            </p>
            <p>
              Our long-term ambition is to help more professionals move from
              offering their expertise as labour to building businesses they
              own.
            </p>
          </div>
        </AnimatedReveal>

        {/* Right — one exhibit: sculpture + caption on the same visual axis */}
        <AnimatedReveal
          delay={0.06}
          className="relative z-0 min-w-0 w-full lg:pt-20 xl:pt-24"
        >
          <figure className="relative w-full">
            <Image
              src="/sculptures/emerging-enterprise-stage.png"
              alt="Emerging Enterprise sculpture: a Domain Expertise sphere connected by flowing intelligence arcs to a translucent glass enterprise building"
              width={691}
              height={366}
              className="h-auto w-full select-none"
              sizes="(max-width: 1024px) 100vw, 58vw"
              quality={93}
              priority={false}
            />

            {/*
              Caption sits on the sculpture's content axis (~sphere left edge)
              and close under the soft reflection (tight stage asset + ~20px gap).
            */}
            <figcaption className="relative z-10 mx-auto -mt-8 max-w-[min(28rem,96%)] text-center sm:-mt-9 md:max-w-[30rem] lg:-mt-10">
              <p className="inline-flex items-center justify-center gap-2.5 text-[11.5px] font-medium tracking-[0.16em] text-ashvi-teal">
                <span
                  aria-hidden
                  className="inline-block h-px w-6 shrink-0 bg-ashvi-teal/70"
                />
                LONG-TERM VISION
              </p>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-secondary md:text-[15px]">
                A future direction we will earn through demonstrated work — not
                an existing platform.
              </p>
            </figcaption>
          </figure>
        </AnimatedReveal>
      </div>
    </SectionContainer>
  );
}
