import { HeroSection } from "@/components/home/HeroSection";
import { BeliefSection } from "@/components/home/BeliefSection";
import { BuildTransformSection } from "@/components/home/BuildTransformSection";
import { FeaturedWorkSection } from "@/components/home/FeaturedWorkSection";
import { EngineeringPhilosophyDeferred } from "@/components/home/EngineeringPhilosophyDeferred";
import { FutureVisionSection } from "@/components/home/FutureVisionSection";
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
      <ContactSection />
    </>
  );
}
