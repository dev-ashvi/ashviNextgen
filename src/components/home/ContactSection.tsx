import { BrandButton } from "@/components/ui/BrandButton";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function ContactSection() {
  return (
    <SectionContainer tone="cloud" className="py-20 md:py-28">
      <AnimatedReveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-title text-balance">Let&apos;s Build What Comes Next</h2>
        <p className="mt-6 text-lede text-ink-secondary">
          If you have deep expertise in an industry, an idea for a new business,
          or an existing company that could operate differently with AI,
          we&apos;d be interested in understanding what you&apos;re building.
        </p>
        <div className="mt-9">
          <BrandButton href="/contact">Start a Conversation</BrandButton>
        </div>
      </AnimatedReveal>
    </SectionContainer>
  );
}
