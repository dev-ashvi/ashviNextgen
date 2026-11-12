/**
 * AboutHero — dark About page hero.
 * Motion CSS lives in `about-hero.css` (imported from `app/about/layout.tsx` —
 * App Router only allows global CSS from layouts).
 * Editorial copy on the left; a sculptural reading of the AshviTech mark on the right, built from the
 * mark's own pieces as layered SVG (no raster). Header comes from the host layout.
 *
 * The mark, in the artwork's coordinates (MARK below):
 *   A apex · L left base · R right base · N the notch on the right edge · T the teal fin's tip ·
 *   the left face (A–L and the curve back up to N), the teal fin (N–T and its sweep back into the slit),
 *   and the wave body below the fin, whose face curls from the crest down to R.
 */

/**
 * Mark geometry, measured from the approved reference (reference pixels − MARK_AT), as points that
 * smooth curves pass through. Edit a point to adjust a curve.
 */
type Pt = [number, number]
const A: Pt = [334, 21] // apex
const L: Pt = [32, 484] // left base
const R: Pt = [602, 479] // right base: where the wave meets the base
const N: Pt = [420, 150] // notch on the right edge
const T: Pt = [494, 250] // tip of the teal crescent
// the crescent's long lower edge, from its tip back to the tail where it meets the slit
const FIN_OUTER: Pt[] = [T, [462, 233], [430, 226], [398, 228], [360, 237], [320, 255], [280, 278], [242, 305], [212, 330], [186, 352], [158, 376]]
// the crescent's inner edge, from the notch down to the same tail
const FIN_INNER: Pt[] = [N, [413, 178], [396, 201], [362, 224], [302, 250], [246, 286], [214, 318], [186, 346], [158, 376]]
// the left face's lit edge, from the notch down toward the lower left (bounds the dark slit above the crescent)
const FACE_EDGE: Pt[] = [N, [370, 172], [320, 202], [280, 233], [240, 273], [200, 322], [150, 384], [104, 438], [70, 470]]
// the wave cutout: from under the crescent, curling left, then sweeping down to the right base
const WAVE: Pt[] = [[426, 227], [398, 238], [383, 265], [385, 300], [400, 340], [430, 380], [470, 415], [520, 448], [562, 467], R]

