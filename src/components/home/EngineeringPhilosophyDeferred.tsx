"use client";

import { HomeNearViewport } from "@/components/home/HomeNearViewport";
import { EngineeringPhilosophyFallback } from "@/components/home/EngineeringPhilosophyFallback";

function loadEngineeringPhilosophy() {
  return import("@/components/home/EngineeringPhilosophySection").then(
    (m) => ({ default: m.EngineeringPhilosophySection }),
  );
}

/** Below-fold interactive philosophy — JS loads near viewport; fallback keeps copy visible. */
export function EngineeringPhilosophyDeferred() {
  return (
    <HomeNearViewport
      rootMargin="320px 0px"
      load={loadEngineeringPhilosophy}
      fallback={<EngineeringPhilosophyFallback />}
    />
  );
}
