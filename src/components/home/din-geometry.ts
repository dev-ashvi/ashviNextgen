export type Pt = { x: number; y: number };

export type HumanDef = {
  id: string;
  grid: Pt;
  retained: boolean;
  final?: Pt;
};

export type AiDef = { id: string; final: Pt };

export type EdgeDef = { id: string; from: string; to: string };

/**
 * Canvas sized to the enlarged hybrid silhouette with modest margins.
 * Filling the viewBox (not empty SVG padding) is what makes the diagram
 * read ~15–20% more substantial in the right column.
 */
export const VB = { w: 500, h: 460 };
export const ORIGIN = 52;
export const STEP = 100;
export const PLAY_MS = 5000;
export const PLAY_MS_COMPACT = 2800;
export const VISIBILITY_RATIO = 0.7;

function gridPt(col: number, row: number): Pt {
  return { x: ORIGIN + col * STEP, y: ORIGIN + row * STEP };
}

/** Scale about centre so the hybrid fills most of the viewBox (~1.2×). */
function enlarge(p: Pt, s = 1.2): Pt {
  const cx = 248;
  const cy = 225;
  return {
    x: Math.round(cx + (p.x - cx) * s),
    y: Math.round(cy + (p.y - cy) * s),
  };
}

/**
 * Final hybrid composition — soft clusters bridged by intelligent systems.
 * Base coords preserve the approved silhouette; enlarge() grows presence.
 */
export const HUMANS: HumanDef[] = [
  { id: "h0", grid: gridPt(0, 0), retained: true, final: enlarge({ x: 98, y: 110 }) },
  { id: "h1", grid: gridPt(1, 0), retained: false },
  { id: "h2", grid: gridPt(2, 0), retained: true, final: enlarge({ x: 270, y: 92 }) },
  { id: "h3", grid: gridPt(3, 0), retained: false },
  { id: "h4", grid: gridPt(0, 1), retained: false },
  { id: "h5", grid: gridPt(1, 1), retained: true, final: enlarge({ x: 150, y: 190 }) },
  { id: "h6", grid: gridPt(2, 1), retained: false },
  { id: "h7", grid: gridPt(3, 1), retained: false },
  { id: "h8", grid: gridPt(0, 2), retained: false },
  { id: "h9", grid: gridPt(1, 2), retained: false },
  { id: "h10", grid: gridPt(2, 2), retained: true, final: enlarge({ x: 320, y: 210 }) },
  { id: "h11", grid: gridPt(3, 2), retained: false },
  { id: "h12", grid: gridPt(0, 3), retained: true, final: enlarge({ x: 114, y: 320 }) },
  { id: "h13", grid: gridPt(1, 3), retained: false },
  { id: "h14", grid: gridPt(2, 3), retained: false },
  { id: "h15", grid: gridPt(3, 3), retained: true, final: enlarge({ x: 298, y: 350 }) },
];

export const AIS: AiDef[] = [
  { id: "a0", final: enlarge({ x: 206, y: 128 }) },
  { id: "a1", final: enlarge({ x: 384, y: 170 }) },
  { id: "a2", final: enlarge({ x: 228, y: 260 }) },
  { id: "a3", final: enlarge({ x: 380, y: 300 }) },
];

function buildGridEdges(): EdgeDef[] {
  const edges: EdgeDef[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const i = row * 4 + col;
      if (col < 3) {
        edges.push({ id: `g-h-${i}-${i + 1}`, from: `h${i}`, to: `h${i + 1}` });
      }
      if (row < 3) {
        edges.push({ id: `g-v-${i}-${i + 4}`, from: `h${i}`, to: `h${i + 4}` });
      }
    }
  }
  return edges;
}

export const HYBRID_EDGES: EdgeDef[] = [
  { id: "hy-0", from: "h0", to: "a0" },
  { id: "hy-1", from: "h2", to: "a0" },
  { id: "hy-2", from: "h5", to: "a0" },
  { id: "hy-3", from: "h2", to: "a1" },
  { id: "hy-4", from: "h10", to: "a1" },
  { id: "hy-5", from: "h5", to: "a2" },
  { id: "hy-6", from: "h10", to: "a2" },
  { id: "hy-7", from: "h12", to: "a2" },
  { id: "hy-8", from: "h15", to: "a2" },
  { id: "hy-9", from: "h10", to: "a3" },
  { id: "hy-10", from: "h15", to: "a3" },
  { id: "hy-11", from: "a0", to: "a2" },
  { id: "hy-12", from: "a1", to: "a3" },
  { id: "hy-13", from: "h0", to: "h5" },
  { id: "hy-14", from: "h12", to: "h15" },
];

export const GRID_EDGES = buildGridEdges();

export function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

export function curvePath(a: Pt, b: Pt, bend = 0.1) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return `M ${a.x} ${a.y} Q ${mx - dy * bend} ${my + dx * bend} ${b.x} ${b.y}`;
}

export function linePath(a: Pt, b: Pt) {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

export function stageLabelFor(sec: number) {
  if (sec < 1.5) return "People-dependent structure";
  if (sec < 3.5) return "Operating model reorganising";
  return "Expertise × intelligent systems";
}

export function phasesFromSeconds(sec: number, scale = 1) {
  const t = sec * scale;
  return {
    removeT: smoothstep(0.7, 1.8, t),
    relocateT: smoothstep(1.5, 3.2, t),
    aiT: smoothstep(1.5, 3.2, t),
    hybridEdgeT: smoothstep(2.8, 4.5, t),
    gridEdgeT: 1 - smoothstep(0.7, 1.8, t),
  };
}

export function pointMap(relocateT: number) {
  const map = new Map<string, Pt>();
  for (const h of HUMANS) {
    map.set(
      h.id,
      h.retained && h.final ? lerpPt(h.grid, h.final, relocateT) : h.grid,
    );
  }
  for (const a of AIS) map.set(a.id, a.final);
  return map;
}
