import { HORIZON, TERRAIN } from './geometry.generated'

/**
 * Static SVG linework for the Research page (geometry generated at build time by
 * scripts/gen-research-page.mjs). Gradients only — no filters, no runtime maths, no animation.
 */

/** Hero: a mathematical terrain, brightest where it is highest, dissolving to the left and front. */
export function Terrain({ className = '', idPrefix = 'rt', fadeLeft = true }: { className?: string; idPrefix?: string; fadeLeft?: boolean }) {
  const { vb, rows, cols, crest, body, highlights } = TERRAIN
  const id = (s: string) => `${idPrefix}-${s}`
  const lit = highlights.filter((h) => h.p[0] > 40 && h.p[0] < vb.w - 40)
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${vb.w} ${vb.h}`} preserveAspectRatio="xMaxYMax slice" className={className}>
      <defs>
        {/* height colouring: higher on screen = brighter teal */}
        <linearGradient id={id('height')} gradientUnits="userSpaceOnUse" x1="0" y1="130" x2="0" y2="520">
          <stop offset="0" stopColor="#7FF5E8" />
          <stop offset="0.22" stopColor="#00CDB8" />
          <stop offset="0.55" stopColor="#0C7C8E" />
          <stop offset="1" stopColor="#0B3A66" />
        </linearGradient>
        <linearGradient id={id('crest')} gradientUnits="userSpaceOnUse" x1="0" y1="130" x2="0" y2="330">
          <stop offset="0" stopColor="#C9FFF8" />
          <stop offset="0.4" stopColor="#3FE6D4" />
          <stop offset="1" stopColor="#0E7C8C" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={id('body')} gradientUnits="userSpaceOnUse" x1="0" y1="130" x2="0" y2="560">
          <stop offset="0" stopColor="#0BA6A6" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#0A5E78" stopOpacity="0.14" />
          <stop offset="1" stopColor="#021336" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#3FE6D4" stopOpacity="0.28" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('dot')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#B8FFF6" stopOpacity="0.8" />
          <stop offset="0.35" stopColor="#00CDB8" stopOpacity="0.25" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
        </radialGradient>
        {/* concentrate the terrain toward the lower right: fade left, top-left and front */}
        <linearGradient id={id('fx')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.22" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={id('fy')} gradientUnits="userSpaceOnUse" x1="0" y1="380" x2="0" y2="560">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <mask id={id('mx')} maskUnits="userSpaceOnUse" x="0" y="0" width={vb.w} height={vb.h}>
          <rect width={vb.w} height={vb.h} fill={`url(#${id('fx')})`} />
        </mask>
        <mask id={id('my')} maskUnits="userSpaceOnUse" x="0" y="0" width={vb.w} height={vb.h}>
          <rect width={vb.w} height={vb.h} fill={`url(#${id('fy')})`} />
        </mask>
      </defs>

      {lit[0] && <ellipse cx={lit[0].p[0]} cy={lit[0].p[1] + 70} rx="260" ry="150" fill={`url(#${id('glow')})`} />}

      <g mask={fadeLeft ? `url(#${id('mx')})` : undefined}>
        <g mask={`url(#${id('my')})`}>
          <path d={body} fill={`url(#${id('body')})`} />
          <g fill="none" stroke={`url(#${id('height')})`} strokeWidth="0.55">
            {cols.map((c, i) => (
              <path key={i} d={c.d} strokeOpacity={0.26 + 0.22 * c.lateral} />
            ))}
          </g>
          <g fill="none" stroke={`url(#${id('height')})`} strokeWidth="0.7">
            {rows.map((r, i) => (
              <path key={i} d={r.d} strokeOpacity={0.75 - 0.45 * r.depth} />
            ))}
          </g>
        </g>
        <path d={crest} fill="none" stroke={`url(#${id('crest')})`} strokeWidth="5" strokeOpacity="0.14" strokeLinecap="round" />
        <path d={crest} fill="none" stroke={`url(#${id('crest')})`} strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {lit.map((h, i) => (
        <g key={i} opacity={h.strength}>
          <circle cx={h.p[0]} cy={h.p[1]} r={i === 0 ? 22 : 14} fill={`url(#${id('dot')})`} />
          <circle cx={h.p[0]} cy={h.p[1]} r={i === 0 ? 3.4 : 2.6} fill="#F2FFFD" />
        </g>
      ))}
    </svg>
  )
}

/** Long Horizon: a measured plane receding to one point of light. Related to the hero, not a copy. */
export function Horizon({ className = '', idPrefix = 'rh' }: { className?: string; idPrefix?: string }) {
  const { vb, vp, depthLines, rays, arcs } = HORIZON
  const id = (s: string) => `${idPrefix}-${s}`
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${vb.w} ${vb.h}`} preserveAspectRatio="xMaxYMid slice" className={className}>
      <defs>
        <linearGradient id={id('hl')} gradientUnits="userSpaceOnUse" x1="200" y1="0" x2={vb.w} y2="0">
          <stop offset="0" stopColor="#00CDB8" stopOpacity="0" />
          <stop offset={(vp.x - 200) / (vb.w - 200)} stopColor="#C9FFF8" stopOpacity="1" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id={id('vp')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#B8FFF6" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#00CDB8" stopOpacity="0.16" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('fx')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={id('m')} maskUnits="userSpaceOnUse" x="0" y="0" width={vb.w} height={vb.h}>
          <rect width={vb.w} height={vb.h} fill={`url(#${id('fx')})`} />
        </mask>
      </defs>

      <ellipse cx={vp.x} cy={vp.y} rx="320" ry="70" fill={`url(#${id('vp')})`} />
      <g mask={`url(#${id('m')})`} fill="none">
        {arcs.map((d, i) => (
          <path key={i} d={d} stroke="#3FE6D4" strokeOpacity={0.12 + 0.08 * i} strokeWidth="0.7" />
        ))}
        {rays.map((r, i) => (
          <path key={i} d={r.d} stroke="#1FA9B0" strokeOpacity={0.32 - 0.18 * r.w} strokeWidth="0.6" />
        ))}
        {depthLines.map((l, i) => (
          <line key={i} x1="0" x2={vb.w} y1={l.y} y2={l.y} stroke="#1FA9B0" strokeOpacity={0.12 + 0.3 * l.t} strokeWidth="0.6" />
        ))}
        <line x1="0" x2={vb.w} y1={vp.y} y2={vp.y} stroke={`url(#${id('hl')})`} strokeWidth="1.2" />
      </g>
      <circle cx={vp.x} cy={vp.y} r="3" fill="#F2FFFD" />
    </svg>
  )
}
