/**
 * Theme tokens — the only thing that differs between light and dark.
 * Every component reads its colours from here; structure and behaviour are shared.
 */
export type NavTheme = 'light' | 'dark'

export const NAV_THEME = {
  dark: {
    // Official white-on-dark lockup (same asset as footer / prior dark chrome)
    logo: '/brand/logo-horizontal-dark.png',
    header: 'bg-[#021336] border-white/[0.07]',
    link: 'text-white/85 hover:text-white',
    linkActive: 'text-white',
    focus: 'focus-visible:ring-[#00CDB8] focus-visible:ring-offset-[#021336]',
    iconButton: 'text-white [@media(hover:hover)]:hover:bg-white/[0.08]',
    // dropdown
    panel:
      'border-[#5B85C0]/40 bg-[linear-gradient(160deg,rgba(14,48,96,0.96)_0%,rgba(5,26,62,0.97)_60%,rgba(4,22,54,0.98)_100%)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]',
    panelGlow: 'via-[#00CDB8]',
    rowHover: 'hover:bg-white/[0.04] focus-visible:bg-white/[0.05]',
    divider: 'bg-[#5B85C0]/30',
    title: 'text-white',
    text: 'text-[#C7D3E6]',
    arrow: 'text-[#00CDB8]',
    // mobile
    sheet: 'bg-[#021336] bg-[radial-gradient(ellipse_80%_45%_at_100%_100%,rgba(0,205,184,0.14)_0%,transparent_70%),radial-gradient(ellipse_90%_60%_at_0%_0%,rgba(0,56,118,0.45)_0%,transparent_70%)]',
    sheetRule: 'border-[#5B85C0]/30',
    card: 'border-[#5B85C0]/25 bg-[linear-gradient(135deg,rgba(18,52,100,0.55)_0%,rgba(8,32,72,0.45)_100%)] active:bg-[#0A2A5A]',
    accent: 'bg-[#00CDB8]',
    rowText: 'text-white',
    rowArrow: 'text-white/85',
    cta: 'border border-[#00CDB8]/70 bg-[#041A40] text-white shadow-[0_0_0_1px_rgba(0,205,184,0.08),0_12px_30px_-14px_rgba(0,205,184,0.5)] hover:bg-[#062352]',
    ctaArrow: 'text-[#00CDB8]',
  },
  light: {
    // Official navy-on-light lockup
    logo: '/brand/logo-horizontal-light.png',
    header: 'bg-[#F8F9FD]/[0.94] border-[#021336]/[0.08] supports-[backdrop-filter]:backdrop-blur-xl',
    link: 'text-[#021336]/80 hover:text-[#021336]',
    linkActive: 'text-[#021336]',
    focus: 'focus-visible:ring-[#00A896] focus-visible:ring-offset-[#F8F9FD]',
    iconButton: 'text-[#021336] [@media(hover:hover)]:hover:bg-[#021336]/[0.06]',
    panel:
      'border-white bg-[linear-gradient(160deg,rgba(255,255,255,0.97)_0%,rgba(240,246,252,0.97)_100%)] shadow-[0_30px_70px_-28px_rgba(2,19,54,0.35),0_0_0_1px_rgba(2,19,54,0.06)]',
    panelGlow: 'via-[#00CDB8]',
    rowHover: 'hover:bg-[#00CDB8]/[0.05] focus-visible:bg-[#00CDB8]/[0.07]',
    divider: 'bg-[#021336]/[0.12]',
    title: 'text-[#021336]',
    text: 'text-[#4A5873]',
    arrow: 'text-[#00B8A4]',
    sheet: 'bg-[#F3F7FC] bg-[radial-gradient(ellipse_80%_40%_at_100%_100%,rgba(0,205,184,0.16)_0%,transparent_70%),radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(185,204,230,0.45)_0%,transparent_70%)]',
    sheetRule: 'border-[#021336]/[0.1]',
    card: 'border-white bg-[linear-gradient(135deg,rgba(227,244,246,0.95)_0%,rgba(236,244,251,0.9)_100%)] shadow-[0_8px_24px_-16px_rgba(2,19,54,0.25)] active:bg-[#DDF1F2]',
    accent: 'bg-[#00CDB8]',
    rowText: 'text-[#021336]',
    rowArrow: 'text-[#021336]/80',
    cta: 'bg-[linear-gradient(100deg,#0A8C8E_0%,#075E73_100%)] text-white shadow-[0_14px_30px_-14px_rgba(0,122,110,0.65)] hover:brightness-110',
    ctaArrow: 'text-[#5FF0E0]',
  },
} as const

/** Contact pill — teal in both themes, as in the references. */
export const CONTACT_PILL =
  'bg-[#00CDB8] text-[#021336] hover:bg-[#2FE0CC] shadow-[0_8px_24px_-12px_rgba(0,205,184,0.7)]'
