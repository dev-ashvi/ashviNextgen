/**
 * Imperative one-shot DIN timeline — no React.
 * Loaded only when the visualisation is about to play.
 */
import {
  AIS,
  HUMANS,
  PLAY_MS,
  PLAY_MS_COMPACT,
  curvePath,
  lerp,
  phasesFromSeconds,
  pointMap,
  stageLabelFor,
  type Pt,
} from "./din-geometry";

export type DinHandles = {
  label: HTMLElement | null;
  gridGroup: SVGGElement | null;
  gridPaths: SVGPathElement[];
  hybridGroup: SVGGElement | null;
  hybridPaths: Array<{
    el: SVGPathElement;
    from: string;
    to: string;
    aiLink: boolean;
  }>;
  humans: Array<{
    id: string;
    retained: boolean;
    el: SVGGElement;
  }>;
  ais: Array<{
    id: string;
    el: SVGGElement;
    outer: SVGRectElement | null;
  }>;
};

export function cacheHandles(root: HTMLElement, uid: string): DinHandles {
  const gridGroup = root.querySelector<SVGGElement>(`[data-din-grid="${uid}"]`);
  const hybridGroup = root.querySelector<SVGGElement>(
    `[data-din-hybrid="${uid}"]`,
  );

  return {
    label: root.querySelector<HTMLElement>(`[data-din-label="${uid}"]`),
    gridGroup,
    gridPaths: gridGroup
      ? Array.from(gridGroup.querySelectorAll("path"))
      : [],
    hybridGroup,
    hybridPaths: hybridGroup
      ? Array.from(hybridGroup.querySelectorAll("path")).map((el) => ({
          el,
          from: el.getAttribute("data-from") || "",
          to: el.getAttribute("data-to") || "",
          aiLink:
            (el.getAttribute("data-from") || "").startsWith("a") ||
            (el.getAttribute("data-to") || "").startsWith("a"),
        }))
      : [],
    humans: HUMANS.map((h) => ({
      id: h.id,
      retained: h.retained,
      el: root.querySelector<SVGGElement>(`[data-din-human="${h.id}"]`)!,
    })).filter((h) => h.el),
    ais: AIS.map((a) => {
      const el = root.querySelector<SVGGElement>(`[data-din-ai="${a.id}"]`)!;
      return {
        id: a.id,
        el,
        outer: el?.querySelector("rect") ?? null,
      };
    }).filter((a) => a.el),
  };
}

export function applyFrame(
  handles: DinHandles,
  sec: number,
  scale = 1,
) {
  const { removeT, relocateT, aiT, hybridEdgeT, gridEdgeT } =
    phasesFromSeconds(sec, scale);
  const pts = pointMap(relocateT);
  const labelSec = sec * scale;

  if (handles.label) handles.label.textContent = stageLabelFor(labelSec);

  if (handles.gridGroup) {
    handles.gridGroup.setAttribute("opacity", String(gridEdgeT));
  }

  if (handles.hybridGroup) {
    handles.hybridGroup.setAttribute("opacity", String(hybridEdgeT));
  }

  // Only rewrite stroke paths while edges are actively changing.
  if (gridEdgeT > 0.001 && gridEdgeT < 0.999) {
    const op = String(0.22 * gridEdgeT);
    for (const path of handles.gridPaths) {
      path.setAttribute("stroke-opacity", op);
    }
  } else if (gridEdgeT <= 0.001) {
    for (const path of handles.gridPaths) {
      path.setAttribute("stroke-opacity", "0");
    }
  }

  if (hybridEdgeT > 0.001) {
    const strokeOp = String(0.42 + hybridEdgeT * 0.28);
    const dash = String(180 * (1 - hybridEdgeT));
    for (const edge of handles.hybridPaths) {
      const a = pts.get(edge.from) as Pt;
      const b = pts.get(edge.to) as Pt;
      // Path geometry only needs updates while nodes are still relocating.
      if (relocateT < 1) {
        edge.el.setAttribute(
          "d",
          curvePath(a, b, edge.aiLink ? 0.1 : 0.06),
        );
      }
      edge.el.setAttribute("stroke-opacity", strokeOp);
      edge.el.style.strokeDashoffset = dash;
    }
  }

  for (const h of handles.humans) {
    const p = pts.get(h.id)!;
    const opacity = h.retained ? 1 : 1 - removeT;
    const nodeScale = h.retained
      ? lerp(1, 1.06, relocateT)
      : lerp(1, 0.82, removeT);
    h.el.setAttribute("opacity", String(opacity));
    h.el.setAttribute(
      "transform",
      `translate(${p.x} ${p.y}) scale(${nodeScale})`,
    );
    h.el.style.display = opacity < 0.02 ? "none" : "";
  }

  for (const a of handles.ais) {
    const p = pts.get(a.id)!;
    const nodeScale = lerp(0.55, 1, aiT);
    a.el.setAttribute("opacity", String(aiT));
    a.el.setAttribute(
      "transform",
      `translate(${p.x} ${p.y}) scale(${nodeScale})`,
    );
    a.el.style.display = aiT < 0.02 ? "none" : "";
    if (a.outer) {
      a.outer.setAttribute("stroke-opacity", String(0.75 + aiT * 0.2));
    }
  }
}

export type PlaybackControl = {
  stop: () => void;
  done: Promise<void>;
};

/** Run the ~5s (or compact) timeline once. Resolves when finished. */
export function playOnce(
  handles: DinHandles,
  opts?: { compact?: boolean; signal?: AbortSignal },
): PlaybackControl {
  const durationMs = opts?.compact ? PLAY_MS_COMPACT : PLAY_MS;
  const timeScale = PLAY_MS / durationMs;
  let raf = 0;
  let startMs = 0;
  let pauseStarted = 0;
  let pausedTotal = 0;
  let playing = true;
  let resolveDone!: () => void;
  const done = new Promise<void>((r) => {
    resolveDone = r;
  });

  const finish = () => {
    if (!playing) return;
    playing = false;
    cancelAnimationFrame(raf);
    applyFrame(handles, durationMs / 1000, timeScale);
    document.removeEventListener("visibilitychange", onVisibility);
    resolveDone();
  };

  const tick = (now: number) => {
    if (!playing) return;
    if (document.hidden) return;
    const elapsed = now - startMs - pausedTotal;
    applyFrame(handles, Math.min(durationMs, elapsed) / 1000, timeScale);
    if (elapsed < durationMs) {
      raf = requestAnimationFrame(tick);
    } else {
      finish();
    }
  };

  const onVisibility = () => {
    if (!playing) return;
    if (document.hidden) {
      pauseStarted = performance.now();
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (pauseStarted) {
      pausedTotal += performance.now() - pauseStarted;
      pauseStarted = 0;
      raf = requestAnimationFrame(tick);
    }
  };

  document.addEventListener("visibilitychange", onVisibility);

  if (opts?.signal) {
    if (opts.signal.aborted) {
      finish();
    } else {
      opts.signal.addEventListener("abort", () => finish(), { once: true });
    }
  }

  applyFrame(handles, 0, timeScale);
  startMs = performance.now();
  raf = requestAnimationFrame(tick);

  return {
    stop: () => finish(),
    done,
  };
}
