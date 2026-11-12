/**
 * Build a Phase-3B-equivalent tree in ../ashvi-3b-bench without altering the primary worktree.
 * Starts from a copy of the current (3C) tree, then reverts only Phase-3C-specific deltas.
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const dest = join(root, "..", "ashvi-3b-bench");

console.log("Preparing", dest);
if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}
mkdirSync(dest, { recursive: true });

const skip = new Set(["node_modules", ".next", ".git", "scripts/stability", "scripts/lcp-optimisation", "scripts/performance-optimisation", "scripts/production-audit"]);

function shouldSkip(name) {
  return skip.has(name) || name === "node_modules" || name === ".next";
}

cpSync(root, dest, {
  recursive: true,
  filter: (src) => {
    const rel = src.slice(root.length + 1).replace(/\\/g, "/");
    if (!rel) return true;
    const top = rel.split("/")[0];
    if (top === "node_modules" || top === ".next" || top === ".git") return false;
    if (rel.startsWith("scripts/stability")) return false;
    if (rel.startsWith("scripts/lcp-optimisation")) return false;
    if (rel.startsWith("scripts/performance-optimisation")) return false;
    if (rel.startsWith("scripts/production-audit")) return false;
    return true;
  },
});

// Symlink/junction node_modules for speed
spawnSync("cmd", ["/c", `mklink /J "${join(dest, "node_modules")}" "${join(root, "node_modules")}"`], {
  encoding: "utf8",
  shell: false,
});

// --- Revert Phase 3C deltas to Phase 3B behaviour ---

// 1) next.config.ts — remove Link headers
writeFileSync(
  join(dest, "next.config.ts"),
  `import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
`,
);

// 2) Remove content-visibility block from globals.css
{
  const cssPath = join(dest, "src/app/globals.css");
  let css = readFileSync(cssPath, "utf8");
  css = css.replace(
    /\n\/\*\s*\n \* Phase 3C: skip layout\/paint[\s\S]*?contain-intrinsic-size: auto 720px;\n\}\n/,
    "\n",
  );
  writeFileSync(cssPath, css);
}

// 3) layout.tsx — Inter preload back to default (true); drop adjustFontFallback added in 3C
{
  const p = join(dest, "src/app/layout.tsx");
  let s = readFileSync(p, "utf8");
  s = s.replace(
    /const inter = Inter\(\{[\s\S]*?\}\);/,
    `const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});`,
  );
  s = s.replace(
    /const newsreader = Newsreader\(\{[\s\S]*?\}\);/,
    `const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
  // Homepage LCP is the hero sculpture image; avoid competing preloads on slow mobile.
  preload: false,
});`,
  );
  s = s.replace(
    /const jetbrains = JetBrains_Mono\(\{[\s\S]*?\}\);/,
    `const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
  // Mono is used for labels; skip critical-path preload so LCP image/fonts win bandwidth.
  preload: false,
});`,
  );
  writeFileSync(p, s);
}

// 4) DualIntelligenceDeferred — remove soft fallback field (3B empty shell)
writeFileSync(
  join(dest, "src/components/home/DualIntelligenceDeferred.tsx"),
  `"use client";

import { HomeNearViewport } from "@/components/home/HomeNearViewport";

function loadDin() {
  return import("@/components/home/DualIntelligenceNetwork").then((m) => ({
    default: function DualIntelligenceNetworkMount() {
      return <m.DualIntelligenceNetwork className="w-full" />;
    },
  }));
}

function DinFallback() {
  return (
    <figure className="relative w-full">
      <div
        className="relative -mb-7 w-full sm:-mb-8"
        style={{ aspectRatio: "500 / 460" }}
        role="img"
        aria-label="Animation of a business operating structure transforming from a regular human staffing grid into a hybrid network of domain experts and intelligent systems"
      />
      <figcaption className="sr-only">
        Expertise × intelligent systems — diagram loads when scrolled into view.
      </figcaption>
    </figure>
  );
}

/** Defers DIN SVG hydration/playback module until near the Belief column. */
export function DualIntelligenceDeferred() {
  return (
    <HomeNearViewport
      rootMargin="200px 0px"
      load={loadDin}
      fallback={<DinFallback />}
    />
  );
}
`,
);

// 5) ResearchLandscape — restore inline SVG by embedding the public SVG file contents
{
  const svgPath = join(root, "public/research/landscape-wireframe.svg");
  let svg = readFileSync(svgPath, "utf8");
  svg = svg.replace('xmlns="http://www.w3.org/2000/svg" ', "");
  const landscapeLiteral = JSON.stringify(svg);
  const component = [
    'import { VB, points } from "./surface.generated";',
    "",
    "const LABELS: { key: keyof typeof points; text: string }[] = [",
    '  { key: "hypothesis", text: "Hypothesis" },',
    '  { key: "experimentation", text: "Experimentation" },',
    '  { key: "evaluation", text: "Evaluation" },',
    "];",
    "",
    "const LEADERS = {",
    "  hypothesis: { up: 96, run: 0 },",
    "  experimentation: { up: 58, run: 0 },",
    "  evaluation: { up: -46, run: 0 },",
    "};",
    "",
    "const pct = (x: number, y: number) => ({",
    "  left: `${(x / VB.w) * 100}%`,",
    "  top: `${(y / VB.h) * 100}%`,",
    "});",
    "",
    "/** Phase 3B equivalent: inline landscape SVG in HTML (heavy document). */",
    'export function ResearchLandscape({ className = "" }: { className?: string }) {',
    "  return (",
    "    <figure className={className} aria-labelledby=\"rl-caption\">",
    '      <div className="relative mx-10 sm:mx-12 lg:mx-0">',
    "        <div",
    '          className="block h-auto w-full [&>svg]:h-auto [&>svg]:w-full"',
    "          dangerouslySetInnerHTML={{ __html: LANDSCAPE_SVG }}",
    "        />",
    "        {LABELS.map(({ key, text }) => {",
    "          const [x, y] = points[key];",
    "          const L = LEADERS[key];",
    "          const ly = y - L.up;",
    '          const left = key === "hypothesis";',
    "          const lx = left ? x - 20 : x + 28;",
    "          return (",
    "            <span",
    "              key={key}",
    '              className={`absolute -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/85 sm:text-[11px] sm:tracking-[0.24em] lg:text-[12px] ${left ? "-translate-x-full" : ""}`}',
    "              style={pct(lx, ly)}",
    "            >",
    "              {text}",
    "            </span>",
    "          );",
    "        })}",
    "      </div>",
    '      <figcaption id="rl-caption" className="sr-only">',
    "        Conceptual illustration of a research process — hypothesis, experimentation and evaluation. Not research data.",
    "      </figcaption>",
    "    </figure>",
    "  );",
    "}",
    "",
    `const LANDSCAPE_SVG = ${landscapeLiteral};`,
    "",
  ].join("\n");
  writeFileSync(join(dest, "src/components/research/ResearchLandscape.tsx"), component);
}

writeFileSync(
  join(dest, "PHASE.txt"),
  "phase-3b-equivalent: 3C deltas reverted (inline landscape, no Link header, no content-visibility, Inter preload default)\n",
);
console.log("Prepared Phase 3B bench tree at", dest);
