import Link from 'next/link'
import type { ReactNode } from 'react'
import { Horizon, Terrain } from './Linework'

/**
 * Ashvi Research — dedicated page.
 * Identity → philosophy → method → ambition → dedication → invitation.
 * Presents a research philosophy, not a portfolio: no tracks, findings, teams or affiliations.
 *
 * Portable: hex colours as Tailwind arbitrary values, `font-serif` / `font-sans` / `font-mono`
 * from the host theme, no other dependencies. Header and footer come from the host layout.
 */

const CONTACT_HREF = '/contact' // the site's existing contact route

export function ResearchPage() {
  return (
    <div className="bg-[#F8F9FD] text-[#021336]">
      <Hero />
      <WhyWeExplore />
      <Approach />
      <LongHorizon />
      <Memorial />
      <Collaboration />
    </div>
  )
}

/* ───────────────────────── shared ───────────────────────── */

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-12 ${className}`}>{children}</div>
}

function Eyebrow({ children, tone = 'light', id }: { children: ReactNode; tone?: 'light' | 'dark'; id?: string }) {
  return (
    <p id={id} className={`flex items-center gap-3.5 font-mono text-[11.5px] uppercase tracking-[0.24em] sm:text-[12px] ${tone === 'dark' ? 'text-white/75' : 'text-[#021336]/65'}`}>
      <span className={`h-px w-7 ${tone === 'dark' ? 'bg-[#00CDB8]' : 'bg-[#00A896]'}`} aria-hidden="true" />
      {children}
    </p>
  )
}

const h2 = 'font-serif font-normal tracking-[-0.015em] text-balance'

/* ───────────────────────── 1. Hero ───────────────────────── */

function Hero() {
  return (
    <section aria-labelledby="rp-hero-title" className="relative isolate overflow-hidden bg-[#021336] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#041a3f_0%,#021336_60%,#020f2c_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_78%_60%,rgba(0,56,118,0.55)_0%,transparent_70%)]" />
      </div>

      {/* desktop: the terrain occupies the lower right, behind nothing */}
      <Terrain idPrefix="rph" className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[70%] lg:block" />

      <Shell className="relative pb-2 pt-16 sm:pt-20 lg:pb-28 lg:pt-28">
        <div className="max-w-[36rem]">
          <Eyebrow tone="dark">Ashvi Research</Eyebrow>
          <h1 id="rp-hero-title" className={`${h2} mt-6 text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.04]`}>
            Exploring the foundations of intelligent systems.
          </h1>
          <p className="mt-6 max-w-[32rem] text-[17px] leading-[1.65] text-white/78 sm:text-[18.5px]">
            Independent inquiry into intelligent systems, emerging technologies and the fundamental questions that shape
            technological progress.
          </p>
          <p className="mt-9 font-mono text-[11.5px] uppercase leading-[2] tracking-[0.22em] text-[#00CDB8] sm:text-[12.5px]">
            {['Question', 'Experiment', 'Understand', 'Evolve'].map((w, i, a) => (
              <span key={w}>
                <span className="whitespace-nowrap">
                  {w}
                  {i < a.length - 1 && (
                    <span className="pl-3 pr-1 text-[#00CDB8]/55" aria-hidden="true">
                      /
                    </span>
                  )}
                </span>{' '}
              </span>
            ))}
          </p>
        </div>
      </Shell>

      {/* mobile/tablet: the terrain sits below the text, never behind it */}
      <Terrain
        idPrefix="rpm"
        fadeLeft={false}
        className="pointer-events-none -mt-4 block h-[250px] w-full sm:h-[320px] lg:hidden [mask-image:linear-gradient(90deg,transparent_0%,#000_45%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_45%)]"
      />
    </section>
  )
}

/* ───────────────────────── 2. Why we explore ───────────────────────── */

function WhyWeExplore() {
  return (
    <section aria-labelledby="rp-why-title" className="border-b border-[#021336]/[0.08]">
      <Shell className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[1.05fr_1px_0.95fr] lg:gap-16 lg:py-24">
        <div>
          <Eyebrow>Why we explore</Eyebrow>
          <h2 id="rp-why-title" className={`${h2} mt-6 text-[clamp(2rem,3.6vw,3.15rem)] leading-[1.1]`}>
            Not every important technical question begins with a business requirement.
          </h2>
        </div>
        <span className="hidden bg-[#021336]/[0.1] lg:block" aria-hidden="true" />
        <div className="space-y-5 text-[17px] leading-[1.75] text-[#021336]/75 lg:pt-12 lg:text-[18px]">
          <p>Some questions need space for investigation, experimentation and the possibility of unexpected answers.</p>
          <p>
            Ashvi Research exists to create that space—to pursue meaningful technical inquiry alongside, but
            independently from, our commercial work.
          </p>
        </div>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 3. Approach ───────────────────────── */

const STAGES = [
  { name: 'Question', text: 'Identify meaningful technical questions.' },
  { name: 'Hypothesis', text: 'Form and refine testable ideas.' },
  { name: 'Experiment', text: 'Explore through implementation and trials.' },
  { name: 'Evaluation', text: 'Analyse results, learn and iterate.' },
  { name: 'New Questions', text: 'Build on what we learn and pursue the next set of questions.' },
] as const

/**
 * Stage markers: one geometric family that gains structure stage by stage —
 * an open circle, a located centre, a measured cross, a resolved disc, and an outer ring opening outward.
 */
function StageMark({ i }: { i: number }) {
  const s = '#00A896'
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className="h-7 w-7 shrink-0 bg-[#F8F9FD]">
      <circle cx="14" cy="14" r="9" fill="#F8F9FD" stroke={s} strokeWidth="1.2" />
      {i === 1 && <circle cx="14" cy="14" r="2.2" fill={s} />}
      {i === 2 && <path d="M14 7.5v13M7.5 14h13" stroke={s} strokeWidth="1.1" />}
      {i === 3 && <circle cx="14" cy="14" r="5" fill={s} />}
      {i === 4 && (
        <>
          <circle cx="14" cy="14" r="2.2" fill={s} />
          <path d="M14 1.6a12.4 12.4 0 0 1 12.4 12.4" fill="none" stroke={s} strokeWidth="1.1" />
        </>
      )}
    </svg>
  )
}

function Approach() {
  return (
    <section aria-labelledby="rp-approach-title" className="border-b border-[#021336]/[0.08]">
      <Shell className="py-20 sm:py-24 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Eyebrow>Our approach</Eyebrow>
            <h2 id="rp-approach-title" className={`${h2} mt-6 text-[clamp(2rem,3.6vw,3.15rem)] leading-[1.1]`}>
              A disciplined, iterative approach to inquiry.
            </h2>
          </div>
          <p className="text-[17px] leading-[1.75] text-[#021336]/75 lg:pt-12 lg:text-[18px]">
            We begin with questions, develop hypotheses and explore them through experimentation. We distinguish what we
            believe from what we can demonstrate, and treat uncertainty as part of the process rather than something to
            conceal.
          </p>
        </div>

        {/* Desktop: one measured line through five stations, and a return path beneath */}
        <div className="relative mt-16 hidden lg:block">
          <span className="absolute left-[10%] right-[10%] top-[13px] h-px bg-[linear-gradient(90deg,#00A896_0%,#00A896_100%)] opacity-60" aria-hidden="true" />
          <ol className="relative grid grid-cols-5">
            {STAGES.map((s, i) => (
              <li key={s.name} className="flex flex-col items-center px-5 text-center">
                <StageMark i={i} />
                <h3 className="mt-6 font-serif text-[23px] font-normal leading-tight">{s.name}</h3>
                <p className="mt-2.5 max-w-[15rem] text-[15px] leading-[1.6] text-[#021336]/65">{s.text}</p>
              </li>
            ))}
          </ol>
          {/* iteration: New Questions feeds back into Question — a return path, not a pipeline */}
          <div className="relative mx-[10%] mt-6 h-6" aria-hidden="true">
            <span className="absolute inset-0 rounded-b-[14px] border-x border-b border-dashed border-[#00A896]/45" />
            <span className="absolute -top-px left-0 h-0 w-0 -translate-x-1/2 border-x-[4px] border-b-[6px] border-x-transparent border-b-[#00A896]/70" />
          </div>
        </div>

        {/* Mobile: a vertical rail; the return path runs back up beside it */}
        <ol className="relative mt-12 space-y-8 pl-12 lg:hidden">
          {STAGES.map((s, i) => (
            <li key={s.name} className="relative">
              {i < STAGES.length - 1 && (
                <span className="absolute -left-[35px] -bottom-8 top-[28px] w-px bg-[#00A896]/55" aria-hidden="true" />
              )}
              <span className="absolute -left-12 top-0">
                <StageMark i={i} />
              </span>
              <h3 className="font-serif text-[22px] font-normal leading-7">{s.name}</h3>
              <p className="mt-1.5 text-[16px] leading-[1.6] text-[#021336]/68">{s.text}</p>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 4. The long horizon ───────────────────────── */

function LongHorizon() {
  return (
    <section aria-labelledby="rp-horizon-title" className="relative isolate overflow-hidden bg-[#021336] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_70%_at_70%_55%,rgba(0,56,118,0.5)_0%,transparent_70%)]" />
      <Horizon
        idPrefix="rhd"
        className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[66%] lg:block [mask-image:linear-gradient(90deg,transparent_0%,transparent_18%,#000_48%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,transparent_18%,#000_48%)]"
      />
      <Shell className="relative py-20 lg:py-24">
        <div className="max-w-[34rem]">
          <Eyebrow tone="dark">The long horizon</Eyebrow>
          <h2 id="rp-horizon-title" className={`${h2} mt-6 text-[clamp(2rem,3.6vw,3.15rem)] leading-[1.1]`}>
            Meaningful technical progress rarely follows a predictable path.
          </h2>
          <p className="mt-6 max-w-[30rem] text-[17px] leading-[1.7] text-white/75 lg:text-[18px]">
            We want to build the capability, patience and independence to pursue questions whose value may only become
            clear over time.
          </p>
        </div>
      </Shell>
      <Horizon idPrefix="rhm" className="pointer-events-none -mt-6 block h-[150px] w-full lg:hidden" />
    </section>
  )
}

/* ───────────────────────── 5. Memorial ───────────────────────── */

function Memorial() {
  return (
    <section aria-labelledby="rp-memorial-name" className="border-b border-[#021336]/[0.08]">
      <Shell className="grid gap-8 py-20 sm:py-24 lg:grid-cols-[0.8fr_1px_1.2fr] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <Eyebrow>In memory of</Eyebrow>
          <h2 id="rp-memorial-name" className={`${h2} mt-5 text-[clamp(2.2rem,3.8vw,3.25rem)] leading-[1.05]`}>
            Prateesh Goyal
          </h2>
        </div>
        <span className="hidden h-full min-h-[8rem] bg-[#021336]/[0.1] lg:block" aria-hidden="true" />
        <div className="space-y-5 border-l-2 border-[#00CDB8]/70 pl-6 text-[17px] leading-[1.75] text-[#021336]/78 lg:border-0 lg:pl-0 lg:text-[18px]">
          <p>
            We dedicate Ashvi Research to the memory of Prateesh Goyal, whose curiosity, intelligence and generosity of
            thought continue to inspire us.
          </p>
          <p>
            His belief in asking deeper questions, exploring first principles and thinking independently remains a lasting
            influence on this work.
          </p>
        </div>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 6. Collaboration ───────────────────────── */

function Collaboration() {
  return (
    <section aria-labelledby="rp-collab-title" className="relative isolate overflow-hidden bg-[#021336] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_55%_at_50%_62%,rgba(0,205,184,0.07)_0%,transparent_70%)]" />
      <Shell className="flex flex-col items-center py-20 text-center lg:py-24">
        <Eyebrow tone="dark">Research collaboration</Eyebrow>
        <h2 id="rp-collab-title" className={`${h2} mt-6 text-[clamp(2rem,3.6vw,3.15rem)] leading-[1.1]`}>
          Open to meaningful collaboration.
        </h2>
        <p className="mt-5 max-w-[36rem] text-[17px] leading-[1.7] text-white/75 lg:text-[18px]">
          We welcome conversations with researchers, engineers and independent thinkers who are interested in exploring
          fundamental technical questions together.
        </p>
        <Link
          href={CONTACT_HREF}
          className="group mt-9 inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#F8F9FD] px-7 text-[16px] font-medium text-[#021336] outline-none transition-colors duration-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-[#00CDB8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#021336]"
        >
          Start a conversation
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      </Shell>
    </section>
  )
}

