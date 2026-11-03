import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BrandButton } from "@/components/ui/BrandButton";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Ashvi Research — independent exploration into intelligent systems, AI architecture, alignment, and decision-making.",
  alternates: { canonical: "https://ashvi.tech/research" },
};

const themes = [
  {
    title: "Intelligent systems",
    body: "Architectures that combine perception, reasoning, and reliable action in real operational settings.",
  },
  {
    title: "Alignment and evaluation",
    body: "Methods for understanding whether systems behave as intended—and how to measure quality under uncertainty.",
  },
  {
    title: "Learning and decision-making",
    body: "Models and workflows that support judgement, planning, and continuous improvement over time.",
  },
  {
    title: "Embedded intelligence",
    body: "Lightweight action models and systems designed to live inside products and business processes.",
  },
];

export default function ResearchPage() {
  return (
    <div className="bg-ashvi-cloud">
      <section className="relative overflow-hidden border-b border-line bg-ashvi-deep pt-28 text-[color:var(--dark-text)] md:pt-36">
        <div className="absolute inset-0 ashvi-grid-dark opacity-40" aria-hidden />
        <div className="shell relative pb-16 md:pb-24">
          <AnimatedReveal className="max-w-3xl">
            <p className="label text-ashvi-teal">Ashvi Research</p>
            <h1 className="mt-5 text-display text-balance">
              Independent exploration.
            </h1>
            <p className="mt-6 text-lede text-[color:var(--dark-text-secondary)]">
              Alongside our commercial work, we conduct exploratory research into
              intelligent systems, AI architecture, alignment, and
              decision-making. This work is independent of immediate client or
              product requirements.
            </p>
          </AnimatedReveal>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <AnimatedReveal className="max-w-2xl">
          <h2 className="text-title">What we explore</h2>
          <p className="mt-5 text-lede text-ink-secondary">
            Our research is driven by curiosity, experimentation, and the
            possibility of creating new technical capabilities. Findings will be
            shared here as they become ready for public discussion.
          </p>
        </AnimatedReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {themes.map((theme, i) => (
            <AnimatedReveal
              key={theme.title}
              delay={i * 0.05}
              className="rounded-2xl border border-line bg-ashvi-white p-7"
            >
              <p className="label text-ashvi-blue">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-ashvi-ink">
                {theme.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
                {theme.body}
              </p>
            </AnimatedReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-ashvi-white py-16 md:py-20">
        <div className="shell">
          <AnimatedReveal>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Publications
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-secondary">
              No public research articles are published yet. This space is
              structured for future experiment reports, notes, and publications
              without restructuring the site.
            </p>
            <div className="mt-8 rounded-2xl border border-dashed border-line bg-ashvi-cloud/70 px-6 py-10 text-center">
              <p className="text-[15px] text-ink-muted">
                Future entries will appear here.
              </p>
            </div>
          </AnimatedReveal>

          <div className="mt-12 flex flex-wrap gap-3">
            <BrandButton href="/contact">Discuss Research Interests</BrandButton>
            <Link
              href="/"
              className="inline-flex items-center px-2 text-[15px] font-medium text-ink-secondary underline decoration-line underline-offset-4 hover:text-ashvi-ink"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