/** Catmull–Rom through points → cubic Bézier segments (without the initial M). */
function through(pts: Pt[]) {
  const r = (n: number) => Math.round(n * 10) / 10
  let d = ''
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`
  }
  return d
}
const M = (p: Pt) => `M${p[0]} ${p[1]}`
const rev = (pts: Pt[]) => [...pts].reverse()

// bevel: a strip along the left edge, offset inward
const BEVEL_IN: Pt = [L[0] + 26, L[1]]
const BEVEL_TOP: Pt = [A[0] + 2, A[1] + 26]

const MARK = {
  // dark body below the crescent: crescent's lower edge → tail → left base → base → wave back up
  body: `${M([426, 227])}${through(FIN_OUTER.slice(2))} L${L[0]} ${L[1]} L${R[0]} ${R[1]}${through(rev(WAVE))} Z`,
  // the lighter left face: apex → left base → up the lit edge to the notch → apex
  leftFace: `${M(A)} L${L[0]} ${L[1]} L${FACE_EDGE[FACE_EDGE.length - 1][0]} ${FACE_EDGE[FACE_EDGE.length - 1][1]}${through(rev(FACE_EDGE))} Z`,
  bevel: `${M(A)} L${L[0]} ${L[1]} L${BEVEL_IN[0]} ${BEVEL_IN[1]} L${BEVEL_TOP[0]} ${BEVEL_TOP[1]} Z`,
  // the dark slit between the face edge and the crescent
  slit: `${M(N)}${through(FACE_EDGE.slice(0, 6))}${through([[200, 322], [178, 350], [158, 376]])}${through(rev(FIN_INNER))} Z`,
  // the teal crescent
  fin: `${M(N)} L${T[0]} ${T[1]}${through(FIN_OUTER)}${through(rev(FIN_INNER))} Z`,
  finOuter: `${M(T)}${through(FIN_OUTER)}`,
  finInner: `${M(N)}${through(FIN_INNER)}`,
  faceEdge: `${M(N)}${through(FACE_EDGE)}`,
  wave: `${M(WAVE[0])}${through(WAVE)}`,
  leftEdge: `${M(A)} L${L[0]} ${L[1]}`,
  bevelEdge: `${M(BEVEL_TOP)} L${BEVEL_IN[0]} ${BEVEL_IN[1]}`,
  rightEdge: `${M(A)} L${N[0]} ${N[1]}`,
  finTop: `${M(N)} L${T[0]} ${T[1]}`,
  base: `${M(L)} L${R[0]} ${R[1]}`,
}
/**
 * The sculpture extracted from the approved reference (1672 × 941). `box` is where the crop came from,
 * so it sits at exactly its reference position in the artwork. Replace with a higher-resolution render
 * of the same framing when available.
 */
const SCULPTURE = {
  desktop: '/about/sculpture-desktop.webp', // reference crop x 985–1672, y 140–700
  mobile: '/about/sculpture-mobile.webp', // reference crop x 975–1625, y 175–718
  box: { x: 985, y: 140, w: 687, h: 560 },
}
// where the SVG reconstruction sits in the 1672 × 941 artwork (matches the approved composition)
const MARK_AT = { x: 960, y: 180 }

/**
 * sculpture="image" (default): the sculpture extracted from the approved reference, placed at its exact position.
 * sculpture="svg": the editable SVG reconstruction (kept for future iteration / a higher-resolution render).
 */
export function AboutHero({ id = 'about-hero', sculpture = 'image' }: { id?: string; sculpture?: 'image' | 'svg' }) {
  return (
    <section aria-labelledby={`${id}-title`} className="ah relative isolate overflow-hidden bg-[#021336] text-[#F8F9FD]">
      {/* desktop: one artwork layer behind the whole hero — sculpture on the right, light traces across the lower half */}
      <Artwork sculpture={sculpture} className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full lg:block" />
      {/* small screens: background traces only; the sculpture follows the copy */}
      {sculpture === 'svg' && (
      <Artwork
        traceOnly
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full lg:hidden [mask-image:linear-gradient(180deg,transparent_0%,transparent_62%,#000_80%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,transparent_62%,#000_80%)]"
      />
      )}

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-4 pt-[116px] sm:px-10 lg:min-h-[min(860px,100svh)] lg:px-[6.6%] lg:pb-28 lg:pt-[180px]">
        <div className="max-w-[40rem] lg:max-w-[60%]">
          <p className="flex items-center gap-4 font-mono text-[12.5px] uppercase tracking-[0.24em] text-white/85 sm:text-[14px]">
            <span className="h-px w-10 bg-[#00CDB8]" aria-hidden="true" />
            About AshviTech
          </p>
          <h1
            id={`${id}-title`}
            className="mt-6 text-balance font-serif text-[clamp(2.6rem,4.15vw,4.4rem)] font-normal leading-[1.08] tracking-[-0.018em] text-[#F8F9FD] lg:text-wrap"
          >
            {/* two lines on desktop, as in the approved composition; natural wrapping below lg */}
            <span className="lg:whitespace-nowrap">Technology should go beyond</span> <span className="lg:whitespace-nowrap">the business it serves.</span>
          </h1>
          <p className="mt-8 max-w-[34rem] text-[17px] leading-[1.7] text-white/80 sm:text-[19px]">
            We believe technical capability should solve meaningful problems, create opportunities for people, and expand what
            becomes possible to explore.
          </p>
          <span className="mt-9 block h-px w-12 bg-[#00CDB8]" aria-hidden="true" />
          <p className="mt-6 font-serif text-[clamp(1.35rem,1.9vw,1.75rem)] leading-[1.3] tracking-[-0.01em] text-[#F8F9FD]">
            Building businesses. Advancing technology.
          </p>
        </div>
      </div>

      {/* small screens: the sculpture below the copy, never behind it */}
      <div className="relative -mt-2 px-6 pb-10 sm:px-10 lg:hidden">
        {sculpture === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element -- Claude sculpture crop; next/image adds little for masked static webp
          <img
            src={SCULPTURE.mobile}
            alt=""
            aria-hidden="true"
            width={650}
            height={543}
            decoding="async"
            className="mx-auto block w-[92%] max-w-[480px] [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent_0%,#000_12%,#000_88%,transparent_100%),linear-gradient(180deg,transparent_0%,#000_12%,#000_93%,transparent_100%)] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_12%,#000_88%,transparent_100%),linear-gradient(180deg,transparent_0%,#000_12%,#000_93%,transparent_100%)]"
          />
        ) : (
          <svg viewBox="10 0 620 500" className="mx-auto block w-[78%] max-w-[420px]" aria-hidden="true">
            <Defs prefix="ahm" />
            <Mark prefix="ahm" />
          </svg>
        )}
      </div>
    </section>
  )
}

/* ───────────────────────── artwork ───────────────────────── */

function Artwork({ className = '', traceOnly = false, sculpture = 'image' }: { className?: string; traceOnly?: boolean; sculpture?: 'image' | 'svg' }) {
  const p = traceOnly ? 'aht' : 'ahd'
  return (
    <svg viewBox="0 0 1672 941" preserveAspectRatio={traceOnly ? 'xMaxYMax slice' : 'xMidYMid slice'} className={className} aria-hidden="true">
      <Defs prefix={p} />
      {/* atmosphere: restrained blue lift behind the sculpture */}
      <rect width="1672" height="941" fill={`url(#${p}-room)`} />
      <ellipse cx="1300" cy="430" rx="520" ry="380" fill={`url(#${p}-lift)`} />

      <Traces prefix={p} />

      {!traceOnly && sculpture === 'svg' && (
        <g transform={`translate(${MARK_AT.x} ${MARK_AT.y})`}>
          <Mark prefix={p} />
        </g>
      )}
      {!traceOnly && sculpture === 'image' && (
        <g mask={`url(#${p}-my)`}>
          <image
            href={SCULPTURE.desktop}
            x={SCULPTURE.box.x}
            y={SCULPTURE.box.y}
            width={SCULPTURE.box.w}
            height={SCULPTURE.box.h}
            mask={`url(#${p}-mx)`}
            preserveAspectRatio="none"
          />
        </g>
      )}
    </svg>
  )
}

