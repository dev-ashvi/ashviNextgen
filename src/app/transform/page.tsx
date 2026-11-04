import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BrandButton } from "@/components/ui/BrandButton";
import { TransformFlowVisual } from "@/components/visuals/TransformFlowVisual";

export const metadata: Metadata = {
  title: "Transform",
  description:
    "How AshviTech approaches redesigning existing businesses around intelligent technology—workflows, human expertise, and AI systems.",
  alternates: { canonical: "https://ashvi.tech/transform" },
};

const examine = [
  "Existing workflows and processes",
  "Repetitive operational activities",
  "Knowledge-intensive decisions",
  "Opportunities for AI-assisted delivery",
  "Human oversight and accountability",
];

const involve = [
  {
    title: "Workflow redesign",
    body: "Rethinking how work moves through the organisation when intelligence can assist.",
  },
  {
    title: "Intelligent systems",
    body: "Capabilities that extend expertise—analysis, drafting, routing, and decision support.",
  },
  {
    title: "Human–AI collaboration",
    body: "Clear roles for judgement, oversight, and where automation ends.",
  },
  {
    title: "Integration",
    body: "Connecting new capabilities with the technology and processes you already run.",
  },
  {
    title: "Operational improvement",
    body: "Measurable changes in how services are delivered—without discarding what already works.",
  },
];

const approach = [
  {
    step: "01",
    title: "Understand",
    body: "Map how the business actually works today—people, processes, and constraints.",
  },
  {
    step: "02",
    title: "Identify",
    body: "Surface where intelligent systems can meaningfully change outcomes.",
  },
  {
    step: "03",
    title: "Prototype",
    body: "Prove value in a focused slice before committing to wider change.",
  },
  {
    step: "04",
    title: "Integrate",
    body: "Embed working capabilities into existing operations with clear ownership.",
  },
  {
    step: "05",
    title: "Improve",
    body: "Iterate as teams learn what the new operating model makes possible.",
  },
];

export default function TransformPage() {
  return (
    <div className="bg-ashvi-cloud">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line pt-28 md:pt-36">
        <div className="absolute inset-0 ashvi-grid opacity-60" aria-hidden />
        <div className="shell relative grid items-center gap-10 pb-14 md:pb-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <AnimatedReveal className="max-w-2xl">
            <p className="label text-ashvi-blue">Transform</p>
            <h1 className="mt-5 font-serif text-[clamp(2.1rem,1.2rem+3.2vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink-900">
              Reimagine how your business operates.
            </h1>
            <p className="mt-6 max-w-[36rem] text-lede text-ink-secondary">
              Build on the expertise, customers and processes you already
              have—and explore how intelligent systems can change what becomes
              possible.
            </p>
          </AnimatedReveal>
          <AnimatedReveal delay={0.08}>
            <TransformFlowVisual />
          </AnimatedReveal>
        </div>
      </section>

      {/* A. Why transform */}
      <section className="shell grid gap-10 py-16 md:gap-14 md:py-24 lg:grid-cols-[0.85fr_1.15fr]">
        <AnimatedReveal>
          <p className="label text-ashvi-blue">Why transform</p>
          <h2 className="mt-4 text-title">
            Start from what you already know.
          </h2>
        </AnimatedReveal>
        <AnimatedReveal
          delay={0.06}
          className="space-y-5 text-[17px] leading-relaxed text-ink-secondary"
        >
          <p>
            Established businesses possess valuable industry knowledge, customer
            relationships, and operational experience.
          </p>
          <p>
            AI can create opportunities to rethink how that expertise is
            translated into services and operational capabilities—without
            discarding the foundations that already work.
          </p>
          <p>
            Transformation, for us, begins with understanding the business—not
            selecting a tool.
          </p>
        </AnimatedReveal>
      </section>

      {/* B. What we examine */}
      <section className="border-y border-line bg-ashvi-white py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <AnimatedReveal>
            <p className="label text-ashvi-blue">What we examine</p>
            <h2 className="mt-4 text-title">Where intelligence can matter</h2>
            <p className="mt-5 text-lede text-ink-secondary">
              We look carefully at how work is done today before proposing how
              it might change.
            </p>
          </AnimatedReveal>
          <AnimatedReveal delay={0.06}>
            <ul className="space-y-4">
              {examine.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-line pb-4 text-[16px] leading-snug text-ink-secondary last:border-0 last:pb-0"
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
        </div>
      </section>

      {/* C. What transformation can involve */}
      <section className="shell py-16 md:py-24">
        <AnimatedReveal className="max-w-2xl">
          <p className="label text-ashvi-blue">Scope</p>
          <h2 className="mt-4 text-title">What transformation can involve</h2>
          <p className="mt-5 text-lede text-ink-secondary">
            These are possible areas of work—not claims of already delivered
            client outcomes.
          </p>
        </AnimatedReveal>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {involve.map((item, i) => (
            <AnimatedReveal key={item.title} delay={i * 0.04}>
              <p className="label text-mute">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-xl font-medium tracking-[-0.02em] text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-secondary">
                {item.body}
              </p>
            </AnimatedReveal>
          ))}
        </div>
      </section>

      {/* D. Approach */}
      <section className="border-t border-line bg-ashvi-white py-16 md:py-24">
        <div className="shell">
          <AnimatedReveal className="max-w-2xl">
            <p className="label text-ashvi-blue">How we approach transformation</p>
            <h2 className="mt-4 text-title">Understand → Improve</h2>
            <p className="mt-5 text-lede text-ink-secondary">
              A clear sequence for exploring change carefully—adapted to each
              organisation.
            </p>
          </AnimatedReveal>

          <ol className="mt-12 grid list-none gap-8 md:grid-cols-5 md:gap-5">
            {approach.map((item, i) => (
              <AnimatedReveal
                key={item.step}
                delay={i * 0.04}
                as="li"
                className="relative min-w-0"
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
        </div>
      </section>

      {/* E. CTA */}
      <section className="bg-ashvi-deep py-16 text-[color:var(--dark-text)] md:py-20">
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl font-medium tracking-[-0.025em] md:text-3xl">
              Explore what intelligence could change in your business.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[color:var(--dark-text-secondary)]">
              Tell us about your operations, customers, and the work you want to
              rethink. We will listen first.
            </p>
          </div>
          <BrandButton href="/contact" variant="teal">
            Discuss a transformation
          </BrandButton>
        </div>
      </section>

      <div className="shell py-8 text-[14px] text-mute">
        <Link href="/build" className="transition-colors hover:text-ashvi-blue">
          Also explore Build →
        </Link>
      </div>
    </div>
  );
}
