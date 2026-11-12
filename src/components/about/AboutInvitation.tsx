import Link from "next/link";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { BrandButton } from "@/components/ui/BrandButton";

/**
 * Section 05 — The Invitation
 * Closing CTA — distinct from homepage “Let’s build what comes next.”
 */
export function AboutInvitation() {
  return (
    <section
      aria-labelledby="about-invitation-title"
      className="relative scroll-anchor overflow-hidden bg-ink-900 text-[color:var(--dark-text)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_0%,rgba(0,205,184,0.08)_0%,transparent_65%)]"
      />

      <div className="shell relative py-16 text-center md:py-20 lg:py-24">
        <AnimatedReveal className="mx-auto max-w-[38rem]">
          <p className="label flex items-center justify-center gap-2.5 text-white/65">
            <span
              className="inline-block h-px w-6 bg-tide/70"
              aria-hidden="true"
            />
            Work with AshviTech
          </p>
          <h2
            id="about-invitation-title"
            className="mt-6 font-serif text-[clamp(1.85rem,1.05rem+2.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-white [font-variation-settings:'opsz'_48]"
          >
            Some ideas need more than a conventional partnership.
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] text-[16px] leading-[1.65] text-white/70 md:text-[17px]">
            Whether you&apos;re building a venture, rethinking an existing
            business, or exploring a difficult technical question, we&apos;re
            interested in meaningful conversations.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <BrandButton
              href="/contact"
              variant="dark"
              className="tap-target min-w-[12rem]"
            >
              Start a conversation
              <span aria-hidden>→</span>
            </BrandButton>
            <Link
              href="/research"
              className="tap-target inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium tracking-[-0.01em] text-white/80 transition-colors duration-300 hover:text-tide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-tide"
            >
              Explore our research
              <span aria-hidden>→</span>
            </Link>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
