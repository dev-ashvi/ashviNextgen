"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type AnimatedRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

/**
 * Lightweight once-in-view reveal — CSS transitions only.
 * Avoids pulling motion/react (~100KB+) into page bundles.
 *
 * Reduced-motion users never depend on IntersectionObserver or JS timing:
 * `.ashvi-reveal` stays visible via CSS `@media (prefers-reduced-motion: reduce)`.
 */
export function AnimatedReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: AnimatedRevealProps) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const Tag = as;
  const shown = reduce || visible;

  useEffect(() => {
    if (reduce) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        io.disconnect();
      },
      { rootMargin: "-10% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "ashvi-reveal transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        shown
          ? "ashvi-reveal--visible translate-y-0 opacity-100"
          : "translate-y-[18px] opacity-0",
        className,
      )}
      style={delay && !reduce ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
