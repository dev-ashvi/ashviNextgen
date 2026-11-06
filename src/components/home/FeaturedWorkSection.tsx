import Image from "next/image";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

/**
 * Editorial WYZ case study: compact light intro → product bridging
 * a shallow navy diagonal → callout. Screenshot stacks above both planes.
 */
export function FeaturedWorkSection() {
  return (
    <section
      id="our-work"
      className="relative scroll-mt-24 overflow-x-clip bg-[#F8F9FD]"
    >
      {/* Light atmospheric base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,#F8F9FD_0%,#F5F8FC_40%,#EAF4FC_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-[-18%] h-[50%] w-[48%] rounded-full bg-[radial-gradient(ellipse_at_center,#DCECF8_0%,transparent_70%)] opacity-70"
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-[2%] top-[3%] h-[38%] w-[38%] opacity-[0.26]"
        viewBox="0 0 480 420"
        fill="none"
      >
        <path
          d="M90 30c110 35 200 120 195 240S200 400 70 360"
          stroke="#003876"
          strokeOpacity="0.14"
          strokeWidth="1.15"
        />
        <path
          d="M140 18c115 42 205 125 195 250S245 400 115 350"
          stroke="#00CDB8"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
      </svg>

      {/*
        Shallow navy plane — rises gently toward the right.
        Soft environmental light under the product; right side stays darker for copy.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[54%] bg-ink-900 [clip-path:polygon(0%_14%,100%_5%,100%_100%,0%_100%)] sm:top-[52%] md:top-[48%] md:[clip-path:polygon(0%_20%,100%_6%,100%_100%,0%_100%)] lg:top-[46%]"
      >
        <div className="absolute bottom-[-5%] left-[-2%] h-[78%] w-[68%] bg-[radial-gradient(ellipse_at_40%_55%,#12396A_0%,rgba(18,57,106,0.35)_38%,transparent_72%)] opacity-70 md:opacity-80" />
        <div className="absolute bottom-[8%] left-[10%] h-[52%] w-[48%] bg-[radial-gradient(ellipse_at_center,#003876_0%,transparent_70%)] opacity-45 md:opacity-55" />
      </div>

      <div className="shell relative pb-8 pt-12 md:pb-9 md:pt-14 lg:pb-10 lg:pt-14">
        {/* ── Compact introduction ── */}
        <AnimatedReveal>
          <p className="label text-ashvi-blue">
            <span
              className="mr-2.5 inline-block h-px w-6 align-middle bg-tide/60"
              aria-hidden="true"
            />
            What We&apos;re Building
          </p>
        </AnimatedReveal>

        {/* Narrow brand column + subtle rule + wider copy — unified intro */}
        <div className="mt-5 flex flex-col gap-5 lg:mt-5 lg:flex-row lg:items-stretch lg:gap-0">
          <AnimatedReveal className="min-w-0 shrink-0 lg:w-[13.25rem]">
            <p className="text-[12.5px] font-medium tracking-[0.04em] text-mute">
              Current collaboration
            </p>
            <Image
              src="/companies/wyz-logo.webp"
              alt="WYZ"
              width={389}
              height={177}
              className="mt-3 h-auto w-[11rem] bg-transparent sm:w-[12.25rem] md:w-[13.25rem]"
              priority={false}
            />
          </AnimatedReveal>

          <span
            aria-hidden
            className="hidden lg:mx-6 lg:mt-[1.7rem] lg:mb-0.5 lg:block lg:w-px lg:shrink-0 lg:self-stretch lg:bg-[#B7C8DA] xl:mx-7"
          />

          <AnimatedReveal delay={0.05} className="min-w-0 flex-1 lg:pt-0.5">
            <h2 className="font-serif text-[1.45rem] font-medium leading-[1.2] tracking-[-0.025em] text-ink-900 md:text-[1.6rem] lg:text-[1.75rem]">
              WYZ Finance
            </h2>
            <p className="mt-2 text-[16.5px] font-medium tracking-[-0.015em] text-[#008F89] md:text-[17.5px]">
              AI-native financial intelligence and CFO services.
            </p>
            <p className="mt-3.5 text-[15px] leading-[1.65] text-ink-secondary md:text-[15.5px]">
              WYZ Finance brings financial-domain expertise together with
              AshviTech&apos;s technology architecture, AI engineering and product
              development to build financial intelligence capabilities for growing
              businesses.
            </p>
          </AnimatedReveal>
        </div>

        {/* ── Product exhibit: bridges light → navy ── */}
        <div className="relative z-10 mt-7 grid items-end gap-5 md:mt-8 md:gap-7 lg:mt-8 lg:grid-cols-[minmax(0,1.38fr)_minmax(0,0.62fr)] lg:gap-8 xl:gap-9">
          <AnimatedReveal className="relative min-w-0">
            {/* Soft halo where product sits on the pale canvas */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-5 top-[-8%] rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(220,236,248,0.5)_0%,transparent_68%)]"
            />
            {/* Broad contact shadow + restrained blue ground reflection */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-4 left-[2%] right-[4%] h-[3.5rem] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.22)_42%,transparent_74%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-[8%] right-[12%] h-10 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(18,57,106,0.65)_0%,transparent_72%)]"
            />
            <figure className="relative">
              {/*
                Mobile: overflow crop focused on Primary Financial State metrics.
                md+: full desktop dashboard (no crop).
              */}
              <div className="relative overflow-hidden rounded-[1.05rem] bg-ashvi-white shadow-[0_18px_40px_rgba(2,19,54,0.32),0_6px_14px_rgba(2,19,54,0.18)] ring-1 ring-[#C5D0E2] max-md:aspect-[4/3] sm:rounded-[1.2rem] md:aspect-auto">
                <Image
                  src="/companies/wyz-revenue-margin.webp"
                  alt="WYZ Finance Revenue & Margin product interface showing primary financial metrics and workspace navigation"
                  width={1263}
                  height={863}
                  className="h-auto w-full max-md:absolute max-md:inset-0 max-md:h-full max-md:w-full max-md:origin-[58%_72%] max-md:scale-[1.85] max-md:object-cover max-md:object-[58%_72%] md:static md:h-auto md:w-full md:origin-center md:scale-100 md:object-contain md:object-center"
                  sizes="(max-width: 767px) 100vw, (max-width: 1024px) 100vw, 64vw"
                  quality={85}
                />
              </div>
              <figcaption className="mt-2.5 text-[12.5px] font-normal leading-snug tracking-[-0.01em] text-[color:var(--dark-text-secondary)] md:mt-3 md:text-[13px]">
                Product interface · Illustrative demo data
              </figcaption>
            </figure>
          </AnimatedReveal>

          {/* Callout — bottom-aligned with product on navy */}
          <AnimatedReveal
            delay={0.06}
            className="relative min-w-0 lg:self-end lg:pb-1 lg:pr-1"
          >
            <div className="flex max-w-[22rem] gap-4 rounded-2xl bg-ink-900 p-5 text-[color:var(--dark-text)] ring-1 ring-white/10 lg:bg-transparent lg:p-0 lg:ring-0">
              <span
                aria-hidden
                className="mt-1.5 hidden h-[4.75rem] w-px shrink-0 bg-ashvi-teal sm:block lg:mt-2 lg:h-[5.25rem]"
              />
              <div className="min-w-0">
                <span
                  aria-hidden
                  className="mb-4 block h-px w-9 bg-ashvi-teal sm:hidden"
                />
                <p className="text-[1.3rem] font-semibold leading-[1.25] tracking-[-0.02em] text-ashvi-white md:text-[1.42rem] lg:text-[1.5rem]">
                  AI Decision Intelligence for Founders
                </p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--dark-text-secondary)] md:text-[15px]">
                  Connecting financial data, analysis and planning to help
                  founders make better-informed decisions.
                </p>
                <a
                  href="https://financewyz.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex items-center gap-2 border-b border-ashvi-teal/70 pb-0.5 text-[14.5px] font-medium tracking-[-0.01em] text-ashvi-white transition-colors hover:border-ashvi-teal hover:text-ashvi-teal md:text-[15px]"
                >
                  Explore WYZ Finance
                  <span
                    aria-hidden
                    className="translate-y-px transition-transform duration-300 ease-calm group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
