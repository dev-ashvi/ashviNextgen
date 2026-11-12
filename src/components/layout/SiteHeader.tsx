"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MobileMenu } from "@/components/layout/nav/MobileMenu";
import { ActiveBar, WhatWeDoMenu } from "@/components/layout/nav/WhatWeDoMenu";
import {
  CONTACT,
  SECONDARY,
  activeSection,
  themeForPath,
} from "@/components/layout/nav/navData";
import { CONTACT_PILL, NAV_THEME } from "@/components/layout/nav/navTheme";
import { cn } from "@/lib/utils";

/**
 * Production SiteHeader — Claude's approved navigation visuals + themes,
 * with the existing portal / scroll-lock / focus infrastructure preserved (C1).
 *
 * Theme is route-driven only (no OS preference, no scroll switching).
 */
export function SiteHeader() {
  const pathname = usePathname() || "/";
  const theme = themeForPath(pathname);
  const t = NAV_THEME[theme];
  const section = activeSection(pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Body scroll lock while the mobile menu is open (C1 regression + unmount cleanup).
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const ring = `outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.focus}`;

  const mobileMenu = (
    <MobileMenu
      theme={theme}
      open={menuOpen}
      onClose={closeMenu}
      returnFocus={menuButtonRef}
      activeHref={pathname}
      Link={Link}
      logoSrc={t.logo}
    />
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b",
          t.header,
        )}
      >
        <div className="mx-auto flex h-[84px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 min-[1500px]:max-w-[1480px]">
          <Link
            href="/"
            aria-label="AshviTech — home"
            className={cn("shrink-0 rounded-sm py-2", ring)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- official brand PNG; height-only, never stretch */}
            <img
              src={t.logo}
              alt="AshviTech"
              width={theme === "dark" ? 874 : 892}
              height={theme === "dark" ? 194 : 218}
              className="h-9 w-auto max-w-none object-contain object-left md:h-11"
            />
          </Link>

          <nav aria-label="Primary" className="hidden h-full items-center gap-10 lg:flex">
            <ul className="flex h-full items-center gap-9">
              <WhatWeDoMenu
                theme={theme}
                active={section === "what-we-do"}
                Link={Link}
              />
              {SECONDARY.map((l) => {
                const active = section === l.href;
                return (
                  <li key={l.href} className="relative h-full">
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-full items-center rounded-md px-1 text-[15px] font-medium transition-colors duration-200",
                        ring,
                        active ? t.linkActive : t.link,
                      )}
                    >
                      {l.label}
                      <ActiveBar show={active} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href={CONTACT.href}
              aria-current={section === CONTACT.href ? "page" : undefined}
              className={cn(
                "group inline-flex h-11 items-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors duration-200",
                CONTACT_PILL,
                ring,
              )}
            >
              {CONTACT.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              >
                →
              </span>
            </Link>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full lg:hidden -mr-2",
              t.iconButton,
              ring,
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h17" />
            </svg>
          </button>
        </div>
      </header>

      {/*
        Portal to document.body so backdrop-filter on <header> cannot become the
        containing block for this fixed panel (audit C1).
      */}
      {portalReady ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
