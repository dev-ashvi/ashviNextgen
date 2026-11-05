import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { href: "/#what-we-do", label: "What We Do" },
  { href: "/#our-work", label: "Our Work" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const linkClass =
  "text-[14px] text-[color:var(--dark-text-secondary)] transition-colors hover:text-ashvi-teal focus-visible:outline-none focus-visible:text-ashvi-teal focus-visible:underline focus-visible:underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ashvi-deep text-[color:var(--dark-text)]">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.15fr_0.9fr_1fr] md:gap-12 md:py-14 lg:gap-16">
        <div>
          <Logo variant="horizontal-dark" href="/" className="h-9 w-auto md:h-10" />
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[color:var(--dark-text-secondary)]">
            Building businesses. Advancing technology.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="label text-[color:var(--dark-text-muted)]">Navigate</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 md:flex-col md:gap-8">
          <div>
            <p className="label text-[color:var(--dark-text-muted)]">
              Our Collaboration
            </p>
            <a
              href="https://financewyz.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-1.5 ${linkClass}`}
            >
              WYZ Finance
              <span aria-hidden="true" className="text-[12px] opacity-70">
                ↗
              </span>
            </a>
          </div>

          <div>
            <p className="label text-[color:var(--dark-text-muted)]">Contact</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href="mailto:dev.ashvi.tech@gmail.com"
                  className={`break-all ${linkClass}`}
                >
                  dev.ashvi.tech@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919079211168" className={linkClass}>
                  +91 9079211168
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shell border-t border-white/10 py-6 text-[13px] text-[color:var(--dark-text-muted)]">
        <p>© {new Date().getFullYear()} AshviTech. All rights reserved.</p>
      </div>
    </footer>
  );
}
