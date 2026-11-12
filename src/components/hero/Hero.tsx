import Link from "next/link";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { Sculpture } from "./Sculpture";
import { FloatingCard } from "./FloatingCard";

/**
 * Homepage hero — editorial headline left, Dual Intelligence stage right.
 * Sculpture, Stage lighting, and floating cards share one responsive stage
 * so the composition scales as a unit across desktop widths.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-x-clip bg-paper"
    >
      {/*
        Single-URL preload (no imageSrcSet): Chrome was assigning Low priority to the
        responsive preload, while fonts stayed VeryHigh and delayed LCP paint.
      */}
      <link rel="preload" as="image" type="image/webp" href="/art/sculpture-900.webp" />
      <HeroAtmosphere />

      <div
        className="
          relative mx-auto w-full max-w-[1400px]
          px-6 pb-24 pt-28
          sm:px-10 sm:pb-28
          lg:grid lg:min-h-[clamp(680px,100svh,1080px)]
          lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]
          lg:items-center lg:gap-x-3 lg:px-16 lg:pb-16 lg:pt-28
          xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]
          xl:gap-x-4 xl:px-20
          min-[1500px]:max-w-[1480px]
          min-[1500px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
          min-[1500px]:gap-x-5 min-[1500px]:px-20
        "
      >
        {/* Typography — container-sized so headline tracks the copy column */}
        <div className="@container relative z-10 min-w-0">
          <p className="hero-in flex items-center gap-3.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.22em] text-ink/90 sm:gap-4 sm:text-[11px] sm:tracking-[0.24em]">
            <span
              className="hidden h-px w-8 bg-tide sm:block"
              aria-hidden="true"
            />
            Technology. Business. Possibility.
          </p>

          <h1 id="hero-title" className="hero-in mt-7 [--d:80ms]">
            <span
              className="
                block font-serif font-medium leading-[1.02] tracking-[-0.022em] text-ink
                [font-variation-settings:'opsz'_72]
                text-[clamp(2.75rem,max(1.1rem+4.6cqi,4.15vw),4.35rem)]
              "
            >
              <span className="block lg:whitespace-nowrap">Businesses built</span>
              <span className="block lg:whitespace-nowrap">
                around{" "}
                <em className="font-normal italic text-signal">
                  intelligence.
                </em>
              </span>
            </span>
            <span
              className="
                mt-4 block font-normal leading-[1.25] tracking-[-0.018em] text-ashvi-teal
                text-[clamp(1.25rem,0.85rem+1.35cqi,1.85rem)]
              "
            >
              Powered by human expertise.
            </span>
          </h1>

          <p className="hero-in mt-6 max-w-[min(32rem,100%)] text-[15px] leading-[1.7] text-ink/70 [--d:160ms] sm:text-[16px] lg:text-[16px]">
            AshviTech partners with domain experts to build AI-native businesses
            and helps existing companies rethink how they operate through
            intelligent technology.
          </p>

          <div className="hero-in mt-10 flex flex-wrap items-center gap-3 [--d:240ms] sm:gap-4">
            <Link
              href="/#our-work"
              className="group inline-flex h-[54px] min-h-11 items-center gap-3 rounded-full bg-ink-900 px-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900 sm:px-7 sm:text-[16px]"
            >
              See what we&apos;re building
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-calm group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href="/#what-we-do"
              className="inline-flex h-[54px] min-h-11 items-center rounded-full bg-white/50 px-5 text-[15px] font-medium text-ink ring-1 ring-inset ring-ink/25 transition-all duration-300 hover:bg-white hover:ring-ink/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:px-7 sm:text-[16px]"
            >
              What We Do
            </Link>
          </div>
        </div>

        {/*
          Unified stage: sculpture + Stage lighting + floating cards.
          Desktop: pull the whole stage slightly left (without growing it)
          so headline and sculpture read as one composition.
        */}
        <div
          className="
            relative mx-auto mt-12 w-[min(112%,40rem)] -translate-x-[2%]
            sm:mt-14 sm:w-full sm:max-w-[40rem] sm:translate-x-0
            lg:mx-0 lg:mt-0 lg:w-full lg:max-w-none lg:justify-self-stretch
            lg:-translate-x-[clamp(1.25rem,3.2vw,2.75rem)]
          "
        >
          <div className="hero-in relative w-full [--d:120ms]">
            <Sculpture>
              <FloatingCard
                title="Build × Transform"
                subtitle="Create new. Reimagine existing."
                className="
                  left-[2%] top-[0%] origin-top-left
                  max-sm:scale-[0.88]
                  lg:left-[5%] lg:top-[6%] lg:scale-[0.86]
                  xl:left-[4%] xl:top-[5%] xl:scale-[0.94]
                  min-[1500px]:left-[2%] min-[1500px]:top-[3%] min-[1500px]:scale-100
                "
              />
              <FloatingCard
                title="Dual Intelligence"
                subtitle="Human expertise × AI engineering"
                delay={1800}
                className="
                  bottom-[7%] right-[0%] origin-bottom-right
                  hidden sm:flex
                  lg:bottom-[8%] lg:right-[0%] lg:scale-[0.86]
                  xl:bottom-[11%] xl:right-[2%] xl:scale-[0.94]
                  min-[1500px]:bottom-[12%] min-[1500px]:right-[3%] min-[1500px]:scale-100
                "
              />
            </Sculpture>
          </div>
        </div>
      </div>
    </section>
  );
}
