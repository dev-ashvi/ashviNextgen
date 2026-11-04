/** Static network metaphor: existing ops → redesigned workflows → intelligent model */
export function TransformFlowVisual({ className = "" }: { className?: string }) {
  return (
    <figure className={`relative ${className}`}>
      <svg
        viewBox="0 0 640 400"
        className="mx-auto block h-auto w-full max-w-[40rem]"
        role="img"
        aria-label="Diagram showing an existing business evolving into an intelligent operating model"
      >
        <defs>
          <radialGradient id="tf-glow" cx="70%" cy="48%" r="45%">
            <stop offset="0%" stopColor="#00CDB8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#003876" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tf-link" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#003876" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00CDB8" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width="640"
          height="400"
          fill="url(#tf-glow)"
          rx="24"
        />

        {/* Stage 1 — existing structure (grid) */}
        <g>
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => {
              const x = 72 + col * 44;
              const y = 118 + row * 44;
              return (
                <g key={`g-${row}-${col}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill="#003876"
                    opacity={0.75 - row * 0.08}
                  />
                  {col < 2 ? (
                    <line
                      x1={x + 11}
                      y1={y}
                      x2={x + 33}
                      y2={y}
                      stroke="#003876"
                      strokeOpacity="0.22"
                      strokeWidth="1.2"
                    />
                  ) : null}
                  {row < 2 ? (
                    <line
                      x1={x}
                      y1={y + 11}
                      x2={x}
                      y2={y + 33}
                      stroke="#003876"
                      strokeOpacity="0.22"
                      strokeWidth="1.2"
                    />
                  ) : null}
                </g>
              );
            }),
          )}
          <text
            x="116"
            y="278"
            textAnchor="middle"
            fill="#56627A"
            fontSize="12"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontWeight="500"
          >
            Existing business
          </text>
        </g>

        {/* Arrow 1 */}
        <g stroke="url(#tf-link)" strokeWidth="1.6" fill="none">
          <path d="M210 162 C250 150, 270 150, 300 162" />
        </g>
        <polygon points="296,156 310,162 296,170" fill="#00CDB8" opacity="0.65" />

        {/* Stage 2 — redesigned workflows */}
        <g>
          <circle cx="340" cy="118" r="12" fill="#003876" />
          <circle cx="388" cy="148" r="11" fill="#003876" />
          <circle cx="334" cy="188" r="12" fill="#003876" />
          <rect
            x="366"
            y="188"
            width="22"
            height="22"
            rx="4"
            fill="#021336"
            stroke="#00CDB8"
            strokeWidth="1.6"
          />
          <circle cx="414" cy="214" r="10" fill="#003876" />
          <g stroke="#00CDB8" strokeOpacity="0.4" strokeWidth="1.2" fill="none">
            <path d="M340 130 C360 140, 370 145, 388 148" />
            <path d="M340 130 C338 160, 336 175, 334 176" />
            <path d="M388 159 C380 175, 375 190, 377 198" />
            <path d="M345 196 C355 200, 365 200, 366 199" />
            <path d="M388 210 C398 212, 406 214, 404 214" />
          </g>
          <text
            x="370"
            y="278"
            textAnchor="middle"
            fill="#56627A"
            fontSize="12"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontWeight="500"
          >
            Redesigned workflows
          </text>
        </g>

        {/* Arrow 2 */}
        <g stroke="url(#tf-link)" strokeWidth="1.6" fill="none">
          <path d="M430 170 C460 160, 480 160, 505 168" />
        </g>
        <polygon points="500,162 514,168 500,176" fill="#00CDB8" opacity="0.65" />

        {/* Stage 3 — intelligent operating model */}
        <g>
          <circle cx="548" cy="128" r="13" fill="#003876" />
          <circle cx="512" cy="178" r="12" fill="#003876" />
          <circle cx="568" cy="206" r="12" fill="#003876" />
          <rect
            x="534"
            y="158"
            width="24"
            height="24"
            rx="5"
            fill="#021336"
            stroke="#00CDB8"
            strokeWidth="1.7"
          />
          <rect
            x="580"
            y="148"
            width="20"
            height="20"
            rx="4"
            fill="#021336"
            stroke="#00CDB8"
            strokeWidth="1.5"
          />
          <g stroke="#00CDB8" strokeOpacity="0.5" strokeWidth="1.25" fill="none">
            <path d="M548 141 C545 150, 542 156, 546 158" />
            <path d="M524 178 C530 172, 534 168, 534 170" />
            <path d="M558 182 C562 190, 566 198, 568 194" />
            <path d="M558 170 C568 164, 575 160, 580 158" />
            <path d="M558 182 C568 176, 575 168, 580 168" />
            <path d="M548 141 C560 145, 570 150, 580 158" />
          </g>
          <text
            x="556"
            y="278"
            textAnchor="middle"
            fill="#56627A"
            fontSize="12"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontWeight="500"
          >
            Intelligent model
          </text>
        </g>

        <text
          x="320"
          y="348"
          textAnchor="middle"
          fill="#56627A"
          fontSize="11.5"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          letterSpacing="0.1em"
        >
          EXISTING BUSINESS → REDESIGNED WORKFLOWS → INTELLIGENT OPERATING MODEL
        </text>
      </svg>
    </figure>
  );
}
