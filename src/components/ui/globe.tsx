"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

/** Radians / ms — slow architectural turn (~0.04 rad/s). */
const ROTATION_SPEED = 0.000045;

/**
 * Initial yaw favoring South Asia / Indian Ocean in frame.
 * Tuned against live COBE renders (not assumed longitude math alone).
 */
const INITIAL_PHI = 2.55;

/**
 * AshviTech-tuned COBE — dark globe, bright land points.
 * Brightness held ~10–15% under prior pass so the headline stays primary.
 */
export const ASHVI_GLOBE_CONFIG: Omit<COBEOptions, "width" | "height"> = {
  devicePixelRatio: 2,
  phi: INITIAL_PHI,
  theta: 0.22,
  dark: 1,
  diffuse: 1,
  mapSamples: 16000,
  mapBrightness: 4.6,
  mapBaseBrightness: 0.03,
  baseColor: [0.38, 0.6, 0.66],
  markerColor: [0.2, 0.85, 0.78],
  glowColor: [0.07, 0.38, 0.44],
  opacity: 1,
  markers: [],
};

type GlobeProps = {
  className?: string;
  config?: Partial<COBEOptions>;
  /** When false, skips auto-rotation (reduced motion / offscreen). */
  autoRotate?: boolean;
  /** Cap pixel ratio for performance (default 1.75). */
  maxDpr?: number;
};

/**
 * Magic UI Globe pattern on COBE v2.
 * @see https://magicui.design/docs/components/globe
 */
export function Globe({
  className,
  config = {},
  autoRotate = true,
  maxDpr = 1.75,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(INITIAL_PHI);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerOrigin = useRef(0);
  const autoRotateRef = useRef(autoRotate);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    // Explicit null check — clientX of 0 is a valid pointer position.
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerOrigin.current;
      r.set(delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
      const g = globeRef.current;
      if (g && widthRef.current > 0) {
        const side = widthRef.current * 2;
        g.update({ width: side, height: side });
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const side = Math.max(widthRef.current, 1) * 2;
    const startPhi = config.phi ?? ASHVI_GLOBE_CONFIG.phi;
    phiRef.current = startPhi;

    try {
      globeRef.current = createGlobe(canvas, {
        ...ASHVI_GLOBE_CONFIG,
        ...config,
        devicePixelRatio: dpr,
        width: side,
        height: side,
        phi: startPhi,
        theta: config.theta ?? ASHVI_GLOBE_CONFIG.theta,
      });
    } catch {
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    lastFrameRef.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - lastFrameRef.current);
      lastFrameRef.current = now;

      if (
        autoRotateRef.current &&
        pointerInteracting.current === null
      ) {
        phiRef.current += ROTATION_SPEED * dt;
      }

      globeRef.current?.update({
        phi: phiRef.current + rs.get(),
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const fade = window.setTimeout(() => {
      canvas.style.opacity = "1";
    }, 0);

    return () => {
      window.clearTimeout(fade);
      cancelAnimationFrame(rafRef.current);
      globeRef.current?.destroy();
      globeRef.current = null;
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config, maxDpr]);

  return (
    <div
      className={cn("absolute inset-0 mx-auto aspect-[1/1] w-full", className)}
    >
      <canvas
        ref={canvasRef}
        className="size-full touch-none opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        onPointerDown={(e) => {
          pointerOrigin.current = e.clientX;
          updatePointerInteraction(e.clientX);
          // Capture so drag doesn't fight page scroll mid-gesture.
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }}
        onPointerUp={(e) => {
          updatePointerInteraction(null);
          e.currentTarget.releasePointerCapture?.(e.pointerId);
          // Fold drag offset into phi so spring doesn't snap back.
          phiRef.current += r.get();
          r.set(0);
        }}
        onPointerCancel={() => {
          updatePointerInteraction(null);
          phiRef.current += r.get();
          r.set(0);
        }}
        onPointerOut={() => {
          if (pointerInteracting.current !== null) return;
          updatePointerInteraction(null);
        }}
        onPointerMove={(e) => updateMovement(e.clientX)}
      />
    </div>
  );
}
