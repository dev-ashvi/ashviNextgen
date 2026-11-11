"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const whatWeDo = [
  { href: "/build", label: "Build", description: "Co-create AI-native ventures" },
  { href: "/transform", label: "Transform", description: "Rethink existing operations" },
] as const;

const nav = [
  { href: "/#our-work", label: "Our Work", match: "/#our-work" },
  { href: "/research", label: "Research", match: "/research" },
  { href: "/about", label: "About", match: "/about" },
] as const;

const mobileLinks = [
  { href: "/#our-work", label: "Our Work", match: "/#our-work" },
  { href: "/research", label: "Research", match: "/research" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/contact", label: "Contact", match: "/contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [wwdOpen, setWwdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const wwdRef = useRef<HTMLLIElement>(null);
  const wwdButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const wwdMenuId = useId();

  const onBuild = pathname === "/build" || pathname.startsWith("/build/");
  const onTransform = pathname === "/transform" || pathname.startsWith("/transform/");
  const onWhatWeDo = onBuild || onTransform;
  const onContact = pathname === "/contact" || pathname.startsWith("/contact/");
  // Light page tops where a transparent header would sit on page content.
  const solidLight = onTransform || onContact;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 12);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setWwdOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Guarantee scroll unlock if the header unmounts while the menu is open.
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!wwdOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const node = wwdRef.current;
      if (!node) return;
      if (e.target instanceof Node && !node.contains(e.target)) setWwdOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setWwdOpen(false);
        wwdButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [wwdOpen]);

  const mobileMenu = (
    <div
      id="mobile-menu"
      ref={mobileMenuRef}
      hidden={!open}
      className="fixed inset-x-0 bottom-0 top-[84px] z-40 overflow-y-auto bg-paper lg:hidden"
    >
      <ul className="flex flex-col px-6 pt-6 sm:px-10">
        <li className="border-b border-paper-line py-5">
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-mute">What We Do</p>
          <ul className="mt-3 space-y-1">
            {whatWeDo.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline justify-between py-3 text-[24px] tracking-tight text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">
                      {item.href === "/build" ? "01" : "02"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>

        {mobileLinks.map((item, i) => {
          const active =
            item.match.startsWith("/#")
              ? false
              : pathname === item.match || pathname.startsWith(`${item.match}/`);
          return (
            <li key={item.href} className="border-b border-paper-line">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex items-baseline justify-between py-5 text-[28px] tracking-tight text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
                <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-mute">
                  0{i + 3}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-calm",
          solidLight
            ? "border-b border-ink/[0.06] bg-[#F8F9FD]"
            : scrolled || open
              ? "border-b border-ink/[0.06] bg-paper/80 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[84px] w-full max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20 min-[1500px]:max-w-[1480px]"
        >
          <Logo
            variant="horizontal-light"
            priority
            className="h-9 w-auto md:h-11"
          />

          <div className="hidden items-center gap-10 lg:flex">
            <ul className="flex items-center gap-8">
              <li ref={wwdRef} className="relative">
                <button
                  ref={wwdButtonRef}
                  type="button"
                  className={cn(
                    "relative inline-flex items-center gap-1.5 py-2 text-[15px] tracking-[-0.005em] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2",
                    onWhatWeDo || wwdOpen ? "text-ink" : "text-ink/80 hover:text-ink",
                  )}
                  aria-expanded={wwdOpen}
                  aria-haspopup="menu"
                  aria-controls={wwdMenuId}
                  onClick={() => setWwdOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setWwdOpen(true);
                      requestAnimationFrame(() => {
                        document.getElementById(`${wwdMenuId}-0`)?.focus();
                      });
                    }
                  }}
                >
                  What We Do
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-block text-[10px] transition-transform duration-300",
                      wwdOpen ? "rotate-180" : "",
                    )}
                  >
                    ▾
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-tide transition-opacity duration-300",
                      onWhatWeDo ? "opacity-100" : "opacity-0",
                    )}
                  />
                </button>

                <div
                  id={wwdMenuId}
                  role="menu"
                  hidden={!wwdOpen}
                  className="absolute left-1/2 top-[calc(100%+0.65rem)] z-50 w-[15.5rem] -translate-x-1/2 rounded-xl border border-ink/[0.08] bg-[#F8F9FD] p-1.5 shadow-[0_18px_40px_-24px_rgba(2,19,54,0.45)]"
                >
                  {whatWeDo.map((item, i) => {
                    const active =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        id={`${wwdMenuId}-${i}`}
                        role="menuitem"
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-lg px-3.5 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tide",
                          active ? "bg-ink-900/[0.05] text-ink" : "text-ink/85 hover:bg-ink-900/[0.04] hover:text-ink",
                        )}
                        onClick={() => setWwdOpen(false)}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            document.getElementById(`${wwdMenuId}-${Math.min(i + 1, whatWeDo.length - 1)}`)?.focus();
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            if (i === 0) wwdButtonRef.current?.focus();
                            else document.getElementById(`${wwdMenuId}-${i - 1}`)?.focus();
                          }
                          if (e.key === "Escape") {
                            e.preventDefault();
                            setWwdOpen(false);
                            wwdButtonRef.current?.focus();
                          }
                          if (e.key === "Tab") setWwdOpen(false);
                        }}
                      >
                        <span className="block text-[15px] font-medium tracking-[-0.01em]">{item.label}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-ink/55">{item.description}</span>
                      </Link>
                    );
                  })}
                </div>
              </li>

              {nav.map((item) => {
                const active =
                  item.match.startsWith("/#")
                    ? false
                    : pathname === item.match || pathname.startsWith(`${item.match}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[15px] tracking-[-0.005em] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2",
                        active ? "text-ink" : "text-ink/80 hover:text-ink",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-tide transition-opacity duration-300",
                          active ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/contact"
              aria-current={onContact ? "page" : undefined}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink-900 px-6 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-signal focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2"
            >
              Contact
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-calm group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="relative z-50 -mr-2 grid h-11 w-11 place-items-center text-ink outline-none focus-visible:ring-2 focus-visible:ring-tide lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-[1.5px] bg-current transition-transform duration-300",
                  open ? "translate-y-[5px] rotate-45" : "",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-[1.5px] bg-current transition-transform duration-300",
                  open ? "-translate-y-[5px] -rotate-45" : "",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/*
        Portal to document.body so backdrop-filter on <header> cannot become the
        containing block for this fixed panel (audit C1).
      */}
      {portalReady ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
