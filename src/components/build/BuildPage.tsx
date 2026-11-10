import Link from 'next/link'
import type { ReactNode } from 'react'
import { Terrain } from '../research-page/Linework'
import { BuildHeroVisual } from './BuildHeroVisual'
import { BuildPartnership } from './BuildPartnership'

/**
 * /build — Co-building AI-native ventures.
 * Dark hero → light opportunity → dark partnership → light process → light WYZ showcase → dark closing CTA.
 * Header and footer come from the host layout.
 */

const CONTACT_HREF = '/contact'
const WYZ_HREF = 'https://financewyz.ai/'
const WYZ_LOGO = '/companies/wyz-logo.webp'
const WYZ_SCREEN = '/companies/wyz-revenue-margin.webp'

export function BuildPage() {
  return (
    <div className="bg-[#F8F9FD] text-[#021336]">
      <BuildHero />
      <BuildOpportunity />
      <BuildPartnership />
      <BuildJourney />
      <BuildWyzShowcase />
      <BuildClosingCTA />
    </div>
  )
}

/* ───────────────────────── shared ───────────────────────── */

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-12 ${className}`}>{children}</div>
}

function Eyebrow({ children, tone = 'light', center = false }: { children: ReactNode; tone?: 'light' | 'dark'; center?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3.5 font-mono text-[11.5px] uppercase tracking-[0.22em] sm:text-[12px] ${center ? 'justify-center' : ''} ${
        tone === 'dark' ? 'text-white/80' : 'text-[#021336]/70'
      }`}
    >
      <span className={`h-px w-7 ${tone === 'dark' ? 'bg-[#00CDB8]' : 'bg-[#00A896]'}`} aria-hidden="true" />
      {children}
    </p>
  )
}

const serif = 'font-serif font-normal tracking-[-0.015em]'

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#F8F9FD] px-7 text-[15.5px] font-medium text-[#021336] outline-none transition-colors duration-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-[#00CDB8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#021336]"
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none">
        →
      </span>
    </Link>
  )
}

/* ───────────────────────── 01 Hero ───────────────────────── */

function BuildHero() {
  return (
    <section aria-labelledby="build-hero-title" className="relative isolate overflow-hidden bg-[#021336] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#03193d_0%,#021336_55%,#04213f_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_60%_at_72%_46%,rgba(0,56,118,0.5)_0%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_36%_70%_at_70%_100%,rgba(0,205,184,0.10)_0%,transparent_70%)]" />
      </div>

      <Shell className="grid items-center gap-y-16 pb-14 pt-14 sm:pt-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-x-4 lg:pb-16 lg:pt-16">
        <div className="relative z-10 max-w-[38rem]">
          <Eyebrow tone="dark">AshviTech / Build</Eyebrow>
          <h1 id="build-hero-title" className={`${serif} mt-6 whitespace-nowrap text-[clamp(2.4rem,4.6vw,4.1rem)] leading-[1.04]`}>
            Co-building
            <br />
            AI-native ventures.
          </h1>
          <p className="mt-6 max-w-[31rem] text-[16.5px] leading-[1.65] text-white/80 sm:text-[17.5px]">
            We partner with founders and domain experts to turn deep business understanding into AI-native businesses—combining
            domain insight, product thinking and engineering from the ground up.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PrimaryButton href={CONTACT_HREF}>Discuss a venture idea</PrimaryButton>
            <a
              href="#how-we-build-together"
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-sm text-[15.5px] font-medium text-white/90 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#00CDB8]"
            >
              See how we build
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-0.5 motion-reduce:transition-none">
                ↓
              </span>
            </a>
          </div>
        </div>

        {/* the sculpture is its own component and can be replaced independently */}
        <BuildHeroVisual className="mx-auto mb-10 mt-14 w-full max-w-[760px] lg:-mr-[4%] lg:mb-6 lg:mt-14" />
      </Shell>
    </section>
  )
}

/* ───────────────────────── 02 Opportunity ───────────────────────── */

