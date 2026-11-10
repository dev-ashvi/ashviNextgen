/**
 * OperatingSystemVisual — three translucent planes in isometric perspective: a business operating as
 * one layered system. Native SVG: every plane, grid line, node and connector is editable geometry.
 *
 * viewBox 1000 × 420. Planes are centred on x = 500. `connectors` draws the fine lines out to the four
 * dimension markers (OS_MARKER_X at the given y values); turn it off for stacked layouts.
 */

const VB = { w: 1000, h: 420 }
const CX = 500
const A = 150 // half-width of a plane
const B = 56 // half-depth (isometric)
const SLAB = 7 // glass thickness
export const PLANE_Y = [132, 206, 280] as const
/** x of the left and right dimension markers, in viewBox units */
export const OS_MARKER_X = [255, 745] as const

type P = [number, number]
const pt = (cy: number, u: number, v: number): P => [CX - A + (u + v) * A, cy + (v - u) * B]
// u runs left → top, v runs left → bottom
const poly = (pts: P[]) => pts.map((p) => p.map((n) => Math.round(n * 10) / 10).join(',')).join(' ')

function Plane({ cy, level, px }: { cy: number; level: number; px: string }) {
  const top = pt(cy, 1, 0)
  const right = pt(cy, 1, 1)
  const bottom = pt(cy, 0, 1)
  const left = pt(cy, 0, 0)
  const grid: string[] = []
  for (let k = 1; k < 5; k++) {
    const t = k / 5
    const a1 = pt(cy, t, 0), a2 = pt(cy, t, 1)
    const b1 = pt(cy, 0, t), b2 = pt(cy, 1, t)
    grid.push(`M${a1[0]} ${a1[1]}L${a2[0]} ${a2[1]}`, `M${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}`)
  }
  // a few lit intersections per plane (deterministic, different on each level)
  const nodes: P[] = [
    [[0.4, 0.6], [0.8, 0.4], [0.6, 0.8]],
    [[0.2, 0.4], [0.6, 0.6], [0.8, 0.2]],
    [[0.4, 0.4], [0.6, 0.2], [0.2, 0.8]],
  ][level].map(([u, v]) => pt(cy, u, v))
  const glow = 0.55 + level * 0.2 // the foundation layer is lit most strongly
  return (
    <g>
      {/* slab edges */}
      <polygon points={poly([left, bottom, [bottom[0], bottom[1] + SLAB], [left[0], left[1] + SLAB]])} fill={`url(#${px}-edge-l)`} />
      <polygon points={poly([bottom, right, [right[0], right[1] + SLAB], [bottom[0], bottom[1] + SLAB]])} fill={`url(#${px}-edge-r)`} />
      {/* surface */}
      <polygon points={poly([left, top, right, bottom])} fill={`url(#${px}-face)`} fillOpacity={0.62 + level * 0.14} />
      <polygon points={poly([left, top, right, bottom])} fill={`url(#${px}-inner)`} opacity={glow} />
      <g stroke="#E9FFFC" strokeOpacity="0.3" strokeWidth="0.8">
        {grid.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <polygon points={poly([left, top, right, bottom])} fill="none" stroke={`url(#${px}-rim)`} strokeWidth="1.2" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill={`url(#${px}-node)`} />
          <circle cx={x} cy={y} r="2.2" fill="#E9FFFC" />
        </g>
      ))}
    </g>
  )
}

export function OperatingSystemVisual({
  idPrefix: px = 'os',
  connectors = true,
  markerY = [96, 252],
  className = '',
}: {
  /** unique per instance on a page — SVG gradient ids are document-global */
  idPrefix?: string
  connectors?: boolean
  /** y of the upper and lower dimension markers (same on both sides) */
  markerY?: [number, number]
  className?: string
}) {
  const [y1, y2] = markerY
  const L = OS_MARKER_X[0]
  const R = OS_MARKER_X[1]
  const [p0, , p2] = PLANE_Y
  const lv = (cy: number) => pt(cy, 0, 0)
  const rv = (cy: number) => pt(cy, 1, 1)
  return (
    // without connectors, crop to the stack itself so it stays substantial on narrow screens
    <svg viewBox={connectors ? `0 0 ${VB.w} ${VB.h}` : `${CX - A - 30} ${PLANE_Y[0] - B - 30} ${2 * A + 60} ${PLANE_Y[2] - PLANE_Y[0] + 2 * B + 110}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${px}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CFEFF5" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#5FB8C8" stopOpacity="0.38" />
          <stop offset="1" stopColor="#1FC9B8" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`${px}-inner`} cx="55%" cy="60%" r="60%">
          <stop offset="0" stopColor="#7FF5E8" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#00CDB8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${px}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B8FFF6" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#E9FFFC" stopOpacity="0.95" />
          <stop offset="1" stopColor="#7FF5E8" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`${px}-edge-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3FA6B4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7FF5E8" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`${px}-edge-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7FF5E8" stopOpacity="0.6" />
          <stop offset="1" stopColor="#2A8C9A" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`${px}-node`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7FF5E8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${px}-pool`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#00CDB8" stopOpacity="0.32" />
          <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${px}-conn-l`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3FE6D4" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3FE6D4" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`${px}-conn-r`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#3FE6D4" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3FE6D4" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* light gathered beneath the stack */}
      <ellipse cx={CX} cy={PLANE_Y[2] + 70} rx="230" ry="60" fill={`url(#${px}-pool)`} />

      {/* vertical ties between layers: the layers are one system */}
      <g stroke="#7FF5E8" strokeOpacity="0.4" strokeWidth="0.8">
        {[
          [0.6, 0.8],
          [0.8, 0.4],
          [0.4, 0.4],
        ].map(([u, v], i) => {
          const a = pt(PLANE_Y[0], u, v)
          return <line key={i} x1={a[0]} y1={a[1]} x2={a[0]} y2={a[1] + (PLANE_Y[2] - PLANE_Y[0])} />
        })}
      </g>

      {/* draw bottom → top so upper planes sit in front */}
      {[2, 1, 0].map((i) => (
        <Plane key={i} cy={PLANE_Y[i]} level={2 - i} px={px} />
      ))}

      {connectors && (
        <g fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
          {/* left: Workflows → top plane, Knowledge → bottom plane; right mirrors */}
          <path d={`M${L} ${y1} C${L + 90} ${y1} ${lv(p0)[0] - 70} ${lv(p0)[1]} ${lv(p0)[0] + 8} ${lv(p0)[1]}`} stroke={`url(#${px}-conn-l)`} />
          <path d={`M${L} ${y2} C${L + 90} ${y2} ${lv(p2)[0] - 70} ${lv(p2)[1]} ${lv(p2)[0] + 8} ${lv(p2)[1]}`} stroke={`url(#${px}-conn-l)`} />
          <path d={`M${R} ${y1} C${R - 90} ${y1} ${rv(p0)[0] + 70} ${rv(p0)[1]} ${rv(p0)[0] - 8} ${rv(p0)[1]}`} stroke={`url(#${px}-conn-r)`} />
          <path d={`M${R} ${y2} C${R - 90} ${y2} ${rv(p2)[0] + 70} ${rv(p2)[1]} ${rv(p2)[0] - 8} ${rv(p2)[1]}`} stroke={`url(#${px}-conn-r)`} />
          {[
            [L, y1],
            [L, y2],
            [R, y1],
            [R, y2],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill={`url(#${px}-node)`} />
              <circle cx={x} cy={y} r="2.6" fill="#E9FFFC" />
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}
