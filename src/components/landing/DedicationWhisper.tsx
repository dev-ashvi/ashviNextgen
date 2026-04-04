"use client";

import { useEffect, useRef, useState } from "react";
import { DedicationLink } from "@/components/landing/DedicationLink";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const REVEAL_DELAY_MS = 620;
const IO_THRESHOLD = 0.22;

export function DedicationWhisper() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const armedRef = useRef(false);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting || armedRef.current) return;
        armedRef.current = true;
        setArmed(true);
        obs.disconnect();
      },
      {
        threshold: IO_THRESHOLD,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const t = globalThis.setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => globalThis.clearTimeout(t);
  }, [armed, reduced]);

  return (
    <div ref={rootRef} className="ac-dedication" aria-label="Dedication">
      <div
        className={cn(
          "ac-dedication-inner",
          revealed && "ac-dedication-inner--revealed",
        )}
      >
        <DedicationLink
          href="/legacy"
          className={cn(
            "ac-dedication-card",
            revealed && "ac-dedication-card--revealed",
            revealed && !reduced && "ac-dedication-card--attn",
          )}
        >
          <span className="ac-dedication-hint">
            Behind this, there is a story.
          </span>
          <span className="ac-dedication-main">
            Dedicated to a soul who believed in building something greater.
          </span>
        </DedicationLink>
      </div>
    </div>
  );
}
