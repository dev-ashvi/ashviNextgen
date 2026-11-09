import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

const themes = [
  {
    title: "Businesses",
    copy: "Practical value and durable partnerships.",
  },
  {
    title: "Research",
    copy: "Independent inquiry and experimentation.",
  },
  {
    title: "People",
    copy: "More paths from expertise to ownership.",
  },
] as const;

/**
 * Section 04 — The Long View
 * Aspirational three-theme editorial structure.
 */
export function AboutLongView() {
  return (
    <section
      aria-labelledby="about-long-view-title"
      className="scroll-mt-24 border-t border-paper-line bg-paper"
    >
      <div className="shell py-14 md:py-16 lg:py-20">
        <AnimatedReveal className="max-w-[40rem]">
          <p className="label flex items-center gap-2.5 text-ink-900/65">
            <span
              className="inline-block h-px w-6 bg-tide/70"
              aria-hidden="true"
            />
            The Long View
          </p>
          <h2
            id="about-long-view-title"
            className="mt-5 max-w-[18ch] font-serif text-[clamp(1.85rem,1.05rem+2.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink-900 [font-variation-settings:'opsz'_48]"
          >
            Building something that can outlast individual projects.
          </h2>
          <p className="mt-5 max-w-[38rem] text-[16px] leading-[1.7] text-ink/70 md:text-[17px]">
            Our ambition is to build enduring technical capability through
            meaningful businesses, independent research, and new opportunities
            for people to turn expertise into ownership.
          </p>
        </AnimatedReveal>

        <div className="mt-9 grid gap-0 md:mt-10 lg:mt-11 lg:grid-cols-3">
          {themes.map((theme, i) => (
            <AnimatedReveal
              key={theme.title}
              delay={0.05 + i * 0.04}
              className="relative py-5 first:pt-0 lg:px-8 lg:py-1 lg:first:pt-1 first:lg:pl-0 last:lg:pr-0"
            >
              {i > 0 ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-0 hidden h-full w-px bg-paper-line lg:block"
                />
              ) : null}
              {i > 0 ? (
                <span
                  aria-hidden
                  className="mb-5 block h-px w-full bg-paper-line lg:hidden"
                />
              ) : null}
              <span
                aria-hidden
                className="mb-4 block h-1 w-1 rounded-full bg-tide"
              />
              <h3 className="font-serif text-[1.35rem] font-medium tracking-[-0.015em] text-ink-900 md:text-[1.45rem]">
                {theme.title}
              </h3>
              <p className="mt-2.5 max-w-[22rem] text-[15.5px] leading-[1.6] text-ink-secondary">
                {theme.copy}
              </p>
            </AnimatedReveal>
          ))}
        </div>

        <AnimatedReveal
          delay={0.14}
          className="mt-6 border-t border-paper-line pt-7 md:mt-9 lg:mt-10 lg:pt-8"
        >
          <span aria-hidden className="mx-auto mb-4 block h-px w-10 bg-tide" />
          <p className="mx-auto max-w-[36rem] text-center text-balance font-serif text-[clamp(1.1rem,0.95rem+0.6vw,1.3rem)] font-medium leading-[1.45] tracking-[-0.012em] text-ink-900">
            This is the institution we are working toward, built progressively
            through real collaborations and sustained exploration.
          </p>
        </AnimatedReveal>
      </div>
    </section>
  );
}
