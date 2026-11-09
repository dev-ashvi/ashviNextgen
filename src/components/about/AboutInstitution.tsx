import { InstitutionFlowShaderHost } from "@/components/about/InstitutionFlowShaderHost";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { cn } from "@/lib/utils";

/**
 * Section 03 — The Institution
 * Signature “Two pursuits. One institution.” composition.
 */
export function AboutInstitution() {
  return (
    <section
      aria-labelledby="about-institution-title"
      className="relative scroll-mt-24 overflow-hidden bg-ink-900 text-[color:var(--dark-text)]"
    >
      <InstitutionAtmosphere />
      {/* Experimental WebGL layer — SVG connectors retained pending review */}
      <InstitutionFlowShaderHost />

      <div className="shell relative z-10 py-14 md:py-16 lg:py-20">
        <AnimatedReveal className="mx-auto max-w-[40rem] text-center">
          <p className="label flex items-center justify-center gap-2.5 text-white/65">
            <span
              className="inline-block h-px w-6 bg-tide/70"
              aria-hidden="true"
            />
            What We&apos;re Building
          </p>
          <h2
            id="about-institution-title"
            className="mt-5 font-serif text-[clamp(1.95rem,1.1rem+2.4vw,2.9rem)] font-medium leading-[1.12] tracking-[-0.025em] text-white [font-variation-settings:'opsz'_48] md:mt-6"
          >
            Two pursuits. One institution.
          </h2>
          <p className="mx-auto mt-4 max-w-[34rem] text-[16px] leading-[1.65] text-white/70 md:mt-5 md:text-[17px]">
            Real-world building and independent exploration, connected through
            technical capability, learning and people.
          </p>
        </AnimatedReveal>

        <div className="relative mt-10 md:mt-11 lg:mt-12">
          <div className="relative z-10 grid items-stretch gap-0 lg:grid-cols-[1fr_minmax(4.5rem,5.5rem)_1fr]">
            <PursuitField
              title="Build"
              copy="Work with domain experts to create AI-native businesses and help established organisations transform."
              meta="Build new ventures / Transform businesses"
              icon={<BuildIcon />}
              delay={0.06}
            />

            <DesktopConnector />
            <MobileConnector />

            <PursuitField
              title="Explore"
              copy="Pursue independent research into intelligent architectures, alignment and decision-making."
              meta="Research / Experimentation / Open inquiry"
              icon={<ExploreIcon />}
              delay={0.1}
            />
          </div>
        </div>

        <AnimatedReveal delay={0.12} className="mt-7 md:mt-8">
          <p className="flex items-center justify-center gap-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-tide">
            <span aria-hidden className="hidden h-px w-10 bg-tide/55 sm:block" />
            Connected by a shared engineering foundation
            <span aria-hidden className="hidden h-px w-10 bg-tide/55 sm:block" />
          </p>
        </AnimatedReveal>

        <AnimatedReveal
          delay={0.14}
          className="mx-auto mt-7 max-w-[40rem] space-y-3.5 text-[15.5px] leading-[1.7] text-white/65 md:mt-8 md:space-y-4 md:text-[16px]"
        >
          <p>
            We want to develop an institution where the discipline of building
            useful technology and the freedom of independent research strengthen
            one another.
          </p>
          <p>
            Our commercial work begins with real operational challenges.
            Alongside it, Ashvi Research pursues technical questions that may
            not have immediate commercial applications.
          </p>
          <p>
            Neither ambition is merely a supporting function for the other.
            Both are part of what AshviTech aims to become.
          </p>
        </AnimatedReveal>
      </div>
    </section>
  );
}

function PursuitField({
  title,
  copy,
  meta,
  icon,
  delay = 0,
}: {
  title: string;
  copy: string;
  meta: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <AnimatedReveal delay={delay} className="h-full min-w-0">
      <article
        className={cn(
          "relative flex h-full flex-col rounded-[1.1rem] px-6 py-6 sm:px-7 sm:py-7 md:px-8 md:py-7",
          "bg-[#041634]",
          "ring-1 ring-tide/40",
        )}
      >
        <div className="relative flex flex-1 flex-col">
          <div className="text-tide">{icon}</div>
          <h3 className="mt-4 font-serif text-[clamp(1.85rem,1.2rem+1.4vw,2.35rem)] font-medium leading-[1.1] tracking-[-0.025em] text-white [font-variation-settings:'opsz'_48]">
            {title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.65] text-white/68 md:text-[15.5px]">
            {copy}
          </p>
          <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-tide/90">
            {meta}
          </p>
        </div>
      </article>
    </AnimatedReveal>
  );
}

/** Minimal desktop bridge — short horizontal line + one luminous point. */
function DesktopConnector() {
  return (
    <div
      aria-hidden
      className="relative hidden min-h-full items-center justify-center lg:flex"
    >
      <div className="flex w-full max-w-[4.25rem] items-center">
        <span className="h-px flex-1 bg-tide/55" />
        <span className="relative mx-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-tide/20" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-tide/90" />
        </span>
        <span className="h-px flex-1 bg-tide/55" />
      </div>
    </div>
  );
}

/** Minimal mobile bridge — short vertical line + one point. */
function MobileConnector() {
  return (
    <div
      aria-hidden
      className="flex flex-col items-center gap-1 py-3.5 lg:hidden"
    >
      <span className="h-5 w-px bg-tide/45" />
      <span className="h-1.5 w-1.5 rounded-full bg-tide/85" />
      <span className="h-5 w-px bg-tide/45" />
    </div>
  );
}

function InstitutionAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#021336_0%,#041a42_48%,#021336_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(0,205,184,0.11)_0%,transparent_70%)]" />
      <div className="absolute -left-[10%] top-[22%] h-[48%] w-[38%] rounded-full bg-[radial-gradient(circle,rgba(0,56,118,0.32)_0%,transparent_70%)] opacity-70" />
      <div className="absolute -right-[8%] bottom-[12%] h-[42%] w-[34%] rounded-full bg-[radial-gradient(circle,rgba(0,205,184,0.07)_0%,transparent_70%)]" />
    </div>
  );
}

function BuildIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M8 24.5 L18 19 L28 24.5 L18 30 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 18.5 L18 13 L28 18.5 L18 24 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.5 L18 7 L28 12.5 L18 18 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.25" />
      <ellipse
        cx="18"
        cy="18"
        rx="12"
        ry="5.5"
        stroke="currentColor"
        strokeWidth="1.15"
        transform="rotate(-28 18 18)"
      />
      <ellipse
        cx="18"
        cy="18"
        rx="12"
        ry="5.5"
        stroke="currentColor"
        strokeWidth="1.15"
        transform="rotate(38 18 18)"
      />
      <circle cx="28.5" cy="12.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
