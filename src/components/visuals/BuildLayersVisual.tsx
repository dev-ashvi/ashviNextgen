/** Static layered diagram: Domain Expertise + AI Engineering → AI-Native Venture */
export function BuildLayersVisual({ className = "" }: { className?: string }) {
  return (
    <figure className={`relative ${className}`}>
      <svg
        viewBox="0 0 640 420"
        className="mx-auto block h-auto w-full max-w-[40rem]"
        role="img"
        aria-label="Diagram showing domain expertise and AI engineering combining into an AI-native venture"
      >
        <defs>
          <linearGradient id="bl-glow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#00CDB8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#003876" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="bl-layer-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#003876" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#021336" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="bl-layer-b" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#021336" />
            <stop offset="100%" stopColor="#003876" />
          </linearGradient>
          <linearGradient id="bl-venture" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00CDB8" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#003876" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#021336" />
          </linearGradient>
        </defs>

        <ellipse cx="320" cy="210" rx="250" ry="170" fill="url(#bl-glow)" />

        {/* Domain expertise layer */}
        <g>
          <rect
            x="48"
            y="72"
            width="220"
            height="88"
            rx="18"
            fill="url(#bl-layer-a)"
          />
          <circle cx="88" cy="116" r="14" fill="#F8F9FD" opacity="0.95" />
          <circle cx="88" cy="112" r="5" fill="#003876" />
          <path
            d="M76 128c4-8 12-12 24-12s20 4 24 12"
            fill="none"
            stroke="#003876"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <text
            x="118"
            y="108"
            fill="#F8F9FD"
            fontSize="15"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontWeight="600"
          >
            Domain Expertise
          </text>
          <text
            x="118"
            y="130"
            fill="rgba(244,247,252,0.62)"
            fontSize="12"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            Markets · customers · judgement
          </text>
        </g>

        {/* AI engineering layer */}
        <g>
          <rect
            x="48"
            y="188"
            width="220"
            height="88"
            rx="18"
            fill="url(#bl-layer-b)"
          />
          <rect
            x="74"
            y="214"
            width="28"
            height="28"
            rx="6"
            fill="#021336"
            stroke="#00CDB8"
            strokeWidth="1.8"
          />
          <rect
            x="81"
            y="221"
            width="14"
            height="14"
            rx="2.5"
            fill="none"
            stroke="#00CDB8"
            strokeWidth="1.4"
          />
          <text
            x="118"
            y="224"
            fill="#F8F9FD"
            fontSize="15"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontWeight="600"
          >
            AI Engineering
          </text>
          <text
            x="118"
            y="246"
            fill="rgba(244,247,252,0.62)"
            fontSize="12"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            Architecture · systems · product
          </text>
        </g>

        {/* Convergence paths */}
        <g
          fill="none"
          stroke="#00CDB8"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M268 116 C330 116, 340 150, 392 198" />
          <path d="M268 232 C330 232, 340 220, 392 208" />
        </g>
        <polygon
          points="388,198 402,204 388,218"
          fill="#00CDB8"
          opacity="0.7"
        />

        {/* AI-native venture */}
        <g>
          <rect
            x="400"
            y="148"
            width="196"
            height="120"
            rx="22"
            fill="url(#bl-venture)"
            stroke="#00CDB8"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          <circle cx="448" cy="188" r="11" fill="#F8F9FD" opacity="0.9" />
          <rect
            x="468"
            y="178"
            width="20"
            height="20"
            rx="4"
            fill="#021336"
            stroke="#00CDB8"
            strokeWidth="1.5"
          />
          <text
            x="448"
            y="232"
            fill="#F8F9FD"
            fontSize="15"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontWeight="600"
          >
            AI-Native Venture
          </text>
          <text
            x="448"
            y="252"
            fill="rgba(244,247,252,0.65)"
            fontSize="12"
            fontFamily="var(--font-sans), system-ui, sans-serif"
          >
            Designed for a new model
          </text>
        </g>

        <text
          x="320"
          y="392"
          textAnchor="middle"
          fill="#56627A"
          fontSize="12"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          letterSpacing="0.12em"
        >
          DOMAIN EXPERTISE + AI ENGINEERING → AI-NATIVE VENTURE
        </text>
      </svg>
    </figure>
  );
}
