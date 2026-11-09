import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

/**
 * Section 02 — The Opportunity
 * Editorial comparison of two operating models.
 */
export function AboutOpportunity() {
  return (
    <section
      aria-labelledby="about-opportunity-title"
      className="scroll-mt-24 bg-ashvi-white"
    >
      <div className="shell py-12 md:py-14 lg:py-16">
        <AnimatedReveal className="max-w-[40rem]">
          <p className="label flex items-center gap-2.5 text-ink-900/65">
            <span
              className="inline-block h-px w-6 bg-tide/70"
              aria-hidden="true"
            />
            The Opportunity
          </p>
          <h2
            id="about-opportunity-title"
            className="mt-5 max-w-[18ch] font-serif text-[clamp(1.85rem,1.05rem+2.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink-900 [font-variation-settings:'opsz'_48]"
          >
            A different relationship between technology and business.
          </h2>

          <div className="mt-5 space-y-4 text-[16px] leading-[1.7] text-ink/70 md:text-[17px]">
            <p>
              For much of the software era, technology teams have been organised
              around the needs of individual businesses. That model has produced
              extraordinary progress, but it can also leave little room for
              technical questions beyond immediate priorities.
            </p>
            <p>
              As intelligent systems change how software is built and used, we
              see an opportunity for a different model—one where deep engineering
              capability works across businesses, learns from real-world
              problems, and remains free to investigate ideas with longer
              horizons.
            </p>
          </div>
        </AnimatedReveal>

        <div className="mt-8 grid gap-7 lg:mt-9 lg:grid-cols-2 lg:gap-0">
          <AnimatedReveal
            delay={0.04}
            className="min-w-0 lg:pr-10 xl:pr-12"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-tide-deep">
              Technology serving a business
            </p>
            <h3 className="mt-3 font-serif text-[clamp(1.2rem,1rem+0.6vw,1.4rem)] font-medium leading-[1.25] tracking-[-0.015em] text-ink-900">
              Built around immediate needs.
            </h3>
            <p className="mt-2.5 max-w-[28rem] text-[15.5px] leading-[1.65] text-ink-secondary md:text-[16px]">
              Engineering priorities are shaped primarily by the immediate needs
              of an organisation.
            </p>
          </AnimatedReveal>

          <AnimatedReveal
            delay={0.08}
            className="min-w-0 border-t border-paper-line pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-12"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-tide-deep">
              Capability extending beyond a project
            </p>
            <h3 className="mt-3 font-serif text-[clamp(1.2rem,1rem+0.6vw,1.4rem)] font-medium leading-[1.25] tracking-[-0.015em] text-ink-900">
              Knowledge that extends further.
            </h3>
            <p className="mt-2.5 max-w-[28rem] text-[15.5px] leading-[1.65] text-ink-secondary md:text-[16px]">
              Technical knowledge and learning can contribute to future
              businesses and independent exploration.
            </p>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
