import { VB, points } from "./surface.generated";

/**
 * Ashvi Research — conceptual "experimental landscape".
 * Wireframe geometry lives in `/public/research/landscape-wireframe.svg`
 * (same paths as the former inline SVG) so homepage HTML is not ~126KB heavier.
 * Labels stay HTML for crisp mobile type.
 *
 * Conceptual artwork only: it does not plot real research results.
 */
const LABELS: { key: keyof typeof points; text: string }[] = [
  { key: "hypothesis", text: "Hypothesis" },
  { key: "experimentation", text: "Experimentation" },
  { key: "evaluation", text: "Evaluation" },
];

const LEADERS = {
  hypothesis: { up: 96, run: 0 },
  experimentation: { up: 58, run: 0 },
  evaluation: { up: -46, run: 0 },
};

const pct = (x: number, y: number) => ({
  left: `${(x / VB.w) * 100}%`,
  top: `${(y / VB.h) * 100}%`,
});

export function ResearchLandscape({ className = "" }: { className?: string }) {
  return (
    <figure className={className} aria-labelledby="rl-caption">
      <div className="relative mx-10 sm:mx-12 lg:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- static public SVG; next/image adds little for SVG */}
        <img
          src="/research/landscape-wireframe.svg"
          alt="Conceptual research landscape: a fine wireframe surface with two smooth peaks joined by a valley. Points mark Hypothesis, Experimentation and Evaluation. Conceptual artwork, not research data."
          width={VB.w}
          height={VB.h}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />

        {LABELS.map(({ key, text }) => {
          const [x, y] = points[key];
          const L = LEADERS[key];
          const ly = y - L.up;
          const left = key === "hypothesis";
          const lx = left ? x - 20 : x + 28;
          return (
            <span
              key={key}
              className={`absolute -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/85 sm:text-[11px] sm:tracking-[0.24em] lg:text-[12px] ${left ? "-translate-x-full" : ""}`}
              style={pct(lx, ly)}
            >
              {text}
            </span>
          );
        })}
      </div>
      <figcaption id="rl-caption" className="sr-only">
        Conceptual illustration of a research process — hypothesis, experimentation
        and evaluation. Not research data.
      </figcaption>
    </figure>
  );
}
