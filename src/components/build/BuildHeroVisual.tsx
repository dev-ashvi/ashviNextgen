/**
 * BuildHeroVisual — the hero sculpture and its annotations, independent of the hero copy.
 *
 * The sculpture is a replaceable decorative image (`src`). Labels and callout lines are real HTML/SVG,
 * positioned in % of the image box, so they survive any image swap that keeps the same framing.
 * Swap in a transparent render, a different render, or replace <img> with a WebGL canvas later.
 *
 */

export type Callout = {
  label: string
  /** anchor point on the sculpture, % of the image box */
  at: [number, number]
  /** label position, % of the image box (may sit outside 0–100) */
  label_at: [number, number]
  align: 'left' | 'right' | 'center'
}

export const DEFAULT_CALLOUTS: Callout[] = [
  { label: 'Domain Expertise', at: [25.5, 7.7], label_at: [13, -26], align: 'left' },
  { label: 'Engineering Capability', at: [72.6, 8.2], label_at: [86, -30], align: 'right' },
  { label: 'AI-Native Venture', at: [48.8, 89.5], label_at: [48.8, 112], align: 'center' },
]

export function BuildHeroVisual({
  src = '/build-hero-placeholder.webp',
  width = 1160,
  height = 364,
  callouts = DEFAULT_CALLOUTS,
  className = '',
}: {
  src?: string
  width?: number
  height?: number
  callouts?: Callout[]
  className?: string
}) {
  return (
    <figure className={`relative ${className}`} aria-label="Domain expertise and engineering capability converging into an AI-native venture">
      <div className="relative" style={{ aspectRatio: `${width} / ${height}` }}>
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          decoding="async"
          className="absolute inset-0 h-full w-full select-none object-contain [mask-composite:intersect] [mask-image:linear-gradient(180deg,transparent_0%,#000_22%,#000_84%,transparent_100%),linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_22%,#000_84%,transparent_100%),linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
        />

        {/* callout lines (SVG) — continue the leader marks toward the HTML labels */}
        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {callouts.map((c) => {
            const [ax, ay] = c.at
            const [lx, ly] = c.label_at
            const elbowY = c.align === 'center' ? ly - 4 : ly + 10
            const d =
              c.align === 'center'
                ? `M${ax} ${ay} V${elbowY}`
                : `M${ax} ${ay} L${lx + (c.align === 'left' ? 6 : -6)} ${elbowY}`
            return (
              <path
                key={c.label}
                d={d}
                fill="none"
                stroke="#F8F9FD"
                strokeOpacity="0.75"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className={c.align === 'center' ? '' : 'max-sm:hidden'}
              />
            )
          })}
        </svg>
        {callouts.map((c) => (
          <span
            key={`dot-${c.label}`}
            aria-hidden="true"
            className="absolute h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8F9FD]"
            style={{ left: `${c.at[0]}%`, top: `${c.at[1]}%` }}
          />
        ))}

        {/* labels (HTML) */}
        {callouts.map((c) => (
          <figcaption
            key={c.label}
            className={`absolute w-max max-w-[9.5rem] text-[14px] font-medium leading-[1.25] text-white sm:text-[15px] ${
              c.align === 'left'
                ? '-translate-x-full text-right max-sm:!left-0 max-sm:translate-x-0 max-sm:text-left'
                : c.align === 'right'
                  ? 'text-left max-sm:!left-auto max-sm:right-0 max-sm:text-right'
                  : '-translate-x-1/2 text-center'
            }`}
            style={{ left: `${c.label_at[0]}%`, top: `${c.label_at[1]}%` }}
          >
            {c.label}
          </figcaption>
        ))}
      </div>
    </figure>
  )
}
