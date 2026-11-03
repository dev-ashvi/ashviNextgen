import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function FutureVisionSection() {
  return (
    <SectionContainer tone="cloud" className="py-20 md:py-28">
      <AnimatedReveal className="mx-auto max-w-3xl text-center">
        <p className="label text-ashvi-blue">Beyond Today&apos;s Businesses</p>
        <h2 className="mt-5 text-title text-balance">
          Making entrepreneurship more accessible.
        </h2>
        <div className="mt-8 space-y-5 text-lede text-ink-secondary">
          <p>
            As intelligent technology becomes more capable, the skills required
            to build a successful business may change.
          </p>
          <p>
            Someone with deep expertise in customer service, finance,
            recruitment, logistics, or another industry may increasingly be able
            to operate a business with a much smaller team.
          </p>
          <p>We want to explore how technology can make that possible.</p>
          <p>
            Our long-term ambition is to help more people move from providing
            their expertise solely as labour toward using that expertise to
            create and own businesses.
          </p>
          <p>
            We are beginning by proving the approach through selected
            collaborations. The broader opportunity will develop from what we
            learn.
          </p>
        </div>
      </AnimatedReveal>
    </SectionContainer>
  );
}
