'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * HOW WE BUILD TOGETHER — "Converging contributions".
 *
 * Every contribution is a line. Each line leaves its item and travels toward the centre of the
 * section — blue from the Domain Partner, teal from AshviTech — and the two colours resolve into the
 * same warm light where they meet. That meeting point is the venture: it exists only because both
 * sides feed into it. A single line descends from it to the shared-work statement, which is
 * what the two partners do together once the venture exists.
 *
 * The lines are measured from the real list items (ResizeObserver), so they always start at the
 * bullets whatever the text wraps to. Static unless motion is allowed: then they draw once on view.
 */

const DOMAIN = [
  'Industry expertise and operating knowledge',
  'Understanding of customers and problems',
  'Access to real workflows and validation',
  'Commercial insight and business leadership',
]
const ASHVI = [
  'Product and system architecture',
  'AI-native design and engineering',
  'Prototyping, development and integration',
  'Technical evolution as the business grows',
]

const BLUE = '#6E9BE0'
const TEAL = '#2FE0CC'
const WARM = '#FFF1D6'

type Geo = {
  w: number
  h: number
  left: { x: number; y: number }[]
  right: { x: number; y: number }[]
  node: { x: number; y: number }
  stem: number // y where the descending line reaches the statement
}

/* ───────────── measured geometry (desktop) ───────────── */

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function useConvergence() {
  const stage = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geo | null>(null)

  useIsoLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const measure = () => {
      const s = el.getBoundingClientRect()
      if (!s.width) return
      const pt = (n: Element) => {
        const r = n.getBoundingClientRect()
        return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top }
      }
      const left = [...el.querySelectorAll('[data-dot="left"]')].map(pt)
      const right = [...el.querySelectorAll('[data-dot="right"]')].map(pt)
      const node = el.querySelector('[data-node]')
      const outcome = el.querySelector('[data-outcome]')
      if (!node || !outcome || !left.length) return
      const n = pt(node)
      const oc = outcome.getBoundingClientRect()
      setGeo({ w: s.width, h: s.height, left, right, node: n, stem: oc.top - s.top })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.querySelectorAll('li, [data-outcome]').forEach((n) => ro.observe(n))
    return () => ro.disconnect()
  }, [])

  return { stage, geo }
}

/** One contribution line: out from the bullet, then a smooth fall into the venture node. */
function feed(from: { x: number; y: number }, to: { x: number; y: number }, side: 1 | -1, k: number) {
  const run = Math.abs(to.x - from.x)
  const drop = to.y - from.y
  // leave each bullet almost horizontally, travel most of the way across, then fall into the node
  const c1x = from.x + side * run * (0.62 + k * 0.03)
  const c2x = to.x - side * Math.min(18, run * 0.08)
  const c2y = to.y - drop * (0.42 - k * 0.05)
  return `M${from.x} ${from.y} C${c1x} ${from.y} ${c2x} ${c2y} ${to.x} ${to.y}`
}

/* ───────────── draw-once ───────────── */

function useDrawOnce<T extends Element>() {
  const ref = useRef<T>(null)
  const [state, setState] = useState<'static' | 'armed' | 'drawn'>('static')
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setState('armed')
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          requestAnimationFrame(() => setState('drawn'))
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, state }
}

/* ───────────── component ───────────── */

