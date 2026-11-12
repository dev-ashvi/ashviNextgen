/** Navigation content — shared by desktop and mobile, light and dark. */

export type NavLink = { label: string; href: string }
export type Pursuit = NavLink & {
  key: 'build' | 'transform'
  /** desktop dropdown description */
  description: string
  /** shorter mobile description */
  short: string
}

export const PURSUITS: Pursuit[] = [
  {
    key: 'build',
    label: 'Build',
    href: '/build',
    description: 'Co-create AI-native ventures with long\u2011term equity.',
    short: 'Co-create AI-native ventures',
  },
  {
    key: 'transform',
    label: 'Transform',
    href: '/transform',
    description: 'Reimagine existing businesses with intelligence and technology.',
    short: 'Reimagine existing businesses',
  },
]

export const WHAT_WE_DO = { label: 'What We Do' }

export const SECONDARY: NavLink[] = [
  { label: 'Our Work', href: '/#our-work' },
  { label: 'Research', href: '/research' },
  { label: 'About', href: '/about' },
]

export const CONTACT = { label: 'Contact', href: '/contact', mobileLabel: 'Start a conversation' }

/** Which top-level item a path belongs to. /build and /transform count as What We Do. */
export function activeSection(path: string): 'what-we-do' | string | null {
  const p = path.replace(/\/+$/, '') || '/'
  if (PURSUITS.some((x) => p === x.href || p.startsWith(x.href + '/'))) return 'what-we-do'
  // Hash destinations (e.g. /#our-work) are not pathname-active.
  const hit = [...SECONDARY, CONTACT].find((x) => {
    if (x.href.includes('#')) return false
    return p === x.href || p.startsWith(x.href + '/')
  })
  return hit ? hit.href : null
}

/** Route → header/menu theme. No OS preference; no scroll-based switching. */
export function themeForPath(path: string): 'light' | 'dark' {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/build' || p.startsWith('/build/')) return 'dark'
  if (p === '/research' || p.startsWith('/research/')) return 'dark'
  if (p === '/about' || p.startsWith('/about/')) return 'dark'
  return 'light'
}
