import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manifesto | Why Ashvi Exists | Ashvi",
  description:
    "Why Ashvi exists — systems, support, and belief for builders of meaningful technology.",
};

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          boxShadow: "inset 0 0 min(100px, 14vw) rgba(0,0,0,0.5)",
        }}
        aria-hidden
      />

      <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-sm font-semibold italic tracking-tight text-white"
          >
            ashvi
          </Link>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
            Manifesto
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-32 pt-28 md:pt-36">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#00e5ff]/80">
          Why Ashvi exists
        </p>
        <h1 className="mt-6 text-3xl font-light tracking-tight md:text-4xl">
          Built so great minds do not get lost in an incomplete system.
        </h1>

        <div className="mt-20 space-y-12 text-base font-extralight leading-[1.75] text-white/70 md:text-lg">
          <p>
            Intelligence is everywhere. What is rarer is the{" "}
            <span className="text-white/90">structure</span> around it —
            patient research, serious building, accessible capital, and trust
            that a long arc is worth pursuing.
          </p>
          <p>
            Ashvi is a venture studio and research lab that treats that
            structure as the product. We design and build technology systems —
            from AI and software to data and infrastructure — and turn what
            holds up into real companies and solutions.
          </p>
          <p className="text-white/55">
            This is not a manifesto of promises. It is a statement of intent: to
            give builders who care about depth a place where their work can
            compound.
          </p>
        </div>

        <p className="mt-24 text-center text-sm font-light text-white/45">
          <Link href="/" className="transition-colors hover:text-[#00e5ff]">
            ← Back to Ashvi
          </Link>
        </p>
      </main>
    </div>
  );
}