function BuildOpportunity() {
  return (
    <section aria-labelledby="build-opportunity-title" className="relative isolate overflow-hidden bg-[#F8F9FD]">
      {/* clipped to the post-copy band so the crest never sits behind body text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,#000_45%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_45%)] sm:h-14 lg:h-16"
      >
        <Terrain
          idPrefix="bo"
          palette="light"
          fadeLeft={false}
          highlights={false}
          className="absolute -right-[5%] bottom-0 h-[420%] w-[74%] translate-y-[68%] opacity-50 sm:w-[58%] lg:w-[46%] [mask-image:linear-gradient(90deg,transparent_0%,#000_55%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_55%)]"
        />
      </div>
      <Shell className="grid gap-8 pb-20 pt-12 sm:pt-14 lg:grid-cols-[1fr_1px_1.05fr] lg:gap-14 lg:pb-20 lg:pt-14">
        <div>
          <Eyebrow>The opportunity</Eyebrow>
          <h2 id="build-opportunity-title" className={`${serif} mt-5 text-balance text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.1]`}>
            Deep expertise can become the foundation of a new business.
          </h2>
        </div>
        <span className="hidden bg-[#021336]/[0.12] lg:block" aria-hidden="true" />
        <div className="space-y-4 text-[16.5px] leading-[1.7] text-[#021336]/78 lg:pt-8 lg:text-[17px]">
          <p>
            People closest to an industry often understand its problems better than anyone else. They know the work, the customers,
            the exceptions and the opportunities that existing solutions overlook.
          </p>
          <p>
            Intelligent technology may make it possible to turn that understanding into businesses that operate differently—with
            smaller teams, adaptable systems and new ways of delivering value.
          </p>
        </div>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 04 Journey ───────────────────────── */

const STAGES = [
  { t: ['Understand', 'the opportunity'], d: 'Examine the problem, the workflow, the people affected and why existing solutions fall short.' },
  { t: ['Validate', 'what matters'], d: 'Test assumptions about customer demand, feasibility and potential value.' },
  { t: ['Design the', 'operating model'], d: 'Define how people, intelligent systems and business processes should work together.' },
  { t: ['Build', 'and learn'], d: 'Develop the product, test it in real conditions and iterate on evidence.' },
  { t: ['Grow with', 'the business'], d: 'Evolve the systems and responsibilities as the venture develops, where the partnership includes ongoing participation.' },
] as const

/** Muted blue → Intelligence Teal across the five stages (understated progression). */
const STAGE_TONES = [
  { accent: '#6E9BE0', fillFrom: '#EEF3FA', fillTo: '#D9E6F5', ring: 0.28 },
  { accent: '#52A8D4', fillFrom: '#EAF4F9', fillTo: '#CFE6F1', ring: 0.32 },
  { accent: '#36B5C8', fillFrom: '#E7F5F5', fillTo: '#C5E9EB', ring: 0.36 },
  { accent: '#1AC1BC', fillFrom: '#E5F8F5', fillTo: '#BEEDE7', ring: 0.4 },
  { accent: '#00CDB8', fillFrom: '#E6FAF7', fillTo: '#C9F1EB', ring: 0.45 },
] as const

const MID_NODE_COLORS = ['#60A2DA', '#44AECF', '#28BBC2', '#0CC7BA'] as const

function StageIcon({ i }: { i: number }) {
  const p = { fill: 'none', stroke: '#021336', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[22px] w-[22px]">
      {i === 0 && (
        <g {...p}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </g>
      )}
      {i === 1 && (
        <g {...p}>
          <path d="M12 3.5 20.5 8 12 12.5 3.5 8z" />
          <path d="m3.5 12 8.5 4.5 8.5-4.5" />
          <path d="m3.5 16 8.5 4.5 8.5-4.5" />
        </g>
      )}
      {i === 2 && (
        <g {...p}>
          <circle cx="12" cy="5.5" r="2.2" />
          <circle cx="5.5" cy="18" r="2.2" />
          <circle cx="18.5" cy="18" r="2.2" />
          <path d="M11 7.5 6.6 16M13 7.5l4.4 8.5" />
        </g>
      )}
      {i === 3 && (
        <g {...p}>
          <path d="m8 7.5-4.5 4.5L8 16.5M16 7.5l4.5 4.5-4.5 4.5M13.5 5.5l-3 13" />
        </g>
      )}
      {i === 4 && (
        <g fill="#021336">
          <rect x="4.5" y="13" width="3" height="7" rx="0.6" />
          <rect x="10.5" y="9" width="3" height="11" rx="0.6" />
          <rect x="16.5" y="4.5" width="3" height="15.5" rx="0.6" />
        </g>
      )}
    </svg>
  )
}

function Marker({ i }: { i: number }) {
  const tone = STAGE_TONES[i]
  return (
    <span
      className="relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${tone.fillFrom} 0%, ${tone.fillTo} 100%)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone.accent} ${Math.round(tone.ring * 100)}%, transparent)`,
      }}
    >
      <StageIcon i={i} />
    </span>
  )
}

/** Continuous path through the five marker centres; stroke fades blue → teal. */
function JourneyConnector() {
  // viewBox 1000 × 60; marker centres at x = 100, 300, 500, 700, 900; y = 30
  // Gentle amplitude keeps the line intentional without competing with the icons.
  const d =
    'M100 30 C155 30 170 20 200 20 S245 30 300 30 S355 40 400 40 S445 30 500 30 S555 20 600 20 S645 30 700 30 S755 40 800 40 S845 30 900 30'
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-[52px] w-full">
      <defs>
        <linearGradient id="build-journey-line" x1="100" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6E9BE0" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#36B5C8" stopOpacity="0.65" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0.78" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#build-journey-line)" strokeWidth="1.35" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function BuildJourney() {
  return (
    <section aria-labelledby="build-journey-title" className="bg-[#F8F9FD]">
      <Shell className="pb-10 pt-16 sm:pt-20">
        <Eyebrow>From insight to venture</Eyebrow>
        <h2 id="build-journey-title" className={`${serif} mt-5 text-balance text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.1]`}>
          A structured path from an insight to a business.
        </h2>

        {/* desktop / tablet */}
        <div className="relative mt-16 hidden md:block">
          <JourneyConnector />
          {/* mid-path nodes, tinted along the blue→teal progression */}
          {[200, 400, 600, 800].map((x, k) => (
            <span
              key={x}
              aria-hidden="true"
              className="absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${x / 10}%`,
                top: `${((k % 2 === 0 ? 20 : 40) / 60) * 52}px`,
                background: MID_NODE_COLORS[k],
                opacity: 0.85,
              }}
            />
          ))}
          <ol className="relative grid grid-cols-5 gap-x-5 lg:gap-x-6">
            {STAGES.map((s, i) => (
              <li key={s.d} className="flex flex-col items-center text-center">
                <Marker i={i} />
                <h3 className="mt-5 min-h-[2.5em] text-[17px] font-semibold leading-[1.25] text-[#021336]">
                  {s.t[0]}
                  <br />
                  {s.t[1]}
                </h3>
                <p className="mt-2.5 w-full max-w-[13.75rem] text-[14.5px] leading-[1.5] text-[#021336]/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* mobile: vertical connected timeline with the same colour progression */}
        <ol className="mt-12 md:hidden">
          {STAGES.map((s, i) => (
            <li key={s.d} className="relative flex gap-5 pb-9 last:pb-0">
              {i < STAGES.length - 1 && (
                <span
                  className="absolute bottom-0 left-[25.5px] top-[52px] w-px"
                  style={{
                    background: `linear-gradient(180deg, ${STAGE_TONES[i].accent}, ${STAGE_TONES[i + 1].accent})`,
                    opacity: 0.55,
                  }}
                  aria-hidden="true"
                />
              )}
              <Marker i={i} />
              <div className="min-w-0 pt-1.5">
                <h3 className="text-[17px] font-semibold leading-[1.3] text-[#021336]">
                  {s.t[0]} {s.t[1]}
                </h3>
                <p className="mt-1.5 text-[15.5px] leading-[1.55] text-[#021336]/72">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 05 WYZ showcase ───────────────────────── */

function WyzExploreLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={WYZ_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={`group min-h-[44px] items-center gap-2 border-b border-[#00A896] text-[15.5px] font-medium text-[#007A6E] outline-none hover:text-[#021336] focus-visible:ring-2 focus-visible:ring-[#00CDB8] ${className}`}
    >
      Explore WYZ Finance
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

function BuildWyzShowcase() {
  return (
    <section aria-labelledby="build-wyz-title" className="bg-[#F8F9FD] pb-14 pt-6 sm:pb-16">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-[24px] bg-[#EEF1F7] px-6 py-9 sm:px-10 lg:grid-cols-[0.58fr_1px_1.1fr_1.45fr] lg:gap-10 lg:px-11 lg:py-9 xl:gap-11 xl:px-12">
          {/* 1. Branding — link stays under the logo on desktop */}
          <div className="[&>p:first-child]:whitespace-nowrap">
            <Eyebrow>An active collaboration</Eyebrow>
            <img src={WYZ_LOGO} alt="WYZ Finance" className="mt-6 h-11 w-auto" />
            <WyzExploreLink className="mt-7 hidden lg:inline-flex" />
          </div>

          <span className="hidden h-full min-h-[9rem] bg-[#021336]/[0.12] lg:block" aria-hidden="true" />

          {/* 2. Collaboration copy — mobile link follows the description */}
          <div className="max-w-[36rem] lg:max-w-none">
            <h2 id="build-wyz-title" className={`${serif} text-balance text-[clamp(1.6rem,2.3vw,2rem)] leading-[1.2]`}>
              <span className="sr-only">WYZ Finance — </span>Building financial intelligence with domain expertise.
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.7] text-[#021336]/75">
              Our active collaboration with WYZ Finance brings together financial-domain understanding and AshviTech’s engineering
              capabilities to develop AI-native financial intelligence products for growing businesses.
            </p>
            <WyzExploreLink className="mt-6 inline-flex lg:hidden" />
          </div>

          {/* 3. Product preview — slightly larger within the right column */}
          <figure className="mx-auto w-full max-w-[540px] lg:mx-0 lg:max-w-none">
            {/* a framed screen: bezel + base, no fabricated content — the approved product screenshot */}
            <div className="rounded-t-[14px] bg-[#0B1424] p-[7px] pb-[9px] shadow-[0_20px_40px_-24px_rgba(2,19,54,0.6)]">
              <img src={WYZ_SCREEN} alt="WYZ Finance product interface: Revenue and Margin workspace" className="block h-auto w-full rounded-[6px]" />
            </div>
            <div className="mx-[-5%] h-[10px] rounded-b-[10px] bg-[linear-gradient(180deg,#C9CED8,#9AA1AE)]" aria-hidden="true" />
            <figcaption className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#021336]/55">
              Product interface · Illustrative demo data
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 06 Closing CTA ───────────────────────── */

function BuildClosingCTA() {
  return (
    <section aria-labelledby="build-cta-title" className="relative isolate overflow-hidden bg-[#021336] text-white">
      {/* terrain framing from both lower corners (the Research page's linework, mirrored) */}
      <Terrain
        idPrefix="bcl"
        fadeLeft={false}
        highlights={false}
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[78%] w-[46%] -scale-x-100 opacity-70 [mask-image:linear-gradient(270deg,transparent_0%,#000_60%)] [-webkit-mask-image:linear-gradient(270deg,transparent_0%,#000_60%)]"
      />
      <Terrain
        idPrefix="bcr"
        fadeLeft={false}
        highlights={false}
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[78%] w-[46%] opacity-70 [mask-image:linear-gradient(90deg,transparent_0%,#000_60%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_60%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_36%_60%_at_50%_45%,#021336_30%,transparent_100%)]" />
      <Shell className="flex flex-col items-center pb-24 pt-16 text-center sm:pb-28 sm:pt-20">
        <Eyebrow tone="dark" center>
          Build with AshviTech
        </Eyebrow>
        <h2 id="build-cta-title" className={`${serif} mt-5 text-balance text-[clamp(2.1rem,4vw,3.25rem)] leading-[1.08]`}>
          What could we build together?
        </h2>
        <p className="mt-4 max-w-[46rem] text-[16.5px] leading-[1.65] text-white/80 sm:text-[17.5px]">
          If you understand a problem deeply and see an opportunity to create something better, we’d like to hear about it.
        </p>
        <div className="mt-8">
          <PrimaryButton href={CONTACT_HREF}>Discuss a venture idea</PrimaryButton>
        </div>
      </Shell>
    </section>
  )
}
