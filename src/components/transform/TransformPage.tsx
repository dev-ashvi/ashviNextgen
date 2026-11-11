import type { ReactNode } from 'react'
import { OperatingSystemVisual, OS_MARKER_X } from './OperatingSystemVisual'
import { TRANSFORM_HERO_GRADIENT, TransformHeroVisual } from './TransformHeroVisual'

/**
 * /transform — Reimagine how your business works.
 * Light→dark hero · light editorial · dark operating system · light process · light principles · dark close.
 * Header and footer come from the host layout.
 */

const CONTACT_HREF = '/contact?interest=transform'

export function TransformPage() {
  return (
    <div className="bg-[#F8F9FD] text-[#021336]">
      <TransformHero />
      <BeyondAutomation />
      <WhereWeLook />
      <TransformApproach />
      <PartnershipApproach />
      <TransformClosing />
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

function Arrow({ dir = 'right' }: { dir?: 'right' | 'down' }) {
  return (
    <span
      aria-hidden="true"
      className={`transition-transform duration-500 motion-reduce:transition-none ${dir === 'right' ? 'group-hover:translate-x-1' : 'group-hover:translate-y-0.5'}`}
    >
      {dir === 'right' ? '→' : '↓'}
    </span>
  )
}

/* ───────────────────────── 01 Hero ───────────────────────── */

function TransformHero() {
  return (
    <section aria-labelledby="tr-hero-title" className="relative isolate overflow-hidden" style={{ background: TRANSFORM_HERO_GRADIENT }}>
      {/* the gradient is only meaningful beside the artwork; on small screens the hero is light, the art below */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#F5F7FC] lg:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-1/3 bg-[linear-gradient(180deg,transparent,rgba(2,19,54,0.10))] lg:block" />

      <TransformHeroVisual className="absolute bottom-0 right-[-8%] hidden w-[66%] lg:block" />

      <Shell className="relative pb-12 pt-[120px] lg:min-h-[540px] lg:pb-14 lg:pt-[132px]">
        <div className="max-w-[32rem] lg:max-w-[31rem]">
          <Eyebrow>AshviTech / Transform</Eyebrow>
          <h1 id="tr-hero-title" className={`${serif} mt-6 text-[clamp(2.5rem,4.3vw,3.85rem)] leading-[1.04] text-[#021336] lg:w-[36rem]`}>
            Reimagine how your business works.
          </h1>
          <p className="mt-6 text-[16.5px] leading-[1.65] text-[#021336]/78 sm:text-[17.5px]">
            We partner with existing businesses to rethink operations, redesign workflows and build intelligent systems around the
            realities of how they work.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={CONTACT_HREF}
              className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#021336] px-7 text-[15.5px] font-medium text-white outline-none transition-colors duration-300 hover:bg-[#003876] focus-visible:ring-2 focus-visible:ring-[#00CDB8] focus-visible:ring-offset-4"
            >
              Discuss a transformation <Arrow />
            </a>
            <a
              href="#our-approach"
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-sm text-[15.5px] font-medium text-[#021336] outline-none hover:text-[#003876] focus-visible:ring-2 focus-visible:ring-[#00CDB8]"
            >
              Explore our approach <Arrow dir="down" />
            </a>
          </div>
        </div>
      </Shell>

      {/* small screens: the sculpture follows the content, never behind it */}
      <TransformHeroVisual className="block w-full lg:hidden" />
    </section>
  )
}

/* ───────────────────────── 02 Beyond automation ───────────────────────── */

function BeyondAutomation() {
  return (
    <section aria-labelledby="tr-beyond-title" className="border-b border-[#021336]/[0.08] bg-[#F8F9FD]">
      <Shell className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[0.9fr_1px_1.1fr] lg:gap-14">
        <div>
          <Eyebrow>Beyond automation</Eyebrow>
          <h2 id="tr-beyond-title" className={`${serif} mt-5 text-balance text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.1]`}>
            The biggest opportunity may not be doing the same work faster.
          </h2>
        </div>
        <span className="hidden bg-[#021336]/[0.12] lg:block" aria-hidden="true" />
        <div className="space-y-4 text-[16.5px] leading-[1.7] text-[#021336]/78 lg:pt-8 lg:text-[17px]">
          <p>
            Businesses evolve around the tools, processes and constraints available to them. Over time, workarounds become
            workflows, and workflows become the way things have always been done.
          </p>
          <p>
            Intelligent technology creates an opportunity to revisit those assumptions. Not just to automate individual tasks, but
            to reconsider how information flows, how decisions are made and how people and systems work together.
          </p>
          <p className="pt-2 text-[17.5px] font-semibold leading-[1.5] text-[#021336] lg:text-[18px]">
            The goal isn’t more automation. It’s a better way to operate.
          </p>
        </div>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 03 Where we look ───────────────────────── */

const DIMENSIONS = [
  { n: '01', t: 'Workflows', d: 'How work moves between people, teams and systems.', side: 'left', row: 0 },
  { n: '02', t: 'Decisions', d: 'How information becomes timely, reliable action.', side: 'right', row: 0 },
  { n: '03', t: 'Knowledge', d: 'How expertise is captured, accessed and applied.', side: 'left', row: 1 },
  { n: '04', t: 'Operations', d: 'How processes are monitored, coordinated and improved.', side: 'right', row: 1 },
] as const

const MARKER_Y: [number, number] = [104, 262] // viewBox units; must match the stage layout below

function Dimension({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div>
      <h3 className="flex items-baseline gap-3.5">
        <span className="font-mono text-[17px] text-[#00CDB8]">{n}</span>
        <span className={`${serif} text-[26px] leading-tight text-white`}>{t}</span>
      </h3>
      <p className="mt-2 text-[15.5px] leading-[1.55] text-white/75">{d}</p>
    </div>
  )
}

function WhereWeLook() {
  return (
    <section aria-labelledby="tr-where-title" className="relative isolate overflow-hidden bg-[#021336] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#041a3f_0%,#021336_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_55%_at_50%_62%,rgba(0,56,118,0.55)_0%,transparent_72%)]" />
      </div>
      <Shell className="py-16 sm:py-20">
        <Eyebrow tone="dark">Where we look for opportunity</Eyebrow>
        <h2 id="tr-where-title" className={`${serif} mt-5 text-balance text-[clamp(2rem,3.6vw,3rem)] leading-[1.08]`}>
          Intelligence across the way a business operates.
        </h2>

        {/* desktop: the four dimensions arranged around one layered system */}
        <div className="relative mx-auto -mb-16 -mt-2 hidden aspect-[1000/420] w-full max-w-[1144px] lg:block">
          <OperatingSystemVisual idPrefix="osd" markerY={MARKER_Y} className="absolute inset-0 h-full w-full" />
          {DIMENSIONS.map((x) => {
            const y = (MARKER_Y[x.row] / 420) * 100
            const left = x.side === 'left'
            return (
              <div
                key={x.n}
                className="absolute w-max max-w-[17rem] -translate-y-[22px]"
                style={
                  left
                    ? { right: `${100 - (OS_MARKER_X[0] / 1000) * 100 + 1.6}%`, top: `${y}%` }
                    : { left: `${(OS_MARKER_X[1] / 1000) * 100 + 1.6}%`, top: `${y}%` }
                }
              >
                <Dimension {...x} />
              </div>
            )
          })}
        </div>

        {/* smaller screens: the system, then the four dimensions */}
        <div className="lg:hidden">
          <OperatingSystemVisual idPrefix="osm" connectors={false} className="mx-auto my-8 block w-full max-w-[420px]" />
          <div className="mt-2 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {[DIMENSIONS[0], DIMENSIONS[1], DIMENSIONS[2], DIMENSIONS[3]].map((x) => (
              <div key={x.n} className="border-l border-[#00CDB8]/40 pl-5">
                <Dimension {...x} />
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 04 Approach ───────────────────────── */

const STAGES = [
  { n: '01', t: 'Discover', d: 'Understand existing workflows, systems, constraints and operational goals.' },
  { n: '02', t: 'Identify', d: 'Find opportunities where a redesigned process or intelligent capability could create meaningful value.' },
  { n: '03', t: 'Redesign', d: 'Define how people, systems and decisions should interact in the improved operating model.' },
  { n: '04', t: 'Engineer', d: 'Develop and integrate the required capabilities, validating them in real business conditions.' },
  { n: '05', t: 'Evolve', d: 'Evaluate results, refine the system and expand where the evidence supports it.' },
] as const

/**
 * One layer of the blueprint. Each stage refines the same plane:
 * Discover — the existing outline, traced · Identify — opportunities marked · Redesign — a new structure drawn ·
 * Engineer — built: connected nodes and real thickness · Evolve — the working, lit system.
 */
function BlueprintLayer({ i, className = '' }: { i: number; className?: string }) {
  const W = 240, H = 92, cx = 120, cy = 40, a = 100, b = 32
  const P = (u: number, v: number): [number, number] => [cx - a + (u + v) * a, cy + (v - u) * b]
  const face = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)].map((p) => p.join(',')).join(' ')
  const grid: string[] = []
  for (let k = 1; k < 4; k++) {
    const t = k / 4
    const [a1, a2, b1, b2] = [P(t, 0), P(t, 1), P(0, t), P(1, t)]
    grid.push(`M${a1}L${a2}`, `M${b1}L${b2}`)
  }
  const teal = '#00A896'
  const cell = (u: number, v: number) =>
    [P(u, v), P(u + 0.25, v), P(u + 0.25, v + 0.25), P(u, v + 0.25)].map((p) => p.join(',')).join(' ')
  const nodes = [P(0.25, 0.5), P(0.5, 0.75), P(0.75, 0.25), P(0.5, 0.25)]
  // Subtle contrast lift only — geometry and progression unchanged.
  const faceStrokeOpacity = i === 0 ? 0.52 : i === 1 ? 0.88 : i === 4 ? 0.92 : 0.86
  const gridStrokeOpacity = i === 4 ? 0.58 : 0.48
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true">
      {i >= 3 && (
        <>
          <polygon points={[P(0, 1), P(1, 1), [P(1, 1)[0], P(1, 1)[1] + 6], [P(0, 1)[0], P(0, 1)[1] + 6]].map((p) => p.join(',')).join(' ')} fill="#7FD9CF" fillOpacity={i === 4 ? 0.58 : 0.34} />
          <polygon points={[P(1, 1), P(1, 0), [P(1, 0)[0], P(1, 0)[1] + 6], [P(1, 1)[0], P(1, 1)[1] + 6]].map((p) => p.join(',')).join(' ')} fill="#4FC9BC" fillOpacity={i === 4 ? 0.48 : 0.26} />
        </>
      )}
      <polygon
        points={face}
        fill={i === 4 ? `url(#bl-lit-${i})` : i >= 2 ? '#E7F6F4' : '#F8F9FD'}
        fillOpacity={i === 0 ? 0 : 1}
        stroke={i === 0 ? '#021336' : teal}
        strokeOpacity={faceStrokeOpacity}
        strokeWidth={i === 0 ? 1.15 : 1.1}
        strokeDasharray={i === 0 ? '4 4' : undefined}
      />
      {i === 1 && [cell(0.25, 0.5), cell(0.5, 0.0), cell(0.75, 0.5)].map((c, k) => <polygon key={k} points={c} fill={teal} fillOpacity="0.28" stroke={teal} strokeOpacity="0.78" strokeWidth="0.95" />)}
      {i >= 2 && (
        <g stroke={teal} strokeOpacity={gridStrokeOpacity} strokeWidth="0.85">
          {grid.map((d, k) => (
            <path key={k} d={d} />
          ))}
        </g>
      )}
      {i >= 3 && (
        <g>
          <path d={`M${nodes[0]}L${nodes[1]}L${nodes[2]}L${nodes[3]}Z`} fill="none" stroke={teal} strokeWidth="1.1" strokeOpacity="0.9" />
          {nodes.map((p, k) => (
            <circle key={k} cx={p[0]} cy={p[1]} r="2.6" fill={i === 4 ? '#E9FFFC' : teal} stroke={i === 4 ? teal : 'none'} strokeWidth="1.1" />
          ))}
        </g>
      )}
      <defs>
        <linearGradient id={`bl-lit-${i}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#C9F1EB" />
          <stop offset="1" stopColor="#7FD9CF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function TransformApproach() {
  return (
    <section id="our-approach" aria-labelledby="tr-approach-title" className="scroll-mt-24 border-b border-[#021336]/[0.08] bg-[#F8F9FD]">
      <Shell className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start lg:pt-2">
          <Eyebrow>Our approach</Eyebrow>
          <h2 id="tr-approach-title" className={`${serif} mt-5 text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.1]`}>
            Understand the work.
            <br />
            Redesign the system.
          </h2>
        </div>

        {/* five stages, each paired with the same operating plane at its stage of refinement */}
        <ol className="relative">
          {/* the spine through the five milestones */}
          <span className="absolute bottom-10 left-[18px] top-9 w-px bg-[linear-gradient(180deg,rgba(0,168,150,0.25),rgba(0,168,150,0.7))]" aria-hidden="true" />
          {STAGES.map((s, i) => (
            <li key={s.n} className="relative grid grid-cols-[auto_1fr] gap-x-5 border-t border-[#021336]/[0.08] py-5 first:border-t-0 first:pt-0 sm:grid-cols-[auto_1fr_8.5rem] lg:grid-cols-[auto_1fr_12rem]">
              <span className="relative mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-[#F8F9FD] font-mono text-[12px] text-[#007A6E] ring-1 ring-inset ring-[#00A896]/55">
                {s.n}
              </span>
              <div>
                <h3 className={`${serif} text-[23px] leading-tight`}>{s.t}</h3>
                <p className="mt-1.5 max-w-[30rem] text-[15.5px] leading-[1.6] text-[#021336]/72">{s.d}</p>
              </div>
              <BlueprintLayer i={i} className="col-start-2 mt-3 w-[9rem] sm:col-start-3 sm:mt-0 sm:w-full sm:self-center" />
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 05 Partnership approach ───────────────────────── */

const PRINCIPLES = [
  { t: 'Operational Continuity', d: 'Changes must account for existing operations and dependencies.' },
  { t: 'Human Oversight', d: 'People should retain appropriate visibility and control over important decisions.' },
  { t: 'Measurable Improvement', d: 'Technology should be evaluated against meaningful business outcomes.' },
] as const

function PartnershipApproach() {
  return (
    <section aria-labelledby="tr-partner-title" className="bg-[#F8F9FD]">
      <Shell className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1px_1.1fr] lg:gap-14">
          <div>
            <Eyebrow>Our partnership approach</Eyebrow>
            <h2 id="tr-partner-title" className={`${serif} mt-5 text-balance text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.1]`}>
              Technology has to work in the business you already have.
            </h2>
          </div>
          <span className="hidden bg-[#021336]/[0.12] lg:block" aria-hidden="true" />
          <div className="space-y-4 text-[16.5px] leading-[1.7] text-[#021336]/78 lg:pt-8 lg:text-[17px]">
            <p>Existing businesses have real customers, established systems, operational responsibilities and people whose work depends on them.</p>
            <p>
              We approach transformation with those realities in mind—working alongside business teams, integrating where
              appropriate and introducing new capabilities in a way that can be evaluated and improved.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid border-t border-[#021336]/[0.14] sm:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <li key={p.t} className={`py-7 sm:pr-8 ${i > 0 ? 'border-t border-[#021336]/[0.1] sm:border-l sm:border-t-0 sm:pl-8' : ''}`}>
              <span className="block h-[3px] w-6 bg-[#00CDB8]" aria-hidden="true" />
              <h3 className={`${serif} mt-5 text-[22px] leading-tight`}>{p.t}</h3>
              <p className="mt-2 text-[15.5px] leading-[1.6] text-[#021336]/72">{p.d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 border-t border-[#021336]/[0.08] pt-6 text-[14.5px] italic leading-[1.6] text-[#021336]/60">
          Every engagement is shaped around the opportunity, operating requirements and scope of work.
        </p>
      </Shell>
    </section>
  )
}

/* ───────────────────────── 06 Closing ───────────────────────── */

/**
 * Faint architectural outlines framing the invitation: scattered panels on the left, aligned panels on the
 * right — the hero's fragmentation-to-structure idea, reduced to linework.
 */
function ClosingLinework() {
  const left = [
    [40, 70, 70, 46, -8],
    [120, 40, 54, 64, 6],
    [70, 140, 60, 40, 10],
    [170, 110, 46, 56, -5],
    [10, 190, 52, 44, 4],
  ]
  const right = [
    [1010, 70, 80, 116],
    [1046, 96, 80, 116],
    [1082, 122, 80, 116],
  ]
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
      <defs>
        <linearGradient id="tc-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7FA8C8" stopOpacity="0.35" />
          <stop offset="0.45" stopColor="#3FE6D4" stopOpacity="0.25" />
          <stop offset="0.55" stopColor="#3FE6D4" stopOpacity="0.25" />
          <stop offset="1" stopColor="#3FE6D4" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="tc-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id="tc-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="300">
          <rect width="1200" height="300" fill="url(#tc-fade)" />
        </mask>
      </defs>
      <g mask="url(#tc-mask)" fill="none" strokeWidth="0.9">
        {left.map(([x, y, w, h, r], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" stroke="#7FA8C8" strokeOpacity="0.32" transform={`rotate(${r} ${x + w / 2} ${y + h / 2})`} />
        ))}
        {right.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" stroke="#3FE6D4" strokeOpacity={0.3 + i * 0.12} />
        ))}
        {/* the same thread passing from the scattered side to the ordered side, below the copy */}
        <path d="M0 248 C300 262 520 236 600 236 S900 214 1200 196" stroke="url(#tc-line)" strokeWidth="1" />
        <path d="M0 264 C320 272 520 250 600 250 S920 236 1200 226" stroke="url(#tc-line)" strokeOpacity="0.6" />
      </g>
    </svg>
  )
}

function TransformClosing() {
  return (
    <section aria-labelledby="tr-cta-title" className="relative isolate overflow-hidden bg-[#021336] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_42%_60%_at_50%_62%,rgba(0,56,118,0.45)_0%,transparent_72%)]" />
      <ClosingLinework />
      <Shell className="flex flex-col items-center py-16 text-center sm:py-20">
        <Eyebrow tone="dark" center>
          Transform with AshviTech
        </Eyebrow>
        <h2 id="tr-cta-title" className={`${serif} mt-5 text-balance text-[clamp(2.1rem,4vw,3.25rem)] leading-[1.08]`}>
          What could your business become?
        </h2>
        <p className="mt-4 max-w-[44rem] text-[16.5px] leading-[1.65] text-white/80 sm:text-[17.5px]">
          If you see an opportunity to rethink how your business operates, we’d like to explore it with you.
        </p>
        <a
          href={CONTACT_HREF}
          className="group mt-8 inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#F8F9FD] px-7 text-[15.5px] font-medium text-[#021336] outline-none transition-colors duration-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-[#00CDB8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#021336]"
        >
          Start a conversation <Arrow />
        </a>
      </Shell>
    </section>
  )
}
