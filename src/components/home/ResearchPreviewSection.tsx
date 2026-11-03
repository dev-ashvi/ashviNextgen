import { BrandButton } from "@/components/ui/BrandButton";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

const themes = [
  "Artificial intelligence and intelligent systems",
  "Alignment and evaluation",
  "Learning and decision-making architectures",
  "Lightweight action models and embedded intelligence",
];

export function ResearchPreviewSection() {
  return (
    <SectionContainer tone="deep" className="ashvi-grid-dark py-20 md:py-28">
      <div className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
        <AnimatedReveal>
          <p className="label text-ashvi-teal">Independent Exploration</p>
          <h2 className="mt-5 text-title">Ashvi Research</h2>
          <div className="mt-6 space-y-4 text-lede text-[color:var(--dark-text-secondary)]">
            <p>
              Alongside our commercial work, we conduct exploratory research into
              intelligent systems, AI architecture, alignment, and
              decision-making.
            </p>
            <p>
              This work is independent of immediate client or product
              requirements.
            </p>
            <p>
              Our research is driven by curiosity, experimentation, and the
              possibility of creating new technical capabilities.
            </p>
            <p>It remains an ongoing internal activity under Ashvi Tech.</p>
          </div>
          <div className="mt-8">
            <BrandButton href="/research" variant="dark">
              Explore Research
            </BrandButton>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <ul className="space-y-3">
            {themes.map((theme, i) => (
              <li
                key={theme}
                className="flex items-start gap-4 border-t border-white/10 py-4 first:border-t-0 first:pt-0"
              >
                <span className="label mt-1 text-ashvi-teal/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[16px] leading-snug text-[color:var(--dark-text)]">
                  {theme}
                </span>
              </li>
            ))}
          </ul>
        </AnimatedReveal>
      </div>
    </SectionContainer>
  );
}
