import { VB, body, cols, crest, floor, floorRays, lightPool, peakFloor, points, rows } from './surface.generated'

/**
 * Ashvi Research — conceptual "experimental landscape".
 * Static SVG generated at build time (scripts/gen-research-surface.mjs).
 * Conceptual artwork only: it does not plot real research results.
 *
 * Layers, back → front:
 *   ambient light → surface volume → depth columns → depth rows → crest → floor grid
 *   → measurement points + leader lines (labels are HTML so they stay readable on mobile)
 */
const LABELS: { key: keyof typeof points; text: string }[] = [
  { key: 'hypothesis', text: 'Hypothesis' },
  { key: 'experimentation', text: 'Experimentation' },
  { key: 'evaluation', text: 'Evaluation' },
]

// Leader geometry (in viewBox units), relative to each point.
const LEADERS = {
  hypothesis: { up: 96, run: 0 }, // vertical up, label to the left
  experimentation: { up: 58, run: 0 },
  evaluation: { up: -46, run: 0 }, // vertical down, label to the right
}

const pct = (x: number, y: number) => ({ left: `${(x / VB.w) * 100}%`, top: `${(y / VB.h) * 100}%` })

export function ResearchLandscape({ className = '' }: { className?: string }) {
  const [hx, hy] = points.hypothesis
  const [ex, ey] = points.experimentation
  const [vx, vy] = points.evaluation

  return (
    <figure className={className} aria-labelledby="rl-caption">
      {/* side margin on small screens leaves room for the labels that hang outside the surface */}
      <div className="relative mx-10 sm:mx-12 lg:mx-0">
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="block h-auto w-full" role="img" aria-labelledby="rl-title rl-desc">
        <title id="rl-title">Conceptual research landscape</title>
        <desc id="rl-desc">
          A fine wireframe surface with two smooth peaks joined by a valley. Points along it are marked Hypothesis,
          Experimentation and Evaluation. Conceptual artwork, not research data.
        </desc>
        <defs>
          {/* height colouring: higher on screen = brighter teal */}
          <linearGradient id="rl-height" gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="440">
            <stop offset="0%" stopColor="#5FF0E0" />
            <stop offset="30%" stopColor="#00CDB8" />
            <stop offset="62%" stopColor="#0F6F86" />
            <stop offset="100%" stopColor="#123A63" />
          </linearGradient>
          <linearGradient id="rl-crest" gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="360">
            <stop offset="0%" stopColor="#B8FFF6" />
            <stop offset="35%" stopColor="#3FE6D4" />
            <stop offset="100%" stopColor="#0E7C8C" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="rl-body" gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="440">
            <stop offset="0%" stopColor="#0BA6A6" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#0A5E78" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#021336" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rl-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00CDB8" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#0A8C98" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#021336" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rl-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3FE6D4" stopOpacity="0.32" />
            <stop offset="40%" stopColor="#00CDB8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00CDB8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rl-dot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7FF5E8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00CDB8" stopOpacity="0" />
          </radialGradient>
          {/* edges dissolve into the environment: left/right and toward the viewer */}
          <linearGradient id="rl-fade-x" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="12%" stopColor="#fff" stopOpacity="1" />
            <stop offset="90%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rl-fade-y" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2="560">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="rl-fade" maskUnits="userSpaceOnUse" x="0" y="0" width={VB.w} height={VB.h}>
            <rect width={VB.w} height={VB.h} fill="url(#rl-fade-x)" />
          </mask>
          <mask id="rl-fade-front" maskUnits="userSpaceOnUse" x="0" y="0" width={VB.w} height={VB.h}>
            <rect width={VB.w} height={VB.h} fill="url(#rl-fade-y)" />
          </mask>
        </defs>

        {/* ambient light: a pool on the floor near the centre, a halo behind the higher peak */}
        <ellipse cx={lightPool[0]} cy={lightPool[1] - 6} rx="190" ry="70" fill="url(#rl-pool)" />
        <circle cx={ex} cy={ey + 40} r="150" fill="url(#rl-halo)" opacity="0.6" />

        <g mask="url(#rl-fade)">
          <g mask="url(#rl-fade-front)">
            {/* volume */}
            <path d={body} fill="url(#rl-body)" />

            {/* depth columns — finer and quieter */}
            <g fill="none" stroke="url(#rl-height)" strokeWidth="0.6">
              {cols.map((c, i) => (
                <path key={i} d={c.d} strokeOpacity={0.3 + 0.28 * Math.sin(Math.PI * c.lateral)} />
              ))}
            </g>
            {/* depth rows — the contour-following lines; nearer rows a little stronger */}
            <g fill="none" stroke="url(#rl-height)" strokeWidth="0.75">
              {rows.map((r, i) => (
                <path key={i} d={r.d} strokeOpacity={0.78 - 0.42 * r.depth} />
              ))}
            </g>

            {/* floor grid in front of the surface */}
            <g fill="none" stroke="#1D6C86">
              {floor.map((f, i) => (
                <path key={i} d={f.d} strokeWidth="0.6" strokeOpacity={0.45 * (1 - f.t)} />
              ))}
              {floorRays.map((d, i) => (
                <path key={i} d={d} strokeWidth="0.5" strokeOpacity="0.22" />
              ))}
            </g>
          </g>

          {/* crest: the surface's luminous silhouette (a soft under-stroke, then the fine line) */}
          <path d={crest} fill="none" stroke="url(#rl-crest)" strokeWidth="6" strokeOpacity="0.18" strokeLinecap="round" />
          <path d={crest} fill="none" stroke="url(#rl-crest)" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* experimentation: dashed drop to the floor */}
        <line x1={ex} y1={ey + 8} x2={peakFloor[0]} y2={peakFloor[1]} stroke="#5FE3D6" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="3 4" />

        {/* leader lines */}
        <g fill="none" stroke="#7FCFCB" strokeOpacity="0.7" strokeWidth="0.9">
          <path d={`M${hx} ${hy - 8} V${hy - LEADERS.hypothesis.up} h-14`} />
          <path d={`M${ex} ${ey - 16} V${ey - LEADERS.experimentation.up} h22`} />
          <path d={`M${vx} ${vy + 8} V${vy - LEADERS.evaluation.up} h22`} />
        </g>

        {/* measurement points */}
        {[points.hypothesis, points.evaluation].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="14" fill="url(#rl-dot)" />
            <circle cx={x} cy={y} r="4.2" fill="#F2FFFD" stroke="#00CDB8" strokeWidth="1" />
          </g>
        ))}
        <g>
          <circle cx={ex} cy={ey} r="34" fill="url(#rl-dot)" />
          <circle cx={ex} cy={ey} r="20" fill="none" stroke="#5FE3D6" strokeOpacity="0.35" strokeWidth="0.8" />
          <circle cx={ex} cy={ey} r="6" fill="#FFFFFF" stroke="#7FF5E8" strokeWidth="1.2" />
        </g>
      </svg>

      {/* labels as HTML: crisp and readable at any size */}
      {LABELS.map(({ key, text }) => {
        const [x, y] = points[key]
        const L = LEADERS[key]
        const ly = y - L.up
        // Hypothesis sits to the left of its leader so it stays clear of the first crest.
        const left = key === 'hypothesis'
        const lx = left ? x - 20 : x + 28
        return (
          <span
            key={key}
            className={`absolute -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/85 sm:text-[11px] sm:tracking-[0.24em] lg:text-[12px] ${left ? '-translate-x-full' : ''}`}
            style={pct(lx, ly)}
          >
            {text}
          </span>
        )
      })}

      </div>
      <figcaption id="rl-caption" className="sr-only">
        Conceptual illustration of a research process — hypothesis, experimentation and evaluation. Not research data.
      </figcaption>
    </figure>
  )
}
