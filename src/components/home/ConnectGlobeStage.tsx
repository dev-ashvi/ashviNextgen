"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "@/components/ui/globe";

/**
 * Large cropped Magic UI / COBE globe for the Let's Connect panel.
 * Lazy-mounts near viewport; pauses rotation when offscreen or reduced-motion.
 */
export function ConnectGlobeStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [nearView, setNearView] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible) setNearView(true);
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setFailed(true);
    } catch {
      setFailed(true);
    }
  }, []);

  const showGlobe = nearView && !failed && !reduceMotion;

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Soft teal ambient behind the globe — restrained, not a halo */}
      <div className="absolute -bottom-[18%] -right-[8%] h-[65%] w-[52%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,205,184,0.11)_0%,rgba(0,56,118,0.1)_45%,transparent_72%)]" />

      {showGlobe ? (
        <div
          className={[
            "absolute",
            // Large cropped hemisphere — centre toward lower-right edge
            "h-[340px] w-[340px] sm:h-[420px] sm:w-[420px]",
            "lg:h-[580px] lg:w-[580px] xl:h-[620px] xl:w-[620px]",
            "-right-[28%] bottom-[-32%] sm:-right-[24%] sm:bottom-[-28%]",
            "lg:-right-[18%] lg:bottom-[-38%] xl:-right-[16%]",
            "opacity-[0.88] lg:opacity-95",
          ].join(" ")}
          style={{
            // Soften left limb into navy; keep top-right atmospheric rim intact
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 14%, rgba(0,0,0,0.75) 32%, #000 48%, #000 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 14%, rgba(0,0,0,0.75) 32%, #000 48%, #000 100%)",
          }}
        >
          <Globe autoRotate={inView} maxDpr={1.5} />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(2,19,54,0.97)_0%,rgba(2,19,54,0.72)_16%,rgba(2,19,54,0.35)_30%,rgba(2,19,54,0.1)_42%,transparent_56%)]"
            aria-hidden="true"
          />
        </div>
      ) : (
        <StaticGlobeFallback />
      )}
    </div>
  );
}

/** Lightweight CSS fallback when WebGL is unavailable or motion is reduced. */
function StaticGlobeFallback() {
  return (
    <div
      className={[
        "absolute rounded-full",
        "h-[300px] w-[300px] sm:h-[380px] sm:w-[380px]",
        "lg:h-[520px] lg:w-[520px] xl:h-[560px] xl:w-[560px]",
        "-right-[30%] bottom-[-36%] sm:-right-[26%] sm:bottom-[-30%]",
        "lg:-right-[20%] lg:bottom-[-40%]",
        "opacity-50",
        "bg-[radial-gradient(circle_at_38%_42%,rgba(0,205,184,0.22)_0%,rgba(0,56,118,0.35)_38%,rgba(2,19,54,0.9)_72%)]",
        "ring-1 ring-inset ring-white/10",
        "shadow-[inset_-40px_-20px_60px_rgba(0,0,0,0.45)]",
      ].join(" ")}
    />
  );
}
