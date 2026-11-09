// Generates the Research page's two linework visuals as static SVG path data.
// Run: node scripts/gen-research-page.mjs  → src/components/research-page/geometry.generated.ts
//
// 1. Terrain (hero): a smooth height field z(x, y) seen through a pinhole perspective camera.
//    x = lateral, y = depth (0 = front), z = height. Rows follow constant depth, columns constant x,
//    so the grid follows the surface exactly — no free-hand wavy paths.
// 2. Horizon (Long Horizon section): a flat measured plane receding to a single vanishing point.
import { writeFileSync } from 'node:fs'

const r1 = (n) => Math.round(n * 10) / 10

function line(points) {
  // Catmull-Rom → cubic Bézier: smooth and compact
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] ?? p2
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d
}

/* ───────────────────────── 1. Terrain ───────────────────────── */

const T = { w: 1000, h: 560 }
const CAM = { f: 760, dist: 2.6, height: 1.05, horizon: 160, cx: 600 }

// [x, y, amplitude, sigmaX, sigmaY] — a principal ridge rising to the right, a secondary rise,
// and a shallow saddle between them; plus a low-amplitude periodic term so the surface reads as
// a mathematical field rather than a mountain.
const LOBES = [
  [1.2, 1.4, 0.95, 0.5, 0.48], //  principal summit
  [0.25, 1.0, 0.55, 0.38, 0.34], // secondary rise in front-left
  [2.05, 0.95, 0.68, 0.42, 0.4], // right shoulder
  [0.65, 2.45, 0.6, 0.7, 0.38], //  distant ridge behind the saddle
  [1.7, 0.3, 0.3, 0.32, 0.26], //   low swell near the viewer
  [-0.6, 1.8, 0.32, 0.55, 0.45], // faint rise trailing left (masked)
]
const zT = (x, y) =>
  LOBES.reduce((s, [cx, cy, a, sx, sy]) => s + a * Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2) / 2), 0) +
  0.07 * Math.sin(2.4 * x + 1.1 * y) * Math.cos(1.7 * y - 0.6 * x)

const proj = (x, y, h) => {
  const d = y + CAM.dist
  return [CAM.cx + (CAM.f * x) / d, CAM.horizon + (CAM.f * (CAM.height - h)) / d]
}

const X0 = -2.4, X1 = 2.9, Y0 = 0, Y1 = 2.9
const ROWS = 34, COLS = 52, SAMPLES_X = 44, SAMPLES_Y = 22

const rows = []
for (let j = 0; j <= ROWS; j++) {
  const y = Y0 + ((Y1 - Y0) * j) / ROWS
  const pts = []
  for (let i = 0; i <= SAMPLES_X; i++) {
    const x = X0 + ((X1 - X0) * i) / SAMPLES_X
    pts.push(proj(x, y, zT(x, y)))
  }
  rows.push({ d: line(pts), depth: +(j / ROWS).toFixed(3) })
}
const cols = []
for (let i = 0; i <= COLS; i++) {
  const x = X0 + ((X1 - X0) * i) / COLS
  const pts = []
  for (let j = 0; j <= SAMPLES_Y; j++) {
    const y = Y0 + ((Y1 - Y0) * j) / SAMPLES_Y
    pts.push(proj(x, y, zT(x, y)))
  }
  cols.push({ d: line(pts), lateral: +(i / COLS).toFixed(3) })
}

// Crest: visible upper silhouette (minimum screen-y per screen-x), lightly smoothed
const env = new Map()
for (let x = X0; x <= X1; x += 0.005) {
  for (let y = Y0; y <= Y1; y += 0.01) {
    const [sx, sy] = proj(x, y, zT(x, y))
    const k = Math.round(sx / 3)
    if (!env.has(k) || env.get(k) > sy) env.set(k, sy)
  }
}
let crestPts = [...env.keys()].sort((a, b) => a - b).map((k) => [k * 3, env.get(k)])
crestPts = crestPts.map((p, i, a) => {
  const w = a.slice(Math.max(0, i - 3), i + 4)
  return [p[0], w.reduce((s, q) => s + q[1], 0) / w.length]
})
const crest = line(crestPts.filter((_, i) => i % 3 === 0))

// Volume: crest closed along the front edge
const front = []
for (let i = SAMPLES_X; i >= 0; i--) {
  const x = X0 + ((X1 - X0) * i) / SAMPLES_X
  front.push(proj(x, 0, zT(x, 0)))
}
const body = crest + front.map(([a, b]) => `L${r1(a)} ${r1(b)}`).join('') + 'Z'

// A few highlights: the summits of the three principal lobes, projected onto the surface
const highlights = [0, 2, 1].map((i) => {
  const [cx, cy] = LOBES[i]
  return { p: proj(cx, cy, zT(cx, cy)).map(r1), strength: i === 0 ? 1 : 0.55 }
})

/* ───────────────────────── 2. Horizon ───────────────────────── */

const H = { w: 1200, h: 320 }
const VP = { x: 990, y: 150 } // vanishing point = the single point of light
// A flat plane z = 0 seen from eye height e; a depth line at distance d appears at VP.y + f*e/d.
const HF = 520, EYE = 0.62
const depthLines = []
for (let k = 0; k < 26; k++) {
  const d = 0.55 * Math.pow(1.17, k) // geometric spacing: lines crowd toward the horizon
  const y = VP.y + (HF * EYE) / d
  if (y > H.h + 4) continue
  depthLines.push({ y: r1(y), t: +(k / 25).toFixed(3) })
}
const rays = []
for (let i = -22; i <= 22; i++) {
  const x = i * 0.42 // lateral offset of the ray on the plane
  // a ray of constant x converges to VP; draw from the bottom edge to VP
  const yb = H.h + 6
  const d = (HF * EYE) / (yb - VP.y)
  const xb = VP.x + (HF * x) / d
  rays.push({ d: `M${r1(xb)} ${yb}L${VP.x} ${VP.y}`, w: +Math.abs(i / 22).toFixed(3) })
}
// two faint curved isolines above the plane: the field continues past what is measured
const arcs = [0.5, 1].map((s) => {
  const pts = []
  for (let x = 520; x <= 1200; x += 20) {
    const u = (x - VP.x) / 420
    pts.push([x, VP.y - 26 * s * Math.exp(-u * u * 1.4) + 8 * s * u * u])
  }
  return line(pts)
})

const out = `// GENERATED by scripts/gen-research-page.mjs — do not edit by hand.
// Terrain = height field + perspective camera; Horizon = flat plane + vanishing point. Re-run to change.
export const TERRAIN = {
  vb: ${JSON.stringify(T)},
  rows: ${JSON.stringify(rows)},
  cols: ${JSON.stringify(cols)},
  crest: ${JSON.stringify(crest)},
  body: ${JSON.stringify(body)},
  highlights: ${JSON.stringify(highlights)} as { p: [number, number]; strength: number }[],
}
export const HORIZON = {
  vb: ${JSON.stringify(H)},
  vp: ${JSON.stringify(VP)},
  depthLines: ${JSON.stringify(depthLines)},
  rays: ${JSON.stringify(rays)},
  arcs: ${JSON.stringify(arcs)},
}
`
writeFileSync(new URL('../src/components/research-page/geometry.generated.ts', import.meta.url), out)
console.log('ok', (out.length / 1024).toFixed(1) + ' KB', 'highlights', highlights, 'depthLines', depthLines.length)
