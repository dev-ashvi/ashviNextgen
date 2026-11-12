import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

/**
 * Section 01 — The Conviction
 * Light editorial hero with Ashvi watermark.
 */
export function AboutConviction() {
  return (
    <section
      aria-labelledby="about-conviction-title"
      className="relative scroll-anchor overflow-x-clip border-b border-paper-line bg-paper"
    >
      <div className="shell relative pb-12 pt-28 md:pb-14 md:pt-32 lg:pb-16 lg:pt-36">
        <Watermark />

        <AnimatedReveal className="relative z-10 max-w-[40rem]">
          <p className="label flex items-center gap-2.5 text-ink-900/65">
            <span
              className="inline-block h-px w-6 bg-tide/70"
              aria-hidden="true"
            />
            About AshviTech
          </p>

          <h1
            id="about-conviction-title"
            className="mt-6 max-w-[30ch] text-pretty font-serif text-[clamp(1.95rem,1.15rem+2.35vw,2.95rem)] font-medium leading-[1.12] tracking-[-0.028em] text-ink-900 [font-variation-settings:'opsz'_48] sm:max-w-[26ch] lg:max-w-[28ch]"
          >
            Technology should go beyond the business it serves.
          </h1>

          <p className="mt-6 max-w-[34rem] text-[17px] leading-[1.65] text-ink-900/70 md:mt-7 md:text-[18px] md:leading-[1.7]">
            We believe technical capability should solve meaningful problems,
            create opportunities for people, and expand what becomes possible to
            explore.
          </p>

          <p className="mt-5 font-serif text-[clamp(1.15rem,1.2vw,1.35rem)] font-medium leading-[1.35] tracking-[-0.015em] text-ink-900 md:mt-6">
            <span
              aria-hidden="true"
              className="mb-3.5 block h-px w-8 bg-tide/70"
            />
            Building businesses. Advancing technology.
          </p>
        </AnimatedReveal>
      </div>
    </section>
  );
}

function Watermark() {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/brand/ashvi-mark-watermark-640.webp 614w, /brand/ashvi-mark-watermark.webp 1227w"
        sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 60vw"
      />
      <img
        src="/brand/ashvi-mark-watermark-640.webp"
        alt=""
        width={1227}
        height={997}
        decoding="async"
        loading="lazy"
        fetchPriority="low"
        aria-hidden="true"
        className="about-page-watermark pointer-events-none absolute -right-[12%] top-24 w-[60vw] max-w-none select-none opacity-[0.045] sm:-right-[8%] sm:top-24 sm:w-[50vw] lg:-right-[2%] lg:top-20 lg:w-[42%] lg:opacity-[0.055] xl:w-[38%] 2xl:w-[34%]"
      />
    </picture>
  );
}
