"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const LAMP_CYAN = "rgba(0, 212, 255, 0.45)";
const MASK_BG = "#000000";

type LampContainerProps = {
  children?: React.ReactNode;
  className?: string;
  /** When true, only the lamp beams render (for use as a full-area backdrop). */
  backdropOnly?: boolean;
};

export const LampContainer = ({
  children,
  className,
  backdropOnly,
}: LampContainerProps) => {
  const showContent = !backdropOnly && children != null;

  return (
    <div
      className={cn(
        "relative z-0 flex w-full flex-col items-center justify-center overflow-visible rounded-none bg-transparent",
        className,
      )}
    >
      <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            background: `conic-gradient(from 70deg at 50% 0%, ${LAMP_CYAN} 0deg, transparent 120deg)`,
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible"
        >
          <div
            className="absolute bottom-0 left-0 z-20 h-40 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ background: MASK_BG }}
          />
          <div
            className="absolute bottom-0 left-0 z-20 h-full w-40 [mask-image:linear-gradient(to_right,white,transparent)]"
            style={{ background: MASK_BG }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            background: `conic-gradient(from 290deg at 50% 0%, transparent 0deg, ${LAMP_CYAN} 120deg, transparent 120deg)`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] overflow-visible"
        >
          <div
            className="absolute bottom-0 right-0 z-20 h-full w-40 [mask-image:linear-gradient(to_left,white,transparent)]"
            style={{ background: MASK_BG }}
          />
          <div
            className="absolute bottom-0 right-0 z-20 h-40 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ background: MASK_BG }}
          />
        </motion.div>
      </div>
      {showContent ? (
        <div className="relative z-50 flex flex-col items-center px-5">
          {children}
        </div>
      ) : null}
    </div>
  );
};
