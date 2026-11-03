"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/#what-we-do", label: "What We Do", match: "/#what-we-do" },
  { href: "/#our-work", label: "Our Work", match: "/#our-work" },
  { href: "/research", label: "Research", match: "/research" },
  { href: "/about", label: "About", match: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-calm",
        scrolled || open
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
            {nav.map((item) => {
              const active =
                item.match.startsWith("/#")
                  ? pathname === "/" && false
                  : pathname === item.match || pathname.startsWith(`${item.match}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-[15px] tracking-[-0.005em] transition-colors duration-300",
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
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink-900 px-6 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-signal"
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
          type="button"
          className="relative z-50 -mr-2 grid h-11 w-11 place-items-center text-ink lg:hidden"
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

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[84px] z-40 overflow-y-auto bg-paper lg:hidden"
      >
        <ul className="flex flex-col px-6 pt-6 sm:px-10">
          {[...nav, { href: "/contact", label: "Contact", match: "/contact" }].map(
            (item, i) => (
              <li key={item.href} className="border-b border-paper-line">
                <Link
                  href={item.href}
                  className="flex items-baseline justify-between py-5 text-[28px] tracking-tight text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-mute">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </header>
  );
}
