import type { CSSProperties } from 'react'

/** Compact informational overlay with a teal accent bar. Real HTML, not baked into art. */
export function FloatingCard({
  title,
  subtitle,
  className = '',
  delay = 0,
}: {
  title: string
  subtitle: string
  className?: string
  delay?: number
}) {
  return (
    <div
      className={`hero-float absolute flex items-stretch gap-3.5 rounded-xl border border-white bg-white/90 py-3.5 pl-4 pr-6 shadow-[0_1px_2px_rgba(2,19,54,0.05),0_14px_34px_-14px_rgba(2,19,54,0.22)] backdrop-blur-sm ${className}`}
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      <span className="w-[2.5px] rounded-full bg-tide" aria-hidden="true" />
      <span>
        <span className="block text-[15px] font-semibold tracking-[-0.01em] text-ink">{title}</span>
        <span className="mt-0.5 block text-[13px] text-mute">{subtitle}</span>
      </span>
    </div>
  )
}