/** Three light traces: one bright line rising through the sculpture's base corner, two quieter arcs. */
function Traces({ prefix: p }: { prefix: string }) {
  return (
    <g fill="none" strokeLinecap="round">
      {/* a broad, faint arc sweeping up the right side */}
      <path d="M1400 360 C1490 318 1585 276 1672 228" stroke={`url(#${p}-arc)`} strokeWidth="1" opacity="0.6" />
      {/* the low arc across the lower-left */}
      <path d="M0 860 C380 770 760 640 1100 590" stroke={`url(#${p}-arc)`} strokeWidth="1" opacity="0.35" />
      {/* the principal trace: from the lower left, through the base's right corner, out to the right edge */}
      <path d="M260 941 C700 832 1150 728 1565 660 L1672 634" stroke={`url(#${p}-trace)`} strokeWidth="4" opacity="0.18" />
      <path d="M260 941 C700 832 1150 728 1565 660 L1672 634" stroke={`url(#${p}-trace)`} strokeWidth="1.3" />
      {/* optional motion: a short highlight travels along it (hidden when reduced motion is preferred) */}
      <path d="M260 941 C700 832 1150 728 1565 660 L1672 634" stroke="#E9FFFC" strokeOpacity="0.7" strokeWidth="1.3" className="ah-trace" />
      <path d="M1100 941 C1300 860 1500 800 1672 740" stroke={`url(#${p}-arc)`} strokeWidth="1" opacity="0.4" />
    </g>
  )
}

