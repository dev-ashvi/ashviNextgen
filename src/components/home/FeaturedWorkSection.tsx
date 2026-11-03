import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { BrandButton } from "@/components/ui/BrandButton";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function FeaturedWorkSection() {
  return (
    <SectionContainer id="our-work" tone="cloud" className="py-20 md:py-28">
      <SectionHeading eyebrow="Active Collaboration" title="What We're Building" />

      <AnimatedReveal className="mt-12 overflow-hidden rounded-[1.5rem] bg-ashvi-deep text-[color:var(--dark-text)] ring-1 ring-white/10 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[240px] overflow-hidden lg:min-h-full">
          <div className="absolute inset-0 ashvi-grid-dark opacity-50" />
          <Image
            src="/companies/wyz-preview.png"
            alt="WYZ Finance product preview"
            fill
            className="object-cover object-top opacity-90"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ashvi-deep via-ashvi-deep/40 to-transparent lg:bg-gradient-to-r" />
        </div>

        <div className="relative p-8 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <StatusLabel tone="active" className="bg-ashvi-teal/20 text-ashvi-teal ring-ashvi-teal/30">
              Active collaboration
            </StatusLabel>
          </div>
          <h3 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
            WYZ Finance
          </h3>
          <p className="mt-2 text-[17px] text-ashvi-teal">
            AI-native financial intelligence and CFO services
          </p>
          <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[color:var(--dark-text-secondary)]">
            <p>
              WYZ Finance is developing AI-powered financial capabilities for
              growing businesses, bringing together financial-domain expertise
              and technology engineering.
            </p>
            <p>
              The work includes financial analysis, revenue and margin
              intelligence, scenario planning, and AI-assisted decision support.
            </p>
            <p>
              Ashvi contributes technical architecture, AI engineering, and
              product development to this collaboration.
            </p>
            <p>
              WYZ is our first active example of how domain specialists and
              technology builders can work together to create an AI-native
              business.
            </p>
          </div>
          <div className="mt-8">
            <BrandButton href="https://financewyz.ai" variant="dark" external>
              Explore WYZ Finance
              <ArrowUpRight className="h-4 w-4" />
            </BrandButton>
          </div>
        </div>
      </AnimatedReveal>
    </SectionContainer>
  );
}
