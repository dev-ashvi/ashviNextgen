import { HeroSection } from "@/components/home/HeroSection";
import { BeliefSection } from "@/components/home/BeliefSection";
import { BuildTransformSection } from "@/components/home/BuildTransformSection";
import { FeaturedWorkSection } from "@/components/home/FeaturedWorkSection";
import { EngineeringPhilosophyDeferred } from "@/components/home/EngineeringPhilosophyDeferred";
import { FutureVisionSection } from "@/components/home/FutureVisionSection";
import { ResearchPreviewSection } from "@/components/home/ResearchPreviewSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BeliefSection />
      <BuildTransformSection />
      <FeaturedWorkSection />
      <EngineeringPhilosophyDeferred />
      <FutureVisionSection />
      <ResearchPreviewSection />
      <AboutPreviewSection />
      <ContactSection />
    </>
  );
}