function Mark({ prefix: p }: { prefix: string }) {
  return (
    <g>
      {/* light scattering from the notch into the surroundings (blurred, behind the glass) */}
      <ellipse cx="430" cy="215" rx="150" ry="115" fill={`url(#${p}-notchglow)`} className="ah-breathe" />
      <path d={MARK.fin} fill="#2FE0D0" opacity="0.35" filter={`url(#${p}-soft)`} />

      {/* translucent surfaces, back to front */}
      <path d={MARK.body} fill={`url(#${p}-body)`} />
      <path d={MARK.body} fill={`url(#${p}-bodyshade)`} />
      <path d={MARK.leftFace} fill={`url(#${p}-face)`} />
      <path d={MARK.bevel} fill={`url(#${p}-bevel)`} />
      <path d={MARK.slit} fill={`url(#${p}-slit)`} />
      <path d={MARK.fin} fill={`url(#${p}-fin)`} />
      <path d={MARK.fin} fill={`url(#${p}-finsheen)`} />

      {/* rim light along the wave: a soft wide stroke under a fine line */}
      <path d={MARK.wave} fill="none" stroke="#3FA6D4" strokeOpacity="0.16" strokeWidth="9" filter={`url(#${p}-soft)`} />

      {/* contours */}
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d={MARK.leftEdge} stroke={`url(#${p}-edge)`} strokeWidth="1.3" />
        <path d={MARK.bevelEdge} stroke="#9FC4EA" strokeOpacity="0.12" strokeWidth="0.8" />
        <path d={MARK.rightEdge} stroke="#9FC4EA" strokeOpacity="0.4" strokeWidth="0.9" />
        <path d={MARK.base} stroke={`url(#${p}-base)`} strokeWidth="1.4" />
        <path d={MARK.wave} stroke={`url(#${p}-wave)`} strokeWidth="1.1" />
        <path d={MARK.faceEdge} stroke={`url(#${p}-faceedge)`} strokeWidth="1.2" />
        <path d={MARK.finInner} stroke="#5FE3D6" strokeOpacity="0.55" strokeWidth="0.9" />
        {/* the crescent's lower edge: the brightest line in the sculpture */}
        <path d={MARK.finOuter} stroke="#7FF5E8" strokeOpacity="0.5" strokeWidth="4" filter={`url(#${p}-soft)`} />
        <path d={MARK.finOuter} stroke={`url(#${p}-ribbon)`} strokeWidth="1.5" />
        <path d={MARK.finTop} stroke="#C9FFF8" strokeOpacity="0.8" strokeWidth="1" />
      </g>
      <ellipse cx={R[0]} cy={R[1]} rx="70" ry="8" fill={`url(#${p}-corner)`} />
    </g>
  )
}

