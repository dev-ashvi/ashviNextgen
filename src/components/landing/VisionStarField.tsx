"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Star = {
  x: number;
  y: number;
  s: number;
  a: number;
  da: number;
  vy: number;
};

export function VisionStarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const starsRef = useRef<Star[] | null>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;

    const resize = () => {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const initStars = () => {
      starsRef.current = Array.from({ length: 180 }, () => ({
        x: Math.random(),
        y: Math.random(),
        s: Math.random() * 0.8 + 0.2,
        a: Math.random() * 0.5 + 0.08,
        da: (Math.random() - 0.5) * 0.0018,
        vy: Math.random() * 0.00013 + 0.00003,
      }));
    };

    const frame = () => {
      if (!running || !starsRef.current) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (const s of starsRef.current) {
        s.y -= s.vy;
        if (s.y < 0) s.y = 1;
        s.a += s.da;
        if (s.a > 0.65 || s.a < 0.05) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${s.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          if (!running) {
            resize();
            if (!starsRef.current) initStars();
            running = true;
            frame();
          }
        } else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.08 },
    );

    obs.observe(wrap);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener("resize", resize);
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-hidden
      />
    </div>
  );
}
