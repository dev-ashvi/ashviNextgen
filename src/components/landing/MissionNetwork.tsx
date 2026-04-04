"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MissionNetworkProps = {
  /** Fires once when the network sequence starts (flow line can subtly react). */
  onActive?: () => void;
};

const IO = { threshold: 0.08, rootMargin: "0px 0px 12% 0px" } as const;

/** Minimal constellation below the mission flow — nodes then connecting lines. */
export function MissionNetwork({ onActive }: MissionNetworkProps) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      setActive(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setActive(true);
        if (!firedRef.current) {
          firedRef.current = true;
          onActive?.();
        }
        obs.disconnect();
      }
    }, IO);
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, onActive]);

  return (
    <div
      ref={rootRef}
      className={`ac-m-network${active ? " ac-m-network--active" : ""}${reduced ? " ac-m-network--reduced" : ""}`}
      aria-hidden
    >
      <svg
        className="ac-m-network-svg"
        viewBox="0 0 280 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="ac-m-network-line ac-m-network-line--1"
          d="M 28 48 L 96 42"
          pathLength={1}
        />
        <path
          className="ac-m-network-line ac-m-network-line--2"
          d="M 96 42 L 168 46"
          pathLength={1}
        />
        <path
          className="ac-m-network-line ac-m-network-line--3"
          d="M 168 46 L 248 40"
          pathLength={1}
        />
        <g className="ac-m-network-node-wrap" transform="translate(28,48)">
          <g className="ac-m-network-node ac-m-network-node--1">
            <circle className="ac-m-network-dot" r={3.25} cx={0} cy={0} />
          </g>
        </g>
        <g className="ac-m-network-node-wrap" transform="translate(96,42)">
          <g className="ac-m-network-node ac-m-network-node--2">
            <circle className="ac-m-network-dot" r={3.25} cx={0} cy={0} />
          </g>
        </g>
        <g className="ac-m-network-node-wrap" transform="translate(168,46)">
          <g className="ac-m-network-node ac-m-network-node--3">
            <circle className="ac-m-network-dot" r={3.25} cx={0} cy={0} />
          </g>
        </g>
        <g className="ac-m-network-node-wrap" transform="translate(248,40)">
          <g className="ac-m-network-node ac-m-network-node--4">
            <circle className="ac-m-network-dot" r={3.25} cx={0} cy={0} />
          </g>
        </g>
      </svg>
    </div>
  );
}
