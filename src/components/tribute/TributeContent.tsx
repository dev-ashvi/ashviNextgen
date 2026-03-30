import Link from "next/link";

export function TributeContent() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
        }}
        aria-hidden
      />

      <main className="relative z-10 mx-auto max-w-2xl px-8 pb-32 pt-28 md:pt-36">
        <header className="mb-20 text-center md:mb-28">
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-white/35">
            In Loving Memory
          </p>
          <h1 className="mt-10 text-3xl font-light tracking-tight text-white md:text-4xl">
            Prateesh Goyal
          </h1>
        </header>

        <section className="mb-20 md:mb-28">
          <p className="text-center text-lg font-extralight leading-relaxed text-white/85 md:text-xl">
            A brilliant mind.
            <br />
            A relentless seeker of truth.
            <br />A builder of the future.
          </p>
        </section>

        <section className="mb-20 md:mb-28">
          <h2 className="sr-only">Timeline</h2>
          <ul className="space-y-5 border-l border-white/[0.08] pl-8 text-sm font-light leading-relaxed text-white/65">
            <li>IIT Bombay (AIR 53, Computer Science)</li>
            <li>MIT Research</li>
            <li>Microsoft Research</li>
            <li>37+ research papers</li>
          </ul>
        </section>

        <section className="mb-20 md:mb-28">
          <p className="text-center text-base font-extralight leading-relaxed text-white/75 md:text-lg">
            He believed in creating breakthrough technology for the good of the
            world.
          </p>
        </section>

        <footer className="border-t border-white/[0.07] pt-14 text-center">
          <p className="text-sm font-extralight tracking-wide text-white/55">
            This work continues.
          </p>
          <p className="mt-16 text-[10px] text-white/25">
            <Link href="/" className="transition-colors hover:text-white/45">
              ← Ashvi
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
