import { BrandButton } from "@/components/ui/BrandButton";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

export function AboutPreviewSection() {
  return (
    <SectionContainer tone="white" className="py-20 md:py-28">
      <AnimatedReveal className="max-w-3xl">
        <p className="label text-ashvi-blue">About Ashvi</p>
        <h2 className="mt-5 text-title">Why We Exist</h2>
        <div className="mt-7 space-y-4 text-lede text-ink-secondary">
          <p>
            Ashvi Tech began with a simple belief: deep technical capability
            should not be limited to solving the immediate requirements of an
            individual product or company.
          </p>
          <p>
            Technology can also create new opportunities for people and
            businesses.
          </p>
          <p>
            We are starting small. Our current focus is building WYZ Finance and
            developing the experience required to create and transform AI-native
            businesses.
          </p>
          <p>
            We intend to grow through demonstrated work rather than promises
            about scale.
          </p>
        </div>
        <div className="mt-8">
          <BrandButton href="/about" variant="secondary">
            Read Our Story
          </BrandButton>
        </div>
      </AnimatedReveal>
    </SectionContainer>
  );
}
