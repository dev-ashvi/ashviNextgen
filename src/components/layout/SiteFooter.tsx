import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const links = [
  { href: "/#what-we-do", label: "What We Do" },
  { href: "/build", label: "Build" },
  { href: "/transform", label: "Transform" },
  { href: "/#our-work", label: "Our Work" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ashvi-deep text-[color:var(--dark-text)]">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div>
          <Logo variant="horizontal-dark" href="/" className="h-9 w-auto md:h-10" />
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[color:var(--dark-text-secondary)]">
            Ashvi Tech — Building businesses. Advancing technology.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:justify-items-end">
          <div className="sm:col-span-2 md:col-span-3">
            <p className="label text-[color:var(--dark-text-muted)]">Navigate</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-[color:var(--dark-text-secondary)] transition-colors hover:text-ashvi-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-white/10 py-6 text-[13px] text-[color:var(--dark-text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} AshviTech. All rights reserved.</p>
        <a
          href="mailto:hello@ashvi.tech"
          className="transition-colors hover:text-ashvi-teal"
        >
          hello@ashvi.tech
        </a>
      </div>
    </footer>
  );
}
