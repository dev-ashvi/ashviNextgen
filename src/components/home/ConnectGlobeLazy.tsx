"use client";

import dynamic from "next/dynamic";

const ConnectGlobeStage = dynamic(
  () =>
    import("@/components/home/ConnectGlobeStage").then(
      (m) => m.ConnectGlobeStage,
    ),
  { ssr: false, loading: () => null },
);

/** Client boundary so next/dynamic({ ssr: false }) is valid. */
export function ConnectGlobeLazy() {
  return <ConnectGlobeStage />;
}
