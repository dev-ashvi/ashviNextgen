import Link from "next/link";
import { ResearchLandscape } from "@/components/research/ResearchLandscape";

/**
 * 06 — Ashvi Research.
 * Left: editorial intro. Right: landscape + memorial dedication.
 */
export function ResearchPreviewSection() {
  return (
    <section
      id="research"
      aria-labelledby="ashvi-research-title"
      className="relative isolate scroll-anchor overflow-hidden bg-ink-900 text-white"
    >
      <ResearchAtmosphere />

      <div className="shell relative py-16 md:py-20 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-8 xl:gap-10">
          <div className="relative z-10 min-w-0 lg:max-w-[30rem]">
            <p className="label flex items-center gap-2.5 text-white/65">
              <span
                className="inline-block h-px w-6 bg-white/25"
                aria-hidden="true"
              />
              Independent exploration
            </p>

            <h2
              id="ashvi-research-title"
              className="mt-6 font-serif text-[clamp(1.85rem,1.05rem+2.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-white [font-variation-settings:'opsz'_48]"
            >
              Ashvi Research
            </h2>

            <p className="mt-5 max-w-[34ch] font-serif text-[clamp(1.05rem,1.3vw,1.3rem)] leading-[1.4] tracking-[-0.01em] text-white/80">
              Exploring the foundations of intelligent systems.
            </p>

            <div className="mt-6 max-w-[34rem] space-y-4 text-[16px] leading-[1.7] text-white/65 md:mt-7 md:space-y-5 md:text-[17px]">
              <p>
                Alongside our commercial work, we conduct ongoing research into
                intelligent systems, alignment and decision-making.
              </p>
              <p>
                This work is independent of immediate client and product
                requirements. It is driven by curiosity, experimentation and a
                long-term view of what is possible.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/research"
                className="tap-target group inline-flex text-[16px] font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tide"
              >
                <span className="inline-flex items-center gap-2.5 border-b border-white/70 pb-1 transition-colors group-hover:border-tide">
                  Explore Ashvi Research
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-calm group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-tide ring-1 ring-inset ring-tide/45">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-tide"
                  aria-hidden="true"
                />
                Ongoing
              </span>
            </div>
          </div>

          <div className="min-w-0 w-[88%] justify-self-center sm:w-[90%] lg:w-[88%] lg:justify-self-end xl:w-[86%]">
            <ResearchLandscape className="w-full" />
            <Memorial />
          </div>
        </div>
      </div>
    </section>
  );
}

function Memorial() {
  return (
    <aside
      aria-label="In memory of Prateesh Goyal"
      className="-mt-2 max-w-[34rem] sm:-mt-3 lg:-mt-8 lg:max-w-none"
    >
      <div className="flex gap-4 sm:gap-5">
        <span
          className="mt-1 w-[2px] shrink-0 self-stretch rounded-full bg-tide/90"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
            In memory of
          </p>
          <p className="mt-1.5 font-serif text-[clamp(1.35rem,1.8vw,1.7rem)] leading-tight text-white">
            Prateesh Goyal
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.65] text-white/65 sm:text-[15px]">
            A brilliant researcher, a lifelong pursuit of knowledge, and a
            reminder of the importance of asking questions that matter.
          </p>
          {/* Memorial page not implemented yet — present as text, not a dead link. */}
          <span className="mt-4 inline-flex items-center gap-2 border-b border-white/50 pb-0.5 text-[14px] font-medium text-white/90">
            Remembering Prateesh
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

function ResearchAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#041634_0%,#021336_55%,#020F2B_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_40%_at_68%_42%,rgba(0,95,130,0.22)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_22%_at_60%_66%,rgba(0,205,184,0.07)_0%,transparent_70%)]" />
    </div>
  );
}
