"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** SSR default: assume motion is OK; CSS `.ashvi-reveal` keeps reduced-motion users visible. */
function getServerSnapshot() {
  return false;
}

/**
 * Syncs with `prefers-reduced-motion` without a post-paint effect delay.
 * Uses `useSyncExternalStore` so client hydration matches the live media query.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
