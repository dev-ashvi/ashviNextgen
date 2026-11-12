"use client";

import { HomeNearViewport } from "@/components/home/HomeNearViewport";

function loadGlobe() {
  return import("@/components/home/ConnectGlobeStage").then((m) => ({
    default: m.ConnectGlobeStage,
  }));
}

/**
 * Client boundary: COBE/motion only download when the Connect panel nears the viewport.
 * Fallback keeps the navy panel atmosphere (parent) — no blank content flash.
 */
export function ConnectGlobeLazy() {
  return (
    <HomeNearViewport
      rootMargin="240px 0px"
      load={loadGlobe}
      fallback={null}
    />
  );
}
