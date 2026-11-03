/**
 * Studio stage for the sculpture — measured against the approved reference render.
 *
 * Coordinates are in the trimmed sculpture image's own pixel space (1698 × 1266),
 * so every layer stays locked to the artwork as it scales. Anchors were measured
 * from the PNG's visible alpha (not the element box):
 *   - the hull's lowest point (contact) is at x≈520, y≈1263
 *   - the base's right tip is at x≈725, y≈1236
 * Reference positions were mapped into this space using the tip as the anchor
 * (scale ≈ 0.445 ref px per image px).
 *
 * Each light is an independent, tunable entry below (centre, radii, colour ramp).
 * Everything renders behind the sculpture. Radial gradients only — no filters.
 */
const W = 1698
const H = 1266

export const CONTACT = { x: 520, y: 1263 }
export const TIP = { x: 725, y: 1236 }

type Stop = [offset: number, color: string, opacity: number]
type Light = { id: string; cx: number; cy: number; rx: number; ry: number; stops: Stop[]; rotate?: number }

/** Behind everything: room light and the floor plane. */
const BACK: Light[] = [
  // cool depth at the falloff of the backlight
  { id: 'depth', cx: W * 0.55, cy: H * 0.5, rx: W * 0.62, ry: H * 0.62, stops: [[0.55, '#003876', 0], [0.8, '#003876', 0.05], [1, '#003876', 0]] },
  // blue-white backlight behind the form
  { id: 'backlight', cx: W * 0.56, cy: H * 0.46, rx: W * 0.5, ry: H * 0.5, stops: [[0, '#FFFFFF', 0.95], [0.35, '#EEF4FB', 0.8], [0.62, '#DCE8F6', 0.4], [0.82, '#DCE8F6', 0.15], [1, '#DCE8F6', 0]] },
  // pale floor illumination: bright where the object stands
  { id: 'floor', cx: W * 0.47, cy: CONTACT.y + 18, rx: W * 0.78, ry: H * 0.15, stops: [[0, '#FFFFFF', 1], [0.3, '#FAFCFF', 0.9], [0.55, '#E1EDF8', 0.5], [0.78, '#E1EDF8', 0.22], [1, '#E1EDF8', 0]] },
  // pale cyan-blue light spreading to the right of the contact (ref: x 1160–1360)
  { id: 'cyan-wash', cx: 1150, cy: 1250, rx: 520, ry: 110, stops: [[0, '#B4D9EE', 0.45], [0.5, '#C9E3F3', 0.25], [1, '#D9ECF7', 0]] },
]

/** Grounding: ambient → directional → teal → contact (back to front). */
const GROUND: Light[] = [
  // broad blue-grey ambient floor shadow (ref: x tip−290…tip+280, y tip−26…tip+38)
  { id: 'ambient', cx: 640, cy: 1290, rx: 760, ry: 150, stops: [[0, '#5F8DBA', 0.55], [0.4, '#8AAFD4', 0.36], [0.75, '#BCD4EB', 0.1], [1, '#BCD4EB', 0]] },
  // pale cyan-blue floor light to the right (ref: tip+90…tip+300)
  { id: 'cyan-floor', cx: 1130, cy: 1236, rx: 360, ry: 70, stops: [[0, '#5FB0D6', 0.62], [0.5, '#8FC6E4', 0.34], [1, '#C4E1F2', 0]] },
  // far reach of the directional shadow, feathering out to the left
  { id: 'directional-wide', cx: 260, cy: 1282, rx: 500, ry: 112, stops: [[0, '#6E95BE', 0.4], [0.45, '#94B4D6', 0.22], [0.8, '#BFD5EB', 0.06], [1, '#BFD5EB', 0]] },
  // directional shadow: darkest just left of the contact, stretched further left
  { id: 'directional', cx: 360, cy: 1266, rx: 360, ry: 82, stops: [[0, '#244E73', 0.86], [0.38, '#3F6C96', 0.58], [0.72, '#86AACD', 0.16], [1, '#86AACD', 0]] },
  // wide cyan bounce from the translucent ribbon (ref 't': ~450×72 image px)
  { id: 'cyan-bounce', cx: 760, cy: 1268, rx: 560, ry: 104, stops: [[0, '#2FBFCB', 0.62], [0.35, '#55C6D3', 0.42], [0.7, '#93D5E3', 0.14], [1, '#93D5E3', 0]] },
  // concentrated teal contact reflection under the right half of the base (ref 'T')
  { id: 'teal-contact', cx: 630, cy: 1266, rx: 240, ry: 64, stops: [[0, '#2AF5E6', 1], [0.35, '#00DFCB', 0.8], [0.7, '#1CC6C4', 0.25], [1, '#1CC6C4', 0]] },
  // teal spilling just past the base's right tip, where the ribbon's light lands
  { id: 'teal-tip', cx: TIP.x + 40, cy: TIP.y + 8, rx: 120, ry: 28, stops: [[0, '#28E8DA', 0.72], [0.5, '#4FDAD6', 0.3], [1, '#4FDAD6', 0]] },
  // contact shadow: narrow, dark blue, exactly under the hull's lowest point
  { id: 'contact', cx: CONTACT.x - 30, cy: CONTACT.y - 3, rx: 190, ry: 15, stops: [[0, '#04203F', 0.9], [0.45, '#0B3560', 0.55], [0.8, '#1E4E7E', 0.12], [1, '#1E4E7E', 0]] },
  // hull shadow: the curved underside rises to the left, so its shadow trails left
  { id: 'hull', cx: 300, cy: 1250, rx: 240, ry: 22, stops: [[0, '#1F4A72', 0.55], [0.5, '#3A6690', 0.25], [1, '#3A6690', 0]] },
]

function Lights({ lights, prefix }: { lights: Light[]; prefix: string }) {
  return (
    <>
      <defs>
        {lights.map((l) => (
          <radialGradient key={l.id} id={`${prefix}-${l.id}`}>
            {l.stops.map(([o, c, a], i) => (
              <stop key={i} offset={`${o * 100}%`} stopColor={c} stopOpacity={a} />
            ))}
          </radialGradient>
        ))}
      </defs>
      {lights.map((l) => (
        <ellipse
          key={l.id}
          cx={l.cx}
          cy={l.cy}
          rx={l.rx}
          ry={l.ry}
          fill={`url(#${prefix}-${l.id})`}
          transform={l.rotate ? `rotate(${l.rotate} ${l.cx} ${l.cy})` : undefined}
        />
      ))}
    </>
  )
}

export function Stage({ layer }: { layer: 'back' | 'shadow' }) {
  const vb = `${-0.25 * W} ${-0.1 * H} ${1.5 * W} ${1.4 * H}`
  return (
    <svg
      aria-hidden="true"
      viewBox={vb}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-[-25%] top-[-10%] h-[140%] w-[150%] overflow-visible ${
        layer === 'shadow' ? 'sculpt-shadow' : ''
      }`}
    >
      {layer === 'back' ? <Lights lights={BACK} prefix="st-back" /> : <Lights lights={GROUND} prefix="st-ground" />}
    </svg>
  )
}
