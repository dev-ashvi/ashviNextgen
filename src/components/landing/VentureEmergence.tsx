"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Dimetric staircase — sequence, vectors, and face rules match reference layout. */
const STAGGER_S = 0.15;
const ENTER_DURATION = 0.5;
const MAX_ANIM_ORDER = 9;

const cubeSequence = [
  { x: 150, y: 115, animOrder: 6 },
  { x: 150, y: 70, animOrder: 7 },
  { x: 150, y: 25, animOrder: 8 },
  { x: 150, y: -20, animOrder: 9 },
  { x: 100, y: 130, animOrder: 3 },
  { x: 100, y: 85, animOrder: 4 },
  { x: 100, y: 40, animOrder: 5 },
  { x: 50, y: 145, animOrder: 1 },
  { x: 50, y: 100, animOrder: 2 },
  { x: 0, y: 160, animOrder: 0 },
] as const;

type EnrichedCube = (typeof cubeSequence)[number] & {
  showTop: boolean;
  showLeft: boolean;
  showRight: boolean;
};

function enrichCubeSequence(): EnrichedCube[] {
  return cubeSequence.map((cube) => {
    const hasCubeAbove = cubeSequence.some(
      (c) => c.x === cube.x && c.y === cube.y - 45,
    );
    const hasCubeFrontLeft = cubeSequence.some(
      (c) => c.x === cube.x - 50 && c.y === cube.y + 15,
    );
    const hasCubeFrontRight = cubeSequence.some(
      (c) => c.x === cube.x + 30 && c.y === cube.y + 30,
    );

    return {
      ...cube,
      showTop: !hasCubeAbove,
      showLeft: !hasCubeFrontLeft,
      showRight: !hasCubeFrontRight,
    };
  });
}

const enrichedSequence = enrichCubeSequence();

/** Matches :root --ashvi-cyan (#00d4ff); all glows use this hue */
const VENTURE_CYAN = "#00d4ff";

/** Dimetric cube (rotated so right face reads); glow filter id must be unique per instance. */
function VentureDimetricCube({
  showTop = true,
  showLeft = true,
  showRight = true,
  filterId,
}: {
  showTop?: boolean;
  showLeft?: boolean;
  showRight?: boolean;
  filterId: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="ac-venture-dimetric-svg"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <filter
          id={filterId}
          colorInterpolationFilters="sRGB"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="1.5"
            result="blurAlpha"
          />
          <feFlood floodColor={VENTURE_CYAN} floodOpacity="0.38" result="flood" />
          <feComposite in="flood" in2="blurAlpha" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        className="ac-venture-dimetric-edges"
        strokeWidth="0.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={`url(#${filterId})`}
      >
        {showTop && (
          <polygon
            className="ac-venture-dimetric-face ac-venture-dimetric-face--top"
            points="60,5 90,35 40,50 10,20"
          />
        )}
        {showLeft && (
          <polygon
            className="ac-venture-dimetric-face ac-venture-dimetric-face--left"
            points="10,20 40,50 40,95 10,65"
          />
        )}
        {showRight && (
          <polygon points="40,50 90,35 90,80 40,95" fill="transparent" />
        )}
      </g>
    </svg>
  );
}

export function VentureEmergence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [structureBuilt, setStructureBuilt] = useState(false);
  const isInView = useInView(wrapRef, {
    amount: 0.28,
    once: true,
    margin: "0px 0px -12% 0px",
  });

  const active = isInView;

  useEffect(() => {
    if (reduced && isInView) setStructureBuilt(true);
  }, [reduced, isInView]);

  const markBuilt = () => setStructureBuilt(true);

  return (
    <div ref={wrapRef} className="ac-venture-emergence-wrap" aria-hidden>
      <motion.div
        className={`ac-venture-staircase ac-venture-dimetric${structureBuilt ? " ac-venture-staircase--built" : ""}`}
        animate={
          !reduced && active
            ? { y: [0, -8, 0] }
            : { y: 0 }
        }
        transition={{
          duration: 5,
          repeat: reduced || !active ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="ac-venture-dimetric-stage">
          {enrichedSequence.map((cube, index) => (
            <motion.div
              key={`${cube.x}-${cube.y}-${cube.animOrder}`}
              className="ac-venture-dimetric-cube"
              style={{
                left: cube.x,
                top: cube.y,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={
                active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: ENTER_DURATION,
                      delay: cube.animOrder * STAGGER_S,
                      ease: "easeOut",
                    }
              }
              onAnimationComplete={() => {
                if (!active || cube.animOrder !== MAX_ANIM_ORDER) return;
                markBuilt();
              }}
            >
              <motion.div
                className="ac-venture-dimetric-cube-inner"
                animate={
                  reduced || !structureBuilt
                    ? { filter: "brightness(1)" }
                    : {
                        filter: [
                          "brightness(1)",
                          "brightness(1.55) drop-shadow(0 0 14px rgba(0, 212, 255, 0.38))",
                          "brightness(1)",
                        ],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: reduced || !structureBuilt ? 0 : Infinity,
                  repeatDelay: 3,
                  delay: 2.5 + cube.animOrder * 0.1,
                  ease: "easeInOut",
                }}
              >
                <VentureDimetricCube
                  showTop={cube.showTop}
                  showLeft={cube.showLeft}
                  showRight={cube.showRight}
                  filterId={`ac-vdc-glow-${index}`}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
