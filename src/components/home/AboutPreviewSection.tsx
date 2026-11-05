import Link from "next/link";

/**
 * 07 — About Ashvi.
 * Editorial manifesto: BUILD ↔ EXPLORE, concluding conviction, Ashvi mark watermark.
 */
export function AboutPreviewSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-ashvi-title"
      className="relative scroll-mt-24 overflow-x-clip bg-paper text-ink-900"
    >
      <div className="shell py-16 md:py-20 lg:py-24">
        <div className="relative overflow-x-clip">
          <Watermark />

          <div className="relative z-10">
            <p className="label flex items-center gap-2.5 text-ink-900/65">
              <span className="text-tide-deep">07</span>
              <span
                className="inline-block h-px w-6 bg-ink-900/20"
                aria-hidden="true"
              />
              About Ashvi
            </p>

            <h2
              id="about-ashvi-title"
              className="mt-6 max-w-[16ch] font-serif text-[clamp(1.85rem,1.05rem+2.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink-900 [font-variation-settings:'opsz'_48] sm:max-w-[20ch] lg:max-w-[30ch]"
            >
              Technology should go beyond
              <br className="hidden lg:inline" />{" "}
              the business it serves.
            </h2>

            <p className="mt-5 max-w-[36rem] text-[18px] leading-[1.55] text-ink-900/70 md:mt-6 md:text-[19px] md:leading-[1.6] lg:max-w-[40rem]">
              We believe technical capability should create value in the
              world—and create room to explore what comes next.
            </p>
          </div>
        </div>

        <div
          className="mt-8 h-px bg-paper-line md:mt-10 lg:mt-12"
          aria-hidden="true"
        />

        <div className="grid items-start gap-8 pt-7 md:pt-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-8 lg:pt-9 xl:gap-x-12">
          <Pillar
            label="Build"
            title="Solve what matters now."
            copy="Work alongside domain experts to create useful AI-native businesses."
          />

          <BuildExploreConnector />

          <div className="border-t border-paper-line pt-8 lg:border-0 lg:pt-0">
            <Pillar
              label="Explore"
              title="Discover what comes next."
              copy="Invest learning, capability and time into independent research."
            />
          </div>
        </div>

        <p className="mt-8 rounded-2xl bg-[rgba(0,205,184,0.06)] px-5 py-4 text-center font-serif text-[clamp(1.05rem,1.2vw,1.25rem)] font-medium leading-[1.35] tracking-[-0.015em] text-ink-900 md:mt-10 md:px-8 md:py-5 lg:mt-11">
          What we build today should help make tomorrow&apos;s research
          possible.
        </p>

        <Link
          href="/about"
          className="group mt-6 inline-flex items-center gap-2 border-b border-tide/70 pb-1 text-[15px] font-medium text-ink-900 transition-colors duration-300 hover:border-tide md:mt-7"
        >
          Read Our Story
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-calm group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

function Pillar({
  label,
  title,
  copy,
}: {
  label: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-900/60">
        <span
          className="h-3 w-[2px] rounded-full bg-tide"
          aria-hidden="true"
        />
        {label}
      </p>
      <h3 className="mt-2.5 font-serif text-[clamp(1.35rem,1.5vw,1.55rem)] font-medium leading-[1.2] tracking-[-0.015em] text-ink-900">
        {title}
      </h3>
      <p className="mt-2 max-w-[28rem] text-[15px] leading-[1.65] text-mute md:text-[16px]">
        {copy}
      </p>
    </div>
  );
}

/** Fine line + teal centre point — relationship between BUILD and EXPLORE. */
function BuildExploreConnector() {
  return (
    <div
      aria-hidden="true"
      className="hidden items-center gap-3 self-center px-1 lg:flex"
    >
      <span className="h-px w-8 bg-paper-line xl:w-12" />
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-tide" />
      <span className="h-px w-8 bg-paper-line xl:w-12" />
    </div>
  );
}

function Watermark() {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/brand/ashvi-mark-watermark-640.webp 614w, /brand/ashvi-mark-watermark.webp 1227w"
        sizes="(min-width: 1024px) 52vw, 68vw"
      />
      <img
        src="/brand/ashvi-mark-watermark.png"
        alt=""
        width={1227}
        height={997}
        decoding="async"
        aria-hidden="true"
        className="about-watermark pointer-events-none absolute -right-[14%] top-0 w-[68vw] max-w-none select-none opacity-[0.045] sm:-right-[10%] sm:w-[58vw] lg:-right-[4%] lg:top-[-4%] lg:w-[48%] lg:opacity-[0.06] xl:w-[44%] 2xl:w-[40%]"
      />
    </picture>
  );
}
