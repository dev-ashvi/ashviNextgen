import { Suspense } from "react";
import Spline from "@splinetool/react-spline/next";
import { SPLINE_SCENE_URL } from "@/config/spline-embed";

/** `@splinetool/react-spline/next` — async RSC; render under Suspense from a server tree. */
export function CapitalSplineNext() {
  return (
    <div
      className="ac-capital-spline-frame"
      role="region"
      aria-label="3D scene"
    >
      <div className="ac-capital-spline-mount">
        <Suspense
          fallback={<div className="ac-capital-spline-placeholder" aria-hidden />}
        >
          <Spline
            scene={SPLINE_SCENE_URL}
            className="ac-capital-spline-viewer"
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      </div>
    </div>
  );
}
