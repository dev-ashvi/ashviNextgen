"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Original abstract visualisation — geometric peak + flowing intelligence curve.
 * Inspired by the AshviTech mark without reproducing the logo artwork.
 */
export function IntelligenceField({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 ashvi-grid opacity-70" />
      <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-ashvi-blue/10 blur-3xl" />
      <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-ashvi-teal/10 blur-3xl" />

      <svg
        viewBox="0 0 640 480"
        className="relative h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="peakFill" x1="120" y1="80" x2="420" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#003876" stopOpacity="0.9" />
            <stop offset="1" stopColor="#021336" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="flowStroke" x1="80" y1="280" x2="560" y2="160" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00CDB8" stopOpacity="0" />
            <stop offset="0.35" stopColor="#00CDB8" stopOpacity="0.85" />
            <stop offset="1" stopColor="#003876" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Soft structural planes */}
        <path
          d="M90 390 L250 120 L410 390 Z"
          fill="url(#peakFill)"
          opacity="0.88"
        />
        <path
          d="M250 120 L410 390 L470 390 L310 120 Z"
          fill="#06183D"
          opacity="0.35"
        />

        {/* Flowing intelligence curve cutting the peak */}
        <motion.path
          d="M70 300 C180 290, 210 210, 280 200 C360 188, 390 250, 470 230 C530 216, 560 180, 590 150"
          stroke="url(#flowStroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={reduce ? undefined : { pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />

        {/* Accent tip */}
        <motion.path
          d="M292 168 L318 112 L336 176 Z"
          fill="#00CDB8"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Orbiting nodes — human + machine meeting points */}
        {[
          [168, 250],
          [320, 210],
          [430, 248],
          [520, 188],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill={i === 2 ? "#00CDB8" : "#003876"}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={
              reduce
                ? undefined
                : {
                    opacity: [0.35, 1, 0.35],
                    scale: [0.9, 1.15, 0.9],
                  }
            }
            transition={{
              duration: 3.6,
              delay: 0.8 + i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Horizon baseline */}
        <path
          d="M60 390 H580"
          stroke="#003876"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
