/**
 * Hero environment — layered light, not decoration.
 * 1. Cloud White base (from the section).
 * 2. Broad, soft ambient light fields (elliptical, low opacity — never visible as blobs).
 * 3. Oversized sweeping light forms: one entering from the upper-left,
 *    a complementary pair at the lower-right. They extend beyond the viewport.
 */
export function HeroAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* ambient light fields */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_62%_at_74%_48%,rgba(0,56,118,0.085)_0%,rgba(0,56,118,0.035)_45%,transparent_75%)]" />
      <div className="hero-haze absolute inset-0 bg-[radial-gradient(ellipse_40%_32%_at_70%_78%,rgba(0,205,184,0.045)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_60%_at_24%_46%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.6)_45%,transparent_80%)]" />

      {/* sweeping environmental forms */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sweep-ul" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B7D3EE" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#D9E8F7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F8F9FD" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sweep-lr" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#9FD0EF" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#C4E2F5" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F8F9FD" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sweep-lr2" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#B9DDF3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F8F9FD" stopOpacity="0" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="soft-line" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* upper-left sweep */}
        <g filter="url(#soft)">
          <path d="M -160 -160 L 700 -160 C 470 -70, 210 110, -160 470 Z" fill="url(#sweep-ul)" />
        </g>
        <path
          d="M -120 330 C 120 110, 360 -10, 640 -110"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.95"
          strokeWidth="5"
          filter="url(#soft-line)"
        />
        <path d="M -120 420 C 140 170, 400 30, 720 -90" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" filter="url(#soft-line)" />

        {/* lower-right sweeps */}
        <g filter="url(#soft)">
          <path d="M 1640 470 C 1460 720, 1230 880, 980 1080 L 1640 1080 Z" fill="url(#sweep-lr)" />
          <path d="M 1620 380 C 1470 660, 1250 860, 1040 1080 L 1620 1080 Z" fill="url(#sweep-lr2)" opacity="0.7" />
        </g>
        {/* crisp inner edge of the sweep, as in the reference */}
        <path
          d="M 1560 520 C 1390 740, 1180 880, 960 1000"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.95"
          strokeWidth="5"
          filter="url(#soft-line)"
        />
        <path d="M 1600 640 C 1450 800, 1280 900, 1110 1000" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.5" filter="url(#soft-line)" />
      </svg>
    </div>
  )
}
