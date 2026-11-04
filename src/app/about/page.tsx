import type { Metadata } from "next";
import { BrandButton } from "@/components/ui/BrandButton";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why AshviTech exists — bringing human expertise and intelligent technology together to build and transform AI-native businesses.",
  alternates: { canonical: "https://ashvi.tech/about" },
};

export default function AboutPage() {
  return (
    <div className="bg-ashvi-cloud">
      <section className="border-b border-line pt-28 md:pt-36">
        <div className="shell pb-16 md:pb-20">
          <AnimatedReveal className="max-w-3xl">
            <p className="label text-ashvi-blue">About AshviTech</p>
            <h1 className="mt-5 text-display text-balance">Why We Exist</h1>
            <p className="mt-6 text-lede text-ink-secondary">
              Ashvi Tech began with a simple belief: deep technical capability
              should not be limited to solving the immediate requirements of an
              individual product or company.
            </p>
          </AnimatedReveal>
        </div>
      </section>

      <section className="shell grid gap-16 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <AnimatedReveal>
          <h2 className="text-title">Technology that creates opportunity</h2>
        </AnimatedReveal>
        <AnimatedReveal delay={0.08} className="space-y-5 text-[17px] leading-relaxed text-ink-secondary">
          <p>
            Technology can also create new opportunities for people and
            businesses.
          </p>
          <p>
            We want to build an organisation that develops intelligent
            technology, applies engineering to meaningful business problems, and
            continues exploring what technology could become.
          </p>
          <p>
            We are starting small. Our current focus is building WYZ Finance and
            developing the experience required to create and transform AI-native
            businesses.
          </p>
          <p>
            Over time, we hope to build an organisation capable of working across
            industries, supporting ambitious domain experts, and pursuing
            original technical research.
          </p>
          <p>
            We intend to grow through demonstrated work rather than promises
            about scale.
          </p>
        </AnimatedReveal>
      </section>

      <section className="bg-ashvi-white py-16 md:py-24">
        <div className="shell grid gap-10 md:grid-cols-2">
          <AnimatedReveal className="rounded-2xl border border-line p-8">
            <p className="label text-ashvi-blue">01 — Build</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              Creating AI-native businesses
            </h3>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-secondary">
              We collaborate with domain experts and founders to turn industry
              knowledge into technology-driven businesses—starting with WYZ
              Finance.
            </p>
            <a
              href="/build"
              className="mt-5 inline-flex text-[14px] font-medium text-ashvi-blue transition-colors hover:text-ashvi-deep"
            >
              Explore Build →
            </a>
          </AnimatedReveal>
          <AnimatedReveal delay={0.08} className="rounded-2xl border border-line bg-ashvi-cloud p-8">
            <p className="label text-ashvi-blue">02 — Transform</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              Reimagining existing operations
            </h3>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-secondary">
              We help established organisations rethink workflows, operations,
              and services through intelligent technology—beginning with deep
              understanding of the business.
            </p>
            <a
              href="/transform"
              className="mt-5 inline-flex text-[14px] font-medium text-ashvi-blue transition-colors hover:text-ashvi-deep"
            >
              Explore Transform →
            </a>
          </AnimatedReveal>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <AnimatedReveal className="mx-auto max-w-3xl">
          <h2 className="text-title">The name Ashvi</h2>
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink-secondary">
            <p>
              The name Ashvi was derived from Shiva, using the same five letters
              in a different arrangement.
            </p>
            <p>
              The company draws inspiration from philosophical ideas of
              awareness, transformation, intelligent action, and creation.
            </p>
            <p>
              Those ideas inform how we think about building—quietly, carefully,
              and with ambition for what technology and human expertise can
              unlock together.
            </p>
          </div>
        </AnimatedReveal>
      </section>

      <section className="border-t border-line bg-ashvi-deep py-16 text-[color:var(--dark-text)] md:py-20">
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Independent research, long-term ambition
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[color:var(--dark-text-secondary)]">
              Alongside commercial work, Ashvi Research explores intelligent
              systems, alignment, and decision-making—independent of immediate
              product requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <BrandButton href="/research" variant="dark">
              Explore Research
            </BrandButton>
            <BrandButton href="/contact" variant="teal">
              Start a Conversation
            </BrandButton>
          </div>
        </div>
      </section>
    </div>
  );
}