function Defs({ prefix: p }: { prefix: string }) {
  return (
    <defs>
      {/* Brand navy base (#021336) — no near-black edges; blue lift is a separate restrained ellipse */}
      <radialGradient id={`${p}-room`} cx="68%" cy="42%" r="78%">
        <stop offset="0" stopColor="#021336" />
        <stop offset="0.55" stopColor="#021336" />
        <stop offset="1" stopColor="#021336" />
      </radialGradient>
      <radialGradient id={`${p}-lift`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#003876" stopOpacity="0.16" />
        <stop offset="1" stopColor="#003876" stopOpacity="0" />
      </radialGradient>
      {/* feathered edges for the extracted sculpture (left, top, bottom; the right edge is the artwork edge) */}
      <linearGradient id={`${p}-fx`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.12" stopColor="#fff" />
      </linearGradient>
      <linearGradient id={`${p}-fy`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#000" />
        <stop offset="0.1" stopColor="#fff" />
        <stop offset="0.84" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
      <mask id={`${p}-mx`} maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill={`url(#${p}-fx)`} />
      </mask>
      <mask id={`${p}-my`} maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill={`url(#${p}-fy)`} />
      </mask>

      {/* mark (the mark's own coordinates, 0–640 × 0–500) */}
      <filter id={`${p}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <linearGradient id={`${p}-body`} gradientUnits="userSpaceOnUse" x1="200" y1="240" x2="520" y2="480">
        <stop offset="0" stopColor="#06244A" stopOpacity="0.95" />
        <stop offset="0.55" stopColor="#041C3E" stopOpacity="0.9" />
        <stop offset="1" stopColor="#0A3156" stopOpacity="0.85" />
      </linearGradient>
      {/* a little light pooling on the base, toward the right corner */}
      <radialGradient id={`${p}-bodyshade`} gradientUnits="userSpaceOnUse" cx="520" cy="485" r="260">
        <stop offset="0" stopColor="#1FA9C8" stopOpacity="0.22" />
        <stop offset="1" stopColor="#1FA9C8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${p}-face`} gradientUnits="userSpaceOnUse" x1="120" y1="150" x2="330" y2="380">
        <stop offset="0" stopColor="#2E6694" stopOpacity="0.62" />
        <stop offset="0.5" stopColor="#1A4C7C" stopOpacity="0.5" />
        <stop offset="1" stopColor="#0E3762" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={`${p}-bevel`} gradientUnits="userSpaceOnUse" x1="32" y1="0" x2="62" y2="0">
        <stop offset="0" stopColor="#9FC4EA" stopOpacity="0.32" />
        <stop offset="1" stopColor="#5B85C0" stopOpacity="0.04" />
      </linearGradient>
      <linearGradient id={`${p}-slit`} gradientUnits="userSpaceOnUse" x1="420" y1="150" x2="220" y2="320">
        <stop offset="0" stopColor="#072E54" />
        <stop offset="0.45" stopColor="#031A3A" />
        <stop offset="1" stopColor="#02142E" />
      </linearGradient>
      <linearGradient id={`${p}-fin`} gradientUnits="userSpaceOnUse" x1="220" y1="320" x2="470" y2="200">
        <stop offset="0" stopColor="#0C6A86" stopOpacity="0.85" />
        <stop offset="0.55" stopColor="#11A9BC" />
        <stop offset="1" stopColor="#46E6E0" />
      </linearGradient>
      <linearGradient id={`${p}-finsheen`} gradientUnits="userSpaceOnUse" x1="430" y1="160" x2="440" y2="240">
        <stop offset="0" stopColor="#E9FFFC" stopOpacity="0.32" />
        <stop offset="1" stopColor="#E9FFFC" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${p}-notchglow`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#00CDB8" stopOpacity="0.3" />
        <stop offset="0.5" stopColor="#00CDB8" stopOpacity="0.08" />
        <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${p}-edge`} gradientUnits="userSpaceOnUse" x1="334" y1="21" x2="32" y2="484">
        <stop offset="0" stopColor="#B9CCE6" stopOpacity="0.55" />
        <stop offset="0.55" stopColor="#C9DDF2" stopOpacity="0.85" />
        <stop offset="1" stopColor="#5B85C0" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id={`${p}-faceedge`} gradientUnits="userSpaceOnUse" x1="420" y1="150" x2="70" y2="470">
        <stop offset="0" stopColor="#E9FFFC" stopOpacity="0.85" />
        <stop offset="0.4" stopColor="#8FD8EC" stopOpacity="0.6" />
        <stop offset="1" stopColor="#3F86C0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${p}-ribbon`} gradientUnits="userSpaceOnUse" x1="494" y1="0" x2="200" y2="0">
        <stop offset="0" stopColor="#B8FFF6" />
        <stop offset="0.5" stopColor="#3FE6E0" />
        <stop offset="1" stopColor="#1FB8D0" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id={`${p}-wave`} gradientUnits="userSpaceOnUse" x1="426" y1="227" x2="602" y2="479">
        <stop offset="0" stopColor="#7FB8E0" stopOpacity="0.45" />
        <stop offset="0.5" stopColor="#5FB0D8" stopOpacity="0.5" />
        <stop offset="1" stopColor="#5FF0E0" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id={`${p}-base`} gradientUnits="userSpaceOnUse" x1="32" y1="0" x2="602" y2="0">
        <stop offset="0" stopColor="#3FA6D4" stopOpacity="0.2" />
        <stop offset="0.7" stopColor="#3FE6D4" stopOpacity="0.6" />
        <stop offset="1" stopColor="#C9FFF8" stopOpacity="0.95" />
      </linearGradient>
      <radialGradient id={`${p}-corner`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#B8FFF6" stopOpacity="0.6" />
        <stop offset="1" stopColor="#00CDB8" stopOpacity="0" />
      </radialGradient>

      {/* traces (artwork coordinates) */}
      <linearGradient id={`${p}-trace`} gradientUnits="userSpaceOnUse" x1="260" y1="0" x2="1672" y2="0">
        <stop offset="0" stopColor="#1FA9D4" stopOpacity="0" />
        <stop offset="0.35" stopColor="#3FC9E0" stopOpacity="0.55" />
        <stop offset="0.86" stopColor="#C9FFF8" stopOpacity="1" />
        <stop offset="1" stopColor="#3FE6D4" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id={`${p}-arc`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1672" y2="0">
        <stop offset="0" stopColor="#1F6FB0" stopOpacity="0" />
        <stop offset="0.5" stopColor="#2A8FD0" stopOpacity="0.7" />
        <stop offset="1" stopColor="#3FC9E0" stopOpacity="0.9" />
      </linearGradient>
    </defs>
  )
}
