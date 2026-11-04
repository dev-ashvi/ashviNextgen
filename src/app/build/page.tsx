import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BrandButton } from "@/components/ui/BrandButton";
import { BuildLayersVisual } from "@/components/visuals/BuildLayersVisual";

export const metadata: Metadata = {
  title: "Build",
  description:
    "How AshviTech partners with founders and domain experts to create AI-native businesses—industry knowledge joined with AI engineering.",
  alternates: { canonical: "https://ashvi.tech/build" },
};

const partnerItems = [
  "Industry knowledge",
  "Customer and market understanding",
  "Operational expertise",
  "Business direction",
];

const ashviItems = [
  "Product architecture",
  "Software engineering",
  "AI-native system design",
  "Technical product development",
  "Iterative experimentation",
];

const process = [
  {
    step: "01",
    title: "Discover",
    body: "Understand the domain, opportunity, and constraints with the people who know the work.",
  },
  {
    step: "02",
    title: "Design",
    body: "Shape an operating model and product architecture where intelligence is foundational.",
  },
  {
    step: "03",
    title: "Build",
    body: "Engineer the systems, interfaces, and capabilities required to bring the venture to life.",
  },
  {
    step: "04",
    title: "Validate",
    body: "Test with real users and markets—learning what holds, and what must change.",
  },
  {
    step: "05",
    title: "Evolve",
    body: "Refine the product and organisation as the business finds its footing.",
  },
];

export default function BuildPage() {
  return (
    <div className="bg-ashvi-cloud">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-ashvi-deep pt-28 text-[color:var(--dark-text)] md:pt-36">
        <div className="absolute inset-0 ashvi-grid-dark opacity-35" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(0,205,184,0.14)_0%,transparent_65%)]"
        />
        <div className="shell relative grid items-end gap-12 pb-16 md:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <AnimatedReveal className="max-w-2xl">
            <p className="label text-ashvi-teal">Build</p>
            <h1 className="mt-5 font-serif text-[clamp(2.1rem,1.2rem+3.2vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.035em]">
              Build a business around intelligence.
            </h1>
            <p className="mt-6 max-w-[36rem] text-lede text-[color:var(--dark-text-secondary)]">
              Combine deep industry expertise with AI engineering to create
              businesses designed for a new operating model.
            </p>
          </AnimatedReveal>
          <AnimatedReveal delay={0.08} className="lg:pb-2">
            <BuildLayersVisual className="opacity-95" />
          </AnimatedReveal>
        </div>
      </section>

      {/* A. Opportunity */}
      <section className="shell grid gap-10 py-16 md:gap-14 md:py-24 lg:grid-cols-[0.85fr_1.15fr]">
        <AnimatedReveal>
          <p className="label text-ashvi-blue">The opportunity</p>
          <h2 className="mt-4 text-title">
            Domain knowledge can become a venture.
          </h2>
        </AnimatedReveal>
        <AnimatedReveal
          delay={0.06}
          className="space-y-5 text-[17px] leading-relaxed text-ink-secondary"
        >
          <p>
            For decades, building a technology-enabled business often meant
            assembling a large conventional technology organisation first.
          </p>
          <p>
            That barrier is changing. Domain experts—people who understand an
            industry&apos;s problems, customers, and judgement—can now
            participate in creating AI-native businesses without waiting for a
            full traditional engineering organisation to exist.
          </p>
          <p>
            AshviTech exists to make that collaboration practical: industry
            insight on one side, careful AI engineering on the other.
          </p>
        </AnimatedReveal>
      </section>

      {/* B + C contributions */}
      <section className="border-y border-line bg-ashvi-white py-16 md:py-24">
        <div className="shell">
          <AnimatedReveal className="max-w-2xl">
            <p className="label text-ashvi-blue">Collaboration</p>
            <h2 className="mt-4 text-title">What each side contributes</h2>
          </AnimatedReveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            <AnimatedReveal>
              <h3 className="font-serif text-2xl font-medium tracking-[-0.025em] text-ink-900">
                What partners contribute
              </h3>
              <ul className="mt-6 space-y-3.5">
                {partnerItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[16px] leading-snug text-ink-secondary"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-ashvi-blue"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedReveal>
            <AnimatedReveal delay={0.06}>
              <h3 className="font-serif text-2xl font-medium tracking-[-0.025em] text-ink-900">
                What AshviTech contributes
              </h3>
              <ul className="mt-6 space-y-3.5">
                {ashviItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[16px] leading-snug text-ink-secondary"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-ashvi-teal"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* D. How we work */}
      <section className="shell py-16 md:py-24">
        <AnimatedReveal className="max-w-2xl">
          <p className="label text-ashvi-blue">How we work together</p>
          <h2 className="mt-4 text-title">A working approach—not a rigid script</h2>
          <p className="mt-5 text-lede text-ink-secondary">
            Every collaboration is different. This sequence describes how we
            typically move from idea to a living product.
          </p>
        </AnimatedReveal>

        <ol className="mt-12 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {process.map((item, i) => (
            <AnimatedReveal
              key={item.step}
              delay={i * 0.04}
              as="li"
              className="min-w-0"
            >
              <p className="label text-ashvi-teal">{item.step}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-secondary">
                {item.body}
              </p>
            </AnimatedReveal>
          ))}
        </ol>
      </section>

      {/* E. Our work — WYZ */}
      <section className="border-t border-line bg-ashvi-white py-16 md:py-24">
        <div className="shell grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <AnimatedReveal>
            <p className="label text-ashvi-blue">Our work</p>
            <h2 className="mt-4 text-title">WYZ Finance</h2>
            <p className="mt-2 text-[16px] text-ashvi-blue">
              Current collaboration
            </p>
          </AnimatedReveal>
          <AnimatedReveal delay={0.06} className="space-y-5">
            <p className="text-[17px] leading-relaxed text-ink-secondary">
              WYZ Finance is developing AI-powered financial capabilities for
              growing businesses—bringing financial-domain expertise together
              with technology engineering. Ashvi contributes technical
              architecture, AI systems, and product development.
            </p>
            <p className="text-[17px] leading-relaxed text-ink-secondary">
              It is our first active example of how domain specialists and
              technology builders can create an AI-native business together.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <BrandButton href="/#our-work" variant="secondary">
                View on homepage
              </BrandButton>
              <BrandButton href="https://financewyz.ai" variant="primary" external>
                Visit financewyz.ai
              </BrandButton>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* F. CTA */}
      <section className="bg-ashvi-deep py-16 text-[color:var(--dark-text)] md:py-20">
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl font-medium tracking-[-0.025em] md:text-3xl">
              Have an idea grounded in industry expertise?
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[color:var(--dark-text-secondary)]">
              If you bring deep domain knowledge and want to explore an
              AI-native venture, we would like to hear from you.
            </p>
          </div>
          <BrandButton href="/contact" variant="teal">
            Discuss a venture
          </BrandButton>
        </div>
      </section>

      <div className="shell py-8 text-[14px] text-mute">
        <Link href="/transform" className="transition-colors hover:text-ashvi-blue">
          Also explore Transform →
        </Link>
      </div>
    </div>
  );
}
