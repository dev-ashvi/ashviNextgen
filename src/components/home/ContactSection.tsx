import Link from "next/link";
import { ConnectGlobeLazy } from "@/components/home/ConnectGlobeLazy";

/**
 * 08 — Let's Connect.
 * Premium navy closing panel with Magic UI / COBE globe; links to /contact.
 */
export function ContactSection() {
  return (
    <section
      id="connect"
      aria-labelledby="connect-title"
      className="relative scroll-mt-24 bg-paper"
    >
      <div className="shell pb-16 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10">
        <div className="relative min-h-[360px] overflow-hidden rounded-[22px] bg-ink-900 text-white md:min-h-[400px] md:rounded-[26px] lg:min-h-[420px] lg:rounded-[28px]">
          <PanelAtmosphere />
          <ConnectGlobeLazy />

          <div className="relative z-10 px-7 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-14 lg:py-16 xl:px-16">
            <div className="relative z-10 max-w-[34rem]">
              <p className="label flex items-center gap-2.5 text-white/65">
                <span
                  className="inline-block h-px w-6 bg-white/25"
                  aria-hidden="true"
                />
                Let&apos;s Connect
              </p>

              <h2
                id="connect-title"
                className="mt-5 font-serif text-[clamp(1.85rem,1.05rem+2.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.025em] text-white [font-variation-settings:'opsz'_48] md:mt-6"
              >
                Let&apos;s build what comes next.
              </h2>

              <div className="mt-5 max-w-[32rem] space-y-1 text-[16px] leading-[1.65] text-white/65 md:mt-6 md:text-[17px] md:leading-[1.7]">
                <p>
                  Have an idea, deep domain expertise, or a business ready to
                  work differently?
                </p>
                <p>We&apos;d love to hear from you.</p>
              </div>

              <Link
                href="/contact"
                className="group relative z-20 mt-7 inline-flex items-center gap-2 border-b border-tide/80 pb-1 text-[15px] font-medium text-white transition-colors duration-300 hover:border-tide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tide md:mt-8 md:text-[16px]"
              >
                Start a conversation
                <span aria-hidden="true" className="text-tide">
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(125deg,#021336_0%,#041a42_42%,#03152f_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_78%_58%,rgba(0,56,118,0.4)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_88%_78%,rgba(0,205,184,0.12)_0%,transparent_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_8%_40%,rgba(2,19,54,0.55)_0%,transparent_55%)]" />
    </div>
  );
}
