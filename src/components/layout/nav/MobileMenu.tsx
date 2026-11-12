'use client'

import { useEffect, useRef, type ElementType, type RefObject } from 'react'
import { CONTACT, PURSUITS, SECONDARY } from './navData'
import { NAV_THEME, type NavTheme } from './navTheme'

/**
 * Mobile menu: a full-viewport dialog that replaces the header while open (one logo, never two).
 * Focus moves to Close on open, is trapped inside, and returns to the menu button on close.
 * Esc closes. Background scrolling is locked and restored. Following a link closes the menu.
 */
export function MobileMenu({
  theme,
  open,
  onClose,
  returnFocus,
  activeHref,
  Link,
  logoSrc,
  homeHref = '/',
}: {
  theme: NavTheme
  open: boolean
  onClose: () => void
  returnFocus: RefObject<HTMLElement | null>
  activeHref: string | null
  Link: ElementType
  logoSrc: string
  homeHref?: string
}) {
  const t = NAV_THEME[theme]
  const dialog = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  // scroll lock (with scrollbar compensation) + focus in/out
  useEffect(() => {
    if (!open) return
    const { body, documentElement } = document
    const prev = { overflow: body.style.overflow, pad: body.style.paddingRight }
    const gap = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    closeBtn.current?.focus()
    const back = returnFocus.current
    return () => {
      body.style.overflow = prev.overflow
      body.style.paddingRight = prev.pad
      back?.focus()
    }
  }, [open, returnFocus])

  // Esc + focus trap
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialog.current) return
      const f = [...dialog.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')]
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const ring = `outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.focus}`
  const path = (activeHref || '/').replace(/\/+$/, '') || '/'
  const isActive = (href: string) => {
    if (href.includes('#')) return false
    return path === href || path.startsWith(`${href}/`)
  }

  return (
    <div
      id="mobile-menu"
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain ${t.sheet} motion-safe:animate-[mm-in_180ms_ease-out]`}
    >
      {/* header row — match production 84px bar so logo alignment stays consistent */}
      <div className={`flex h-[84px] shrink-0 items-center justify-between border-b px-6 sm:px-10 ${t.sheetRule}`}>
        <Link href={homeHref} onClick={onClose} aria-label="AshviTech — home" className={`rounded-sm py-2 ${ring}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- official brand PNG; height-only sizing */}
          <img
            src={logoSrc}
            alt="AshviTech"
            width={theme === 'dark' ? 874 : 892}
            height={theme === 'dark' ? 194 : 218}
            className="h-9 w-auto max-w-none object-contain object-left md:h-11"
          />
        </Link>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className={`-mr-2 grid h-11 w-11 place-items-center rounded-full ${t.iconButton} ${ring}`}
        >
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
          </svg>
        </button>
      </div>

      <nav aria-label="Mobile" className="flex flex-1 flex-col px-4 pb-8 pt-5">
        {/* primary: Build and Transform */}
        <ul className="space-y-3">
          {PURSUITS.map((p) => (
            <li key={p.key}>
              <Link
                href={p.href}
                onClick={onClose}
                aria-current={isActive(p.href) ? 'page' : undefined}
                className={`relative flex min-h-[84px] items-center justify-between gap-4 rounded-[16px] border py-4 pl-6 pr-5 ${t.card} ${ring}`}
              >
                <span className={`absolute left-3.5 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-full ${t.accent}`} aria-hidden="true" />
                <span className="pl-2">
                  <span className={`block font-serif text-[25px] leading-tight ${t.rowText}`}>{p.label}</span>
                  <span className={`mt-0.5 block text-[14.5px] leading-snug ${t.text}`}>{p.short}</span>
                </span>
                <Arrow className={t.rowArrow} />
              </Link>
            </li>
          ))}
        </ul>

        {/* secondary */}
        <ul className={`mx-2 mt-5 border-t ${t.sheetRule}`}>
          {SECONDARY.map((l) => (
            <li key={l.href} className={`border-b ${t.sheetRule}`}>
              <Link
                href={l.href}
                onClick={onClose}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={`flex min-h-[60px] items-center justify-between rounded-sm py-2 ${ring}`}
              >
                <span className={`flex items-center gap-3 font-serif text-[23px] ${t.rowText}`}>
                  {isActive(l.href) && <span className="h-1.5 w-1.5 rounded-full bg-[#00CDB8]" aria-hidden="true" />}
                  {l.label}
                </span>
                <Arrow className={t.rowArrow} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Link
            href={CONTACT.href}
            onClick={onClose}
            className={`flex min-h-[56px] items-center justify-between rounded-full px-7 text-[17px] font-semibold transition ${t.cta} ${ring}`}
          >
            {CONTACT.mobileLabel}
            <Arrow className={t.ctaArrow} />
          </Link>
        </div>
      </nav>
    </div>
  )
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  )
}
