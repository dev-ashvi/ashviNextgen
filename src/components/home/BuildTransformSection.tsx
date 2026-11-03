import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function BuildTransformSection() {
  return (
    <SectionContainer id="what-we-do" tone="white" className="py-20 md:py-28">
      <SectionHeading
        eyebrow="What We Do"
        title="Two paths. One engineering philosophy."
        description="There are two distinct directions."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-line lg:grid-cols-2">
        <AnimatedReveal className="bg-ashvi-white p-8 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="label text-ashvi-blue">01 — Build</p>
            <StatusLabel tone="active">Active — WYZ Finance</StatusLabel>
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ashvi-ink md:text-[1.75rem]">
            Creating AI-native businesses
          </h3>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink-secondary">
            <p>
              We collaborate with domain experts and founders to turn industry
              knowledge into technology-driven businesses.
            </p>
            <p>
              Our partners bring deep understanding of their markets and
              customers.
            </p>
            <p>
              We contribute AI architecture, software engineering, intelligent
              systems, and technical product development.
            </p>
            <p>
              Together, we explore how businesses can be designed with AI as a
              fundamental capability rather than an additional feature.
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1} className="bg-ashvi-cloud p-8 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="label text-ashvi-blue">02 — Transform</p>
            <StatusLabel tone="future">Future focus — Select partnerships</StatusLabel>
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ashvi-ink md:text-[1.75rem]">
            Reimagining existing businesses with AI
          </h3>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink-secondary">
            <p>
              Existing businesses already have something valuable: customers,
              experience, processes, and domain knowledge.
            </p>
            <p>
              We want to help them use AI to change how work gets delivered.
            </p>
            <p>
              That might mean automating repetitive operations, developing
              intelligent internal systems, supporting human decision-making, or
              redesigning entire workflows.
            </p>
            <p>
              We believe successful AI adoption begins with understanding the
              business—not selecting an AI tool.
            </p>
          </div>
        </AnimatedReveal>
      </div>
    </SectionContainer>
  );
}
