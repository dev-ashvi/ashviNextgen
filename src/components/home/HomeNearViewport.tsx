"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

type HomeNearViewportProps = {
  /** Reserved space / SSR-friendly content shown until the heavy module mounts. */
  fallback: ReactNode;
  /** Dynamic import factory for the below-the-fold interactive module. */
  load: () => Promise<{ default: ComponentType }>;
  /** Extra rootMargin so work starts slightly before the section enters view. */
  rootMargin?: string;
  className?: string;
};

/**
 * Defers downloading/evaluating a homepage client module until near the viewport.
 * Fallback must include real headings/copy or an equivalent-height shell to avoid CLS.
 */
export function HomeNearViewport({
  fallback,
  load,
  rootMargin = "280px 0px",
  className,
}: HomeNearViewportProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loadRef = useRef(load);
  loadRef.current = load;
  const [Comp, setComp] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const mount = () => {
      void loadRef.current().then((mod) => {
        if (!cancelled) setComp(() => mod.default);
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      mount();
      return () => {
        cancelled = true;
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        mount();
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {Comp ? <Comp /> : fallback}
    </div>
  );
}