export function BuildPartnership() {
  const { stage, geo } = useConvergence()
  const { ref, state } = useDrawOnce<HTMLElement>()

  return (
    <section
      ref={ref}
      id="how-we-build-together"
      aria-labelledby="build-partnership-title"
      data-state={state}
      className="group/bp relative isolate scroll-anchor overflow-hidden bg-[#021336] text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_55%_at_18%_58%,rgba(0,56,118,0.45)_0%,transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_55%_at_82%_58%,rgba(0,110,120,0.32)_0%,transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_16%_20%_at_50%_80%,rgba(255,241,214,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto w-full max-w-[1240px] px-6 pb-20 pt-16 sm:px-10 sm:pt-20 lg:px-12">
        <p className="flex items-center gap-3.5 font-mono text-[11.5px] uppercase tracking-[0.22em] text-white/80 sm:text-[12px]">
          <span className="h-px w-7 bg-[#00CDB8]" aria-hidden="true" />
          How we build together
        </p>
        <h2 id="build-partnership-title" className="mt-5 text-balance font-serif text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.08] tracking-[-0.015em]">
          Different strengths. Shared ambition.
        </h2>
        <p className="mt-4 max-w-[52rem] text-[16.5px] leading-[1.65] text-white/78 sm:text-[17.5px]">
          A co-building partnership brings together complementary capabilities around a real opportunity.
        </p>

        {/* ── Desktop / tablet: contributions converge into the venture ── */}
        <div ref={stage} className="relative mt-14 hidden md:block">
          {geo && <ConvergenceLines geo={geo} />}

          <div className="relative grid grid-cols-[1fr_minmax(10rem,22%)_1fr]">
            <Partner side="left" title="The Domain Partner" icon={<PeopleIcon />} items={DOMAIN} />
            <div aria-hidden="true" />
            <Partner side="right" title="AshviTech" icon={<ArchitectureIcon />} items={ASHVI} />
          </div>

          {/* the venture: where both sides meet */}
          <div className="relative mt-5 flex justify-center" aria-hidden="true">
            <VentureNode />
          </div>

          {/* the outcome: explanatory, not interactive */}
          <div className="relative mt-9 flex justify-center">
            <SharedVenture />
          </div>

          <p className="relative mx-auto mt-7 transition-opacity duration-700 group-data-[state=armed]/bp:opacity-0 motion-reduce:transition-none [transition-delay:1700ms] max-w-[48rem] text-balance text-center font-serif text-[19px] leading-[1.5] text-white/92 lg:text-[21px]">
            Shared work: validating the opportunity, shaping the product and defining the venture model.
          </p>
        </div>

        {/* ── Mobile: both lists, then their rails merge into the venture and the statement ── */}
        <div className="mt-10 md:hidden">
          <div className="relative px-6">
            {/* Domain Partner's rail (left) runs the full height; AshviTech's rail (right) runs beside its own list */}
            <span className="absolute bottom-0 left-0 top-1 w-px" style={{ background: `linear-gradient(180deg, ${BLUE}00, ${BLUE}cc 12%, ${BLUE})` }} aria-hidden="true" />
            <MobilePartner title="The Domain Partner" icon={<PeopleIcon />} items={DOMAIN} tone={BLUE} />
            <div className="relative mt-10">
              <span className="absolute -right-6 bottom-0 top-1 w-px" style={{ background: `linear-gradient(180deg, ${TEAL}00, ${TEAL}cc 25%, ${TEAL})` }} aria-hidden="true" />
              <MobilePartner title="AshviTech" icon={<ArchitectureIcon />} items={ASHVI} tone={TEAL} />
            </div>
          </div>
          <MobileMerge />
          <div className="flex justify-center">
            <SharedVenture />
          </div>
          <p className="mt-6 text-center font-serif text-[18px] leading-[1.5] text-white/92">
            Shared work: validating the opportunity, shaping the product and defining the venture model.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ───────────── pieces ───────────── */

function Partner({ side, title, icon, items }: { side: 'left' | 'right'; title: string; icon: ReactNode; items: string[] }) {
  const L = side === 'left'
  return (
    <div className={L ? 'text-right' : 'text-left'}>
      <div className={`flex items-center gap-4 ${L ? 'flex-row-reverse' : ''}`}>
        {icon}
        <h3 className="text-[22px] font-medium tracking-[-0.01em] lg:text-[24px]">{title}</h3>
      </div>
      <span className={`mt-5 block h-px w-full ${L ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-white/25 to-transparent`} aria-hidden="true" />
      <ul className="mt-6 space-y-[18px]">
        {items.map((t) => (
          <li key={t} className={`flex items-center gap-4 text-[16px] leading-[1.45] text-white/88 lg:text-[16.5px] ${L ? 'flex-row-reverse' : ''}`}>
            {/* the bullet is where this contribution's line begins */}
            <span
              data-dot={side}
              aria-hidden="true"
              className="h-[7px] w-[7px] shrink-0 rounded-full ring-[3px] ring-[#021336]"
              style={{ background: L ? BLUE : TEAL }}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The outcome both sides converge on: a quiet tracked label with a fine warm border and a small diamond marker. */
function SharedVenture() {
  return (
    <p
      data-outcome
      className="transition-opacity duration-700 group-data-[state=armed]/bp:opacity-0 motion-reduce:transition-none [transition-delay:1400ms] inline-flex items-center gap-2.5 rounded-full px-4 py-[7px] font-mono text-[11.5px] uppercase tracking-[0.24em] text-[#FFF1D6] ring-1 ring-inset ring-[#FFF1D6]/35"
    >
      <span className="h-[5px] w-[5px] rotate-45 bg-[#FFF1D6]/90" aria-hidden="true" />
      Shared Venture
    </p>
  )
}

function VentureNode() {
  return (
    <span data-node className="relative grid h-[58px] w-[58px] place-items-center transition-opacity duration-700 [transition-delay:1100ms] group-data-[state=armed]/bp:opacity-0 motion-reduce:transition-none">
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,241,214,0.32)_0%,rgba(127,245,232,0.08)_45%,transparent_70%)]" />
      <span className="absolute inset-[13px] rounded-full ring-1 ring-[#FFF1D6]/45" />
      <span className="relative h-[9px] w-[9px] rounded-full bg-[#FFF8EA] shadow-[0_0_10px_2px_rgba(255,241,214,0.45)]" />
    </span>
  )
}

function ConvergenceLines({ geo }: { geo: Geo }) {
  const { w, h, left, right, node, stem } = geo
  return (
    <svg aria-hidden="true" width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 overflow-visible">
      <defs>
        {/* each side's colour resolves into the same warm light at the centre */}
        <linearGradient id="bp2-l" gradientUnits="userSpaceOnUse" x1={left[0]?.x ?? 0} y1="0" x2={node.x} y2="0">
          <stop offset="0" stopColor={BLUE} stopOpacity="1" />
          <stop offset="0.6" stopColor={BLUE} stopOpacity="0.85" />
          <stop offset="1" stopColor={WARM} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="bp2-r" gradientUnits="userSpaceOnUse" x1={right[0]?.x ?? w} y1="0" x2={node.x} y2="0">
          <stop offset="0" stopColor={TEAL} stopOpacity="1" />
          <stop offset="0.6" stopColor={TEAL} stopOpacity="0.85" />
          <stop offset="1" stopColor={WARM} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="bp2-stem" gradientUnits="userSpaceOnUse" x1="0" y1={node.y} x2="0" y2={stem}>
          <stop offset="0" stopColor={WARM} stopOpacity="0.9" />
          <stop offset="1" stopColor={WARM} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="1.25" strokeLinecap="round">
        {left.map((p, k) => (
          <path key={`l${k}`} d={feed(p, node, 1, k)} stroke="url(#bp2-l)" pathLength={1} className="[stroke-dasharray:1] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-[1600ms] ease-[cubic-bezier(.65,0,.25,1)] [transition-delay:var(--d,0ms)] group-data-[state=armed]/bp:[stroke-dashoffset:1] motion-reduce:transition-none" style={{ ['--d' as string]: `${k * 90}ms` }} />
        ))}
        {right.map((p, k) => (
          <path key={`r${k}`} d={feed(p, node, -1, k)} stroke="url(#bp2-r)" pathLength={1} className="[stroke-dasharray:1] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-[1600ms] ease-[cubic-bezier(.65,0,.25,1)] [transition-delay:var(--d,0ms)] group-data-[state=armed]/bp:[stroke-dashoffset:1] motion-reduce:transition-none" style={{ ['--d' as string]: `${k * 90}ms` }} />
        ))}
        <path d={`M${node.x} ${node.y + 16} V${stem}`} stroke="url(#bp2-stem)" pathLength={1} className="[stroke-dasharray:1] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-[1600ms] ease-[cubic-bezier(.65,0,.25,1)] [transition-delay:1300ms] group-data-[state=armed]/bp:[stroke-dashoffset:1] motion-reduce:transition-none" />
      </g>
    </svg>
  )
}

function MobilePartner({ title, icon, items, tone }: { title: string; icon: ReactNode; items: string[]; tone: string }) {
  return (
    <div>
      <div className="flex items-center gap-3.5">
        {icon}
        <h3 className="text-[20px] font-medium">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3.5 text-[16px] leading-[1.5] text-white/88">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone }} aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Mobile: the blue rail and the teal rail meet in the venture node, then descend to the statement. */
function MobileMerge() {
  return (
    <div className="relative mx-auto h-[120px] w-full" aria-hidden="true">
      <svg viewBox="0 0 320 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="bp2-ml" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={BLUE} />
            <stop offset="1" stopColor={WARM} />
          </linearGradient>
          <linearGradient id="bp2-mr" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" stopColor={TEAL} />
            <stop offset="1" stopColor={WARM} />
          </linearGradient>
        </defs>
        <path d="M0.5 0 C0.5 40 160 30 160 62" fill="none" stroke="url(#bp2-ml)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
        <path d="M319.5 0 C319.5 40 160 30 160 62" fill="none" stroke="url(#bp2-mr)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
        <path d="M160 74 V120" fill="none" stroke={WARM} strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-1/2 top-[62px] -translate-x-1/2 -translate-y-1/2">
        <VentureNode />
      </span>
    </div>
  )
}

function PeopleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.4" strokeLinecap="round">
      <circle cx="12" cy="11" r="4.5" />
      <path d="M3.5 26c.8-4.6 4.2-7.5 8.5-7.5s7.7 2.9 8.5 7.5" />
      <circle cx="22.5" cy="12.5" r="3.5" />
      <path d="M21 19.2c3.9-.4 6.8 2.1 7.5 5.8" />
    </svg>
  )
}
function ArchitectureIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 shrink-0" fill="none" stroke={TEAL} strokeWidth="1.4" strokeLinejoin="round">
      <path d="M16 4 28 10 16 16 4 10Z" />
      <path d="m4 16 12 6 12-6" />
      <path d="m4 22 12 6 12-6" />
    </svg>
  )
}
