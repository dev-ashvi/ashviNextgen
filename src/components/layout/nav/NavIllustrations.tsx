import type { NavTheme } from './navTheme'

/**
 * Small glass-panel illustrations for the What We Do dropdown.
 * Build: two panels joining — two parties creating one venture.
 * Transform: three panels stepping forward — an existing system evolving.
 * Inline SVG, gradients only. `id` must be unique on the page.
 */

function Defs({ id, theme }: { id: string; theme: NavTheme }) {
  const dark = theme === 'dark'
  return (
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={dark ? '#7FE6F0' : '#B8F3EE'} stopOpacity={dark ? 0.55 : 0.85} />
        <stop offset="0.55" stopColor={dark ? '#1F8FA8' : '#6FDCCF'} stopOpacity={dark ? 0.35 : 0.55} />
        <stop offset="1" stopColor={dark ? '#0A5A78' : '#3CC9BA'} stopOpacity={dark ? 0.45 : 0.6} />
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E9FFFC" stopOpacity={dark ? 0.9 : 1} />
        <stop offset="1" stopColor="#5FF0E0" stopOpacity={dark ? 0.7 : 0.9} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#00CDB8" stopOpacity={dark ? 0.55 : 0.4} />
        <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/** A thin glass slab: a face plus a narrow lit side. Points are the face's 4 corners. */
function Slab({ id, pts, depth = 5 }: { id: string; pts: [number, number][]; depth?: number }) {
  const face = pts.map((p) => p.join(',')).join(' ')
  const [, b, c] = pts
  const side = [b, c, [c[0] + depth, c[1] - depth * 0.4], [b[0] + depth, b[1] - depth * 0.4]].map((p) => p.join(',')).join(' ')
  return (
    <g>
      <polygon points={side} fill="#5FF0E0" opacity="0.35" />
      <polygon points={face} fill={`url(#${id}-glass)`} stroke={`url(#${id}-edge)`} strokeWidth="1" strokeLinejoin="round" />
      <line x1={pts[0][0] + 2} y1={pts[0][1] + 2} x2={b[0] - 2} y2={b[1] + 2} stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" />
    </g>
  )
}

export function BuildIllustration({ theme, id = 'nav-ill-build', className = '' }: { theme: NavTheme; id?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <Defs id={id} theme={theme} />
      <ellipse cx="50" cy="82" rx="42" ry="12" fill={`url(#${id}-glow)`} />
      <Slab id={id} pts={[[52, 36], [96, 22], [96, 66], [52, 80]]} />
      <Slab id={id} pts={[[22, 26], [70, 10], [70, 54], [22, 70]]} />
    </svg>
  )
}

export function TransformIllustration({ theme, id = 'nav-ill-transform', className = '' }: { theme: NavTheme; id?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <Defs id={id} theme={theme} />
      <ellipse cx="48" cy="84" rx="44" ry="11" fill={`url(#${id}-glow)`} />
      <Slab id={id} pts={[[70, 14], [104, 22], [104, 64], [70, 56]]} />
      <Slab id={id} pts={[[44, 26], [76, 34], [76, 74], [44, 66]]} />
      <Slab id={id} pts={[[16, 38], [48, 46], [48, 86], [16, 78]]} />
    </svg>
  )
}
