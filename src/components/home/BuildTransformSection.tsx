import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { cn } from "@/lib/utils";

function CardLink({
  href,
  children,
  tone = "light",
  emphasis = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  emphasis?: "primary" | "secondary";
  external?: boolean;
}) {
  const className = cn(
    "group inline-flex items-center gap-1.5 text-[14px] tracking-[-0.01em] transition-colors duration-300",
    emphasis === "primary" && "font-medium",
    emphasis === "secondary" && "font-normal",
    tone === "dark" &&
      emphasis === "primary" &&
      "text-ashvi-white hover:text-ashvi-teal",
    tone === "dark" &&
      emphasis === "secondary" &&
      "text-white/45 hover:text-white/70",
    tone === "light" &&
      emphasis === "primary" &&
      "text-ashvi-blue hover:text-ashvi-deep",
    tone === "light" &&
      emphasis === "secondary" &&
      "text-mute hover:text-ashvi-blue",
  );

  const arrow = (
    <span
      aria-hidden
      className="translate-x-0 transition-transform duration-300 ease-calm group-hover:translate-x-0.5"
    >
      →
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      {arrow}
    </Link>
  );
}

function BuildGeometry() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 420 520"
      className="pointer-events-none absolute -right-6 top-0 h-full w-[72%] max-w-none opacity-[0.18] sm:opacity-[0.2]"
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        <linearGradient id="wwd-build-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00CDB8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7EB6FF" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#wwd-build-stroke)" strokeWidth="1">
        <path d="M280 52c62 40 96 108 84 178S300 370 228 408" />
        <path d="M318 88c48 38 72 96 60 158S324 348 272 382" />
        <circle cx="332" cy="128" r="15" />
        <circle cx="296" cy="214" r="10" />
        <rect
          x="308"
          y="268"
          width="18"
          height="18"
          rx="3.5"
          transform="rotate(12 317 277)"
        />
        <circle cx="268" cy="342" r="8" />
      </g>
    </svg>
  );
}

const transformPoints = [
  "Understand existing workflows",
  "Identify opportunities for intelligent systems",
  "Redesign how work gets delivered",
  "Build around human expertise and judgement",
];

export function BuildTransformSection() {
  return (
    <SectionContainer id="what-we-do" tone="white" className="py-20 md:py-24 lg:py-28">
      <SectionHeading
        eyebrow="What We Do"
        title="Two paths. One ambition."
        description="We work in two ways—building new AI-native businesses and helping existing businesses rethink how they operate."
      />

      <div className="mt-12 grid items-stretch gap-5 md:mt-14 md:gap-6 lg:grid-cols-2 lg:gap-7">
        {/* —— Build —— */}
        <AnimatedReveal className="h-full">
          <article className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-ink-900 p-7 text-ashvi-white shadow-[0_18px_50px_rgba(2,19,54,0.18)] sm:p-8 md:p-9 lg:p-10">
            <BuildGeometry />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(0,205,184,0.12)_0%,transparent_70%)]"
            />

            <div className="relative flex flex-1 flex-col">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="label text-ashvi-teal/90">01 — Build</p>
                <p className="text-[12.5px] font-medium tracking-[-0.01em] text-white/45">
                  For founders &amp; domain experts
                </p>
              </div>

              <h3 className="mt-7 max-w-[15ch] text-balance font-serif text-[1.65rem] font-medium leading-[1.15] tracking-[-0.03em] text-white sm:text-[1.85rem] md:text-[2rem]">
                Creating{" "}
                <span className="whitespace-nowrap">AI-native</span> businesses
              </h3>

              <p className="mt-5 max-w-[34rem] text-[15.5px] leading-[1.65] text-[#A8B4C9] md:text-[16px]">
                We collaborate with domain experts and founders to turn industry
                knowledge into businesses designed with AI as a foundation, not a
                feature.
              </p>

              <div className="mt-8 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-2 sm:gap-7">
                <div>
                  <p className="label text-[11px] text-ashvi-teal/80">
                    Partners bring
                  </p>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[#9AA8BF]">
                    Market knowledge, customer understanding and industry
                    expertise.
                  </p>
                </div>
                <div>
                  <p className="label text-[11px] text-ashvi-teal/80">
                    Ashvi brings
                  </p>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[#9AA8BF]">
                    Software engineering, technology architecture, AI systems and
                    product development.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <CardLink href="/build" tone="dark" emphasis="primary">
                  Explore Build
                </CardLink>
              </div>
            </div>
          </article>
        </AnimatedReveal>

        {/* —— Transform —— */}
        <AnimatedReveal delay={0.08} className="h-full">
          <article className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#C5CEE0] bg-ashvi-cloud p-7 sm:p-8 md:p-9 lg:p-10">
            <div className="relative flex flex-1 flex-col">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="label text-ashvi-blue">02 — Transform</p>
                <p className="text-[12.5px] font-medium tracking-[-0.01em] text-mute">
                  For existing businesses
                </p>
              </div>

              <h3 className="mt-7 max-w-[16ch] text-balance font-serif text-[1.65rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink-900 sm:text-[1.85rem] md:text-[2rem]">
                Reimagining existing businesses with AI
              </h3>

              <p className="mt-5 max-w-[34rem] text-[15.5px] leading-[1.65] text-ink-secondary md:text-[16px]">
                We partner with businesses to rethink workflows, operations and
                services through intelligent technology.
              </p>

              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-[#D5DCEC] pt-7 sm:gap-x-7">
                {transformPoints.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-secondary"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ashvi-blue/55"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <CardLink href="/transform" emphasis="primary">
                  Explore Transform
                </CardLink>
              </div>
            </div>
          </article>
        </AnimatedReveal>
      </div>
    </SectionContainer>
  );
}
