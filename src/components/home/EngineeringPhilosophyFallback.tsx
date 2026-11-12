import { SectionContainer } from "@/components/ui/SectionContainer";
import { ENGINEERING_PRINCIPLES } from "@/components/home/engineering-philosophy-data";

/**
 * Server-friendly Engineering Philosophy shell: real headings, copy, and principles.
 * Interactive circle/accordion hydrates when near viewport (HomeNearViewport).
 */
export function EngineeringPhilosophyFallback() {
  return (
    <SectionContainer tone="white" className="py-20 md:py-24 lg:py-28">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-8 xl:gap-10">
        <div className="min-w-0">
          <p className="label text-mute">
            <span
              className="mr-2.5 inline-block h-px w-6 align-middle bg-tide/70"
              aria-hidden="true"
            />
            Our Engineering Philosophy
          </p>
          <h2 className="mt-6 max-w-[16ch] font-serif text-[clamp(1.85rem,1.1rem+2.4vw,2.85rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink [font-variation-settings:'opsz'_48]">
            Build for how the business works.
          </h2>
          {/* Reserve diagram space — matches interactive circle footprint */}
          <div
            className="mx-auto mt-7 aspect-square w-full max-w-[360px] md:mt-8 lg:mx-0 lg:ml-auto lg:max-w-[380px] xl:max-w-[410px]"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 lg:pt-1">
          <div className="max-w-[32rem] space-y-4 text-[16px] leading-[1.7] text-ink/70 md:text-[17px]">
            <p>
              Adding an AI interface to existing software does not make a
              business AI-native.
            </p>
            <p>
              The opportunity is in understanding the workflows themselves, and
              thoughtfully combining intelligent systems with the human expertise
              that makes them work.
            </p>
          </div>

          <ul
            aria-label="Engineering principles"
            className="mt-8 divide-y divide-line/80 border-y border-line/80 md:mt-9"
          >
            {ENGINEERING_PRINCIPLES.map((principle) => (
              <li key={principle.id} className="py-4 md:py-[1.05rem]">
                <p className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 text-[12px] font-medium tracking-[0.08em] text-ashvi-teal">
                    {principle.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16.5px] font-semibold tracking-[-0.018em] text-ink-900 md:text-[17.5px]">
                      {principle.title}
                    </span>
                    <span className="mt-2.5 block max-w-[36rem] text-[14.5px] font-normal leading-[1.65] text-ink-secondary md:text-[15px]">
                      {principle.body}
                    </span>
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
