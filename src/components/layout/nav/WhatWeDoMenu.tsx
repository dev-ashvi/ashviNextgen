'use client'

import { useEffect, useId, useRef, useState, type ElementType, type KeyboardEvent } from 'react'
import { PURSUITS, WHAT_WE_DO } from './navData'
import { NAV_THEME, type NavTheme } from './navTheme'
import { BuildIllustration, TransformIllustration } from './NavIllustrations'

/**
 * Desktop "What We Do" disclosure: a button that opens a panel of two links.
 * Click / Enter / Space toggles · ↓ opens and focuses the first item · ↑↓ move between items ·
 * Esc closes and returns focus to the trigger · outside click or tabbing away closes.
 */
export function WhatWeDoMenu({
  theme,
  active,
  Link,
  onNavigate,
}: {
  theme: NavTheme
  active: boolean
  Link: ElementType
  onNavigate?: () => void
}) {
  const t = NAV_THEME[theme]
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLLIElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const items = () => [...(root.current?.querySelectorAll<HTMLAnchorElement>('[data-ww-item]') ?? [])]

  // outside click
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const close = (refocus: boolean) => {
    setOpen(false)
    if (refocus) trigger.current?.focus()
  }

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      requestAnimationFrame(() => items()[0]?.focus())
    }
  }
  const onPanelKey = (e: KeyboardEvent) => {
    const list = items()
    const i = list.indexOf(document.activeElement as HTMLAnchorElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      list[(i + 1) % list.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (i <= 0) trigger.current?.focus()
      else list[i - 1]?.focus()
    }
  }

  return (
    <li
      ref={root}
      className="relative h-full"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation()
          close(true)
        }
      }}
      onBlur={(e) => {
        if (open && !root.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        className={`group relative flex h-full items-center gap-1.5 rounded-md px-1 text-[15px] font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${t.focus} ${
          active || open ? t.linkActive : t.link
        }`}
      >
        {WHAT_WE_DO.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''} ${active || open ? 'text-[#00CDB8]' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
        <ActiveBar show={active || open} />
      </button>

      {/* panel: anchored under the trigger, offset left so the two rows read from the trigger outward */}
      <div
        id={panelId}
        hidden={!open}
        onKeyDown={onPanelKey}
        className={`absolute left-[-100px] top-[calc(100%+1px)] z-50 w-[560px] origin-top rounded-[22px] border ${t.panel} motion-safe:animate-[ww-in_160ms_ease-out]`}
      >
        <ul className="px-5 py-3">
          {PURSUITS.map((p, i) => (
            <li key={p.key}>
              {i > 0 && <div className={`mx-3 h-px ${t.divider}`} aria-hidden="true" />}
              <Link
                href={p.href}
                data-ww-item
                onClick={() => {
                  setOpen(false)
                  onNavigate?.()
                }}
                className={`group/row my-2 grid grid-cols-[112px_1px_1fr] items-center gap-6 rounded-[14px] px-3 py-4 outline-none transition-colors duration-200 focus-visible:ring-2 ${t.focus} ${t.rowHover}`}
              >
                {p.key === 'build' ? (
                  <BuildIllustration theme={theme} id={`${panelId}-b`} className="h-[88px] w-[112px]" />
                ) : (
                  <TransformIllustration theme={theme} id={`${panelId}-t`} className="h-[88px] w-[112px]" />
                )}
                <span className={`h-[72%] w-px ${t.divider}`} aria-hidden="true" />
                <span>
                  <span className={`flex items-center gap-3 font-serif text-[30px] leading-tight ${t.title}`}>
                    {p.label}
                    <span
                      aria-hidden="true"
                      className={`text-[24px] leading-none transition-transform duration-200 group-hover/row:translate-x-1 motion-reduce:transition-none ${t.arrow}`}
                    >
                      →
                    </span>
                  </span>
                  <span className={`mt-1.5 block max-w-[19.5rem] text-[15px] leading-[1.5] ${t.text}`}>{p.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {/* restrained teal light along the bottom edge */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-[18%] bottom-0 h-px bg-gradient-to-r from-transparent to-transparent ${t.panelGlow}`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[30%] -bottom-3 h-6 rounded-full bg-[#00CDB8]/25 blur-xl"
        />
      </div>
    </li>
  )
}

export function ActiveBar({ show }: { show: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#00CDB8] transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
