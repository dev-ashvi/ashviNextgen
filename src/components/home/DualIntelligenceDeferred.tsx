"use client";

import { HomeNearViewport } from "@/components/home/HomeNearViewport";

function loadDin() {
  return import("@/components/home/DualIntelligenceNetwork").then((m) => ({
    default: function DualIntelligenceNetworkMount() {
      return <m.DualIntelligenceNetwork className="w-full" />;
    },
  }));
}

function DinFallback() {
  return (
    <figure className="relative w-full">
      <div
        className="relative -mb-7 w-full overflow-hidden sm:-mb-8"
        style={{ aspectRatio: "500 / 460" }}
        role="img"
        aria-label="Animation of a business operating structure transforming from a regular human staffing grid into a hybrid network of domain experts and intelligent systems"
      >
        {/* Soft field matching DIN atmosphere — reserves space without a broken empty box */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,205,184,0.07)_0%,rgba(0,56,118,0.035)_38%,transparent_70%)]"
        />
      </div>
      <figcaption className="sr-only">
        Expertise × intelligent systems — diagram loads when scrolled into view.
      </figcaption>
    </figure>
  );
}

/** Defers DIN SVG hydration/playback module until near the Belief column. */
export function DualIntelligenceDeferred() {
  return (
    <HomeNearViewport
      rootMargin="200px 0px"
      load={loadDin}
      fallback={<DinFallback />}
    />
  );
}
