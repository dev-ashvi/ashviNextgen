"use client";

import Link from "next/link";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { CompaniesShowcase } from "@/components/landing/CompaniesShowcase";
import LightRays from "@/components/LightRays";
import { VisionStarField } from "@/components/landing/VisionStarField";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FI_SELECTOR = ".ac-fi";

type TimerId = ReturnType<typeof globalThis.setTimeout>;

/** Slide crossfade duration (match globals `ac-page-out` / `ac-page-in` ~0.7s) */
const PAGE_TRANSITION_MS = 700;

/** Hero is the last intro slide (0 opening → 3 hero), then user scrolls freely */
const INTRO_LAST_SLIDE = 3;

/** Hold on each slide before advancing (slide 1 story + slide 2 loop use longer staged sequences) */
const PAGE_HOLD_MS = [2800, 3600, 6400, 3200] as const;

/** Story slide: show content this long after slide is active (diagram + copy finish) */
const STORY_VISIBLE_MS = 4200;
/** Then fade all story components out quickly before slide 2 */
const STORY_CONTENT_FADE_MS = 280;

/** Story slide: top dot → first line → SVG draw → last line (gaps between stages) */
const STORY_INTRO_START_MS = 380;
const STORY_INTRO_STEP_MS = [320, 420, 2200] as const;
const STORY_INTRO_LAST_STAGE = 4;

/** Loop slide: staggered intro (must finish before PAGE_HOLD_MS[2] fires) */
const LOOP_INTRO_START_MS = 420;
const LOOP_INTRO_STEP_MS = [
  220, 240, 240, 200, 180, 200, 180, 200, 180, 280, 240, 240, 480, 380,
] as const;
const LOOP_INTRO_LAST_STAGE = LOOP_INTRO_STEP_MS.length;

/** Hero: DOM order unchanged (badge above headline); opacity reveal order — h1 → sub → badge → CTAs → learn more */
const HERO_INTRO_START_MS = 450;
const HERO_INTRO_STEP_MS = [520, 500, 520, 600, 450] as const;
const HERO_INTRO_LAST_STAGE = 5;
/** After final hero line appears, hold before unlocking scroll */
const HERO_COMPLETE_DWELL_MS = 2200;

function slideClass(
  index: number,
  active: number,
  trans: { from: number; to: number } | null,
  introDone: boolean,
): string {
  if (introDone) return "";
  const base = "ac-page-slide";
  if (trans) {
    if (index === trans.from) return `${base} ac-page-slide--exit`;
    if (index === trans.to) return `${base} ac-page-slide--enter`;
    if (index < trans.from) return `${base} ac-page-slide--past`;
    return `${base} ac-page-slide--future`;
  }
  if (index === active) return `${base} ac-page-slide--active`;
  if (index < active) return `${base} ac-page-slide--past`;
  return `${base} ac-page-slide--future`;
}

export function CinematicStory() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const [introSlide, setIntroSlide] = useState(0);
  const [introTransition, setIntroTransition] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const [navVisible, setNavVisible] = useState(false);
  const [storyContentFading, setStoryContentFading] = useState(false);
  const [storyIntroStage, setStoryIntroStage] = useState(0);
  const [loopIntroStage, setLoopIntroStage] = useState(0);
  const [heroIntroStage, setHeroIntroStage] = useState(0);
  const [lightRaysVisible, setLightRaysVisible] = useState(false);
  const storyPlayedRef = useRef(false);

  const completeIntro = useCallback(() => {
    setIntroTransition(null);
    setIntroDone(true);
  }, []);

  const skipToHero = useCallback(
    (e?: ReactMouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();
      completeIntro();
    },
    [completeIntro],
  );

  useEffect(() => {
    if (reduced) setIntroDone(true);
  }, [reduced]);

  useEffect(() => {
    if (!introDone) {
      setLightRaysVisible(false);
      return;
    }
    if (reduced) {
      setLightRaysVisible(true);
      return;
    }
    const id = globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(() => setLightRaysVisible(true));
    });
    return () => globalThis.cancelAnimationFrame(id);
  }, [introDone, reduced]);

  useEffect(() => {
    if (introDone || reduced) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [introDone, reduced]);

  useEffect(() => {
    if (introDone || reduced) return;
    const block = (ev: Event) => ev.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [introDone, reduced]);

  useEffect(() => {
    if (!introTransition) return;
    const id: TimerId = globalThis.setTimeout(() => {
      setIntroSlide(introTransition.to);
      setIntroTransition(null);
    }, PAGE_TRANSITION_MS);
    return () => globalThis.clearTimeout(id);
  }, [introTransition]);

  useEffect(() => {
    if (introDone || reduced || introTransition) return;
    if (introSlide === 1) return;
    if (introSlide === INTRO_LAST_SLIDE) return;

    const hold = PAGE_HOLD_MS[introSlide] ?? 3200;
    const id: TimerId = globalThis.setTimeout(() => {
      setIntroTransition({ from: introSlide, to: introSlide + 1 });
    }, hold);
    return () => globalThis.clearTimeout(id);
  }, [introSlide, introDone, reduced, introTransition]);

  useEffect(() => {
    if (introSlide !== 1) setStoryContentFading(false);
  }, [introSlide]);

  useEffect(() => {
    if (introSlide !== 1) setStoryIntroStage(0);
  }, [introSlide]);

  useEffect(() => {
    if (introSlide !== 2) setLoopIntroStage(0);
  }, [introSlide]);

  useEffect(() => {
    if (introSlide !== INTRO_LAST_SLIDE) setHeroIntroStage(0);
  }, [introSlide]);

  useEffect(() => {
    if (reduced || introDone) {
      setStoryIntroStage(STORY_INTRO_LAST_STAGE);
      return;
    }
    if (introSlide !== 1) {
      setStoryIntroStage(0);
      return;
    }
    if (introTransition || storyContentFading) return;

    setStoryIntroStage(0);
    const timeouts: TimerId[] = [];
    let acc = STORY_INTRO_START_MS;
    for (let s = 1; s <= STORY_INTRO_LAST_STAGE; s++) {
      const stage = s;
      timeouts.push(
        globalThis.setTimeout(() => setStoryIntroStage(stage), acc),
      );
      if (s < STORY_INTRO_LAST_STAGE) {
        acc += STORY_INTRO_STEP_MS[s - 1] ?? 320;
      }
    }
    return () => timeouts.forEach((id) => globalThis.clearTimeout(id));
  }, [reduced, introDone, introSlide, introTransition, storyContentFading]);

  useEffect(() => {
    if (
      introDone ||
      reduced ||
      introTransition ||
      introSlide !== 1 ||
      storyContentFading
    ) {
      return;
    }
    const id: TimerId = globalThis.setTimeout(() => {
      setStoryContentFading(true);
    }, STORY_VISIBLE_MS);
    return () => globalThis.clearTimeout(id);
  }, [
    introDone,
    reduced,
    introTransition,
    introSlide,
    storyContentFading,
  ]);

  useEffect(() => {
    if (reduced || introDone) {
      setLoopIntroStage(LOOP_INTRO_LAST_STAGE);
      return;
    }
    if (introSlide !== 2) {
      setLoopIntroStage(0);
      return;
    }
    /* Keep full loop stage during 1↔2 / 2↔3 crossfade so inner opacity does not pop back */
    if (introTransition) return;

    setLoopIntroStage(0);
    const timeouts: TimerId[] = [];
    let acc = LOOP_INTRO_START_MS;
    for (let stage = 1; stage <= LOOP_INTRO_LAST_STAGE; stage++) {
      const s = stage;
      timeouts.push(
        globalThis.setTimeout(() => setLoopIntroStage(s), acc),
      );
      acc += LOOP_INTRO_STEP_MS[stage - 1] ?? 220;
    }
    return () => timeouts.forEach((id) => globalThis.clearTimeout(id));
  }, [reduced, introDone, introSlide, introTransition]);

  useEffect(() => {
    if (reduced || introDone) {
      setHeroIntroStage(HERO_INTRO_LAST_STAGE);
      return;
    }
    if (introSlide !== INTRO_LAST_SLIDE) {
      setHeroIntroStage(0);
      return;
    }
    if (introTransition) return;

    setHeroIntroStage(0);
    const timeouts: TimerId[] = [];
    let acc = HERO_INTRO_START_MS;
    for (let s = 1; s <= HERO_INTRO_LAST_STAGE; s++) {
      const stage = s;
      timeouts.push(
        globalThis.setTimeout(() => setHeroIntroStage(stage), acc),
      );
      if (s < HERO_INTRO_LAST_STAGE) {
        acc += HERO_INTRO_STEP_MS[s - 1] ?? 500;
      }
    }
    return () => timeouts.forEach((id) => globalThis.clearTimeout(id));
  }, [reduced, introDone, introSlide, introTransition]);

  useEffect(() => {
    if (introDone || reduced || introTransition) return;
    if (introSlide !== INTRO_LAST_SLIDE) return;
    if (heroIntroStage < HERO_INTRO_LAST_STAGE) return;
    const id: TimerId = globalThis.setTimeout(
      () => completeIntro(),
      HERO_COMPLETE_DWELL_MS,
    );
    return () => globalThis.clearTimeout(id);
  }, [
    introDone,
    reduced,
    introTransition,
    introSlide,
    heroIntroStage,
    completeIntro,
  ]);

  useLayoutEffect(() => {
    if (!introDone || reduced) return;
    globalThis.scrollTo(0, 0);
  }, [introDone, reduced]);

  useEffect(() => {
    if (!storyContentFading) return;
    const id: TimerId = globalThis.setTimeout(() => {
      setIntroTransition({ from: 1, to: 2 });
    }, STORY_CONTENT_FADE_MS);
    return () => globalThis.clearTimeout(id);
  }, [storyContentFading]);

  useEffect(() => {
    const onScroll = () => {
      if (!introDone) {
        setNavVisible(false);
        return;
      }
      const hero = document.getElementById("hero");
      if (!hero) {
        setNavVisible(false);
        return;
      }
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const buffer = 48;
      setNavVisible(window.scrollY + buffer >= heroBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [introDone]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      root.querySelectorAll(FI_SELECTOR).forEach((el) => {
        el.classList.add("ac-fi--on");
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("ac-fi--on");
          }
        }
      },
      /* Positive bottom margin makes reveals reliable (negative margin caused Chrome to miss tall sections). */
      { threshold: 0.08, rootMargin: "0px 0px 12% 0px" },
    );

    root.querySelectorAll(FI_SELECTOR).forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [reduced]);

  useEffect(() => {
    const runStoryDraw = (story: HTMLElement) => {
      if (storyPlayedRef.current) return;
      storyPlayedRef.current = true;

      story.querySelectorAll(".ac-svgl").forEach((l, i) => {
        const line = l as SVGPathElement | SVGLineElement;
        const len = 300;
        line.setAttribute("stroke-dasharray", String(len));
        line.setAttribute("stroke-dashoffset", String(len));
        line.style.transition = `stroke-dashoffset 1.2s ${i * 0.2 + 0.2}s ease`;
        requestAnimationFrame(() => {
          line.setAttribute("stroke-dashoffset", "0");
          line.classList.add("ac-svgl--drawn");
        });
      });

      story.querySelectorAll(".ac-svgn").forEach((n) => {
        n.classList.add("ac-svgn--on");
      });

      story.querySelectorAll(".ac-svgt").forEach((t) => {
        const el = t as SVGTextElement;
        const d = el.style.animationDelay || "0s";
        el.style.transition = `opacity 0.7s ${d} ease`;
        setTimeout(() => el.classList.add("ac-svgt--on"), 80);
      });
    };

    if (reduced) {
      const story = document.getElementById("story");
      if (!story) return;
      story.querySelectorAll(".ac-svgl").forEach((l) => {
        const line = l as SVGLineElement;
        line.setAttribute("stroke-dashoffset", "0");
        line.classList.add("ac-svgl--drawn");
      });
      story.querySelectorAll(".ac-svgn").forEach((n) => n.classList.add("ac-svgn--on"));
      story.querySelectorAll(".ac-svgt").forEach((t) => t.classList.add("ac-svgt--on"));
      return;
    }

    const story = document.getElementById("story");
    if (!story) return;

    if (
      !introDone &&
      introSlide === 1 &&
      !introTransition &&
      storyIntroStage >= 3
    ) {
      const id = globalThis.requestAnimationFrame(() => runStoryDraw(story));
      return () => globalThis.cancelAnimationFrame(id);
    }

    if (!introDone) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || storyPlayedRef.current) continue;
          runStoryDraw(story);
        }
      },
      { threshold: 0.2 },
    );

    io.observe(story);
    return () => io.disconnect();
  }, [reduced, introDone, introSlide, introTransition, storyIntroStage]);

  useEffect(() => {
    if (reduced) return;
    const loop = document.getElementById("loop");
    if (!loop) return;

    const arcs = loop.querySelectorAll(".ac-larc");

    const applyFlow = () => {
      arcs.forEach((arc, i) => {
        const shown =
          introDone || loopIntroStage >= 10 + i; /* stages 10,11,12 === arcs */
        if (shown) arc.classList.add("ac-larc--flow");
        else arc.classList.remove("ac-larc--flow");
      });
    };

    if (!introDone && introSlide === 2 && !introTransition) {
      applyFlow();
      return;
    }

    if (!introDone) return;

    const runLoop = () => {
      arcs.forEach((arc) => arc.classList.add("ac-larc--flow"));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) runLoop();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(loop);
    applyFlow();
    return () => io.disconnect();
  }, [
    reduced,
    introDone,
    introSlide,
    introTransition,
    loopIntroStage,
  ]);

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const dot = document.getElementById("ashvi-cursor-dot");
    if (!dot) return;

    const move = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const scaleUp = () => {
      dot.style.transform = "scale(3.5)";
      dot.style.opacity = "0.4";
    };

    const scaleDn = () => {
      dot.style.transform = "scale(1)";
      dot.style.opacity = "1";
    };

    document.addEventListener("mousemove", move, { passive: true });

    const interactive =
      ".ac-landing a, .ac-landing button, .ac-page-skip, .ac-company-wrap, .ac-company-card, .ac-sol-cell, .ac-kw";
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener("mouseenter", scaleUp);
      el.addEventListener("mouseleave", scaleDn);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      document.querySelectorAll(interactive).forEach((el) => {
        el.removeEventListener("mouseenter", scaleUp);
        el.removeEventListener("mouseleave", scaleDn);
      });
    };
  }, [reduced]);

  const fglow = `${uid}-glow`;
  const fg2 = `${uid}-g2`;
  const mk = `${uid}-a`;

  const loopReveal =
    reduced || introDone ? LOOP_INTRO_LAST_STAGE : loopIntroStage;
  const loopLv = (minStage: number): CSSProperties => ({
    opacity: loopReveal >= minStage ? 1 : 0,
    transition: "opacity 0.52s cubic-bezier(0.33, 0, 0.2, 1)",
  });

  const storyReveal =
    reduced || introDone
      ? STORY_INTRO_LAST_STAGE
      : introSlide !== 1
        ? 0
        : storyIntroStage;
  const storyLv = (minStage: number): CSSProperties => ({
    opacity: storyReveal >= minStage ? 1 : 0,
    transition: "opacity 0.5s cubic-bezier(0.33, 0, 0.2, 1)",
  });

  const heroReveal =
    reduced || introDone
      ? HERO_INTRO_LAST_STAGE
      : introSlide !== INTRO_LAST_SLIDE
        ? 0
        : heroIntroStage;
  const heroLv = (minStage: number): CSSProperties => ({
    opacity: heroReveal >= minStage ? 1 : 0,
    transition: "opacity 0.52s cubic-bezier(0.33, 0, 0.2, 1)",
    pointerEvents: heroReveal >= minStage ? "auto" : "none",
  });

  const onExploreAshviClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      rootRef.current?.classList.remove("ac-landing--intro-done");
      requestAnimationFrame(() => {
        document
          .getElementById("story")
          ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      });
    },
    [reduced],
  );

  const scrollToProducts = useCallback(() => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={`ac-landing ${reduced ? "ac-landing--reduced" : ""} ${!introDone && !reduced ? "ac-landing--intro" : ""} ${introDone && !reduced ? "ac-landing--intro-done" : ""}`}
    >
      {!reduced && (
        <div
          className={`ac-page-backdrop ${introDone ? "ac-page-backdrop--fade-to-black ac-page-backdrop--behind-main" : ""}`}
          aria-hidden
        />
      )}
      {!reduced && introDone && (
        <div
          className={`ac-landing__light-rays ${lightRaysVisible ? "ac-landing__light-rays--visible" : ""}`}
          aria-hidden
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
      )}
      {!introDone && !reduced && introSlide === 0 && !introTransition && (
        <button
          type="button"
          className="ac-page-skip"
          onClick={skipToHero}
          aria-label="Skip intro and go to main section"
        >
          Skip to main
        </button>
      )}
      {!reduced && introDone && (
        <div
          id="ashvi-cursor-dot"
          className="ac-cursor-dot"
          aria-hidden
          style={{ left: -100, top: -100 }}
        />
      )}


      <nav
        id="ashvi-nav"
        className={`ac-nav ${navVisible ? "ac-nav--visible" : ""}`}
        aria-label="Primary"
      >
        <Link href="/" className="ac-logo">
          ash<b>vi</b>
        </Link>
        <div className="ac-nav-links">
          <a href="#products">Companies</a>
          <a href="#research">Research</a>
          <a href="#mission">Mission</a>
          <a href="#founder">Team</a>
          <a href="mailto:hello@ashvi.tech" className="ac-nav-cta">
            Contact
          </a>
        </div>
      </nav>

      <main className="relative z-[2]">
        <section
          className={`ac-ch ${slideClass(0, introSlide, introTransition, introDone || reduced)}`}
          id="opening"
          aria-label="Opening"
        >
          <div className="text-center">
            <p className="ac-open-line1">
              Built to ensure great minds can build
              <br />
              without being lost.
            </p>
            <p className="ac-open-line2">This is Ashvi.</p>
          </div>
          <div className="ac-scroll-nub">
            <div className="ac-snub-line" />
            <span className="ac-snub-txt">
              {!introDone && !reduced ? "Next moment" : "Scroll"}
            </span>
          </div>
        </section>

        <section
          className={`ac-ch ${slideClass(1, introSlide, introTransition, introDone || reduced)}`}
          id="story"
          aria-label="How it starts"
        >
          <div
            className={
              storyContentFading
                ? "ac-story-slide-content ac-story-slide-content--out"
                : "ac-story-slide-content"
            }
          >
          <div className="ac-story-in">
            <div className="ac-pulse-stack" style={storyLv(1)}>
              <span className="ac-pring" aria-hidden />
              <span className="ac-pring ac-pring--2" aria-hidden />
              <span className="ac-pring ac-pring--3" aria-hidden />
              <span className="ac-pdot" aria-hidden />
            </div>
            <p className="ac-st-label" style={storyLv(2)}>
              Every system begins with a signal.
            </p>
            <div className="ac-node-svg" style={storyLv(3)}>
              <svg
                viewBox="0 0 480 260"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <filter id={fglow}>
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1="240"
                  y1="40"
                  x2="60"
                  y2="210"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth="0.7"
                  className="ac-svgl"
                />
                <line
                  x1="240"
                  y1="40"
                  x2="240"
                  y2="210"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth="0.7"
                  className="ac-svgl"
                />
                <line
                  x1="240"
                  y1="40"
                  x2="420"
                  y2="210"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth="0.7"
                  className="ac-svgl"
                />
                <circle
                  cx="240"
                  cy="40"
                  r="5"
                  fill="#00D4FF"
                  filter={`url(#${fglow})`}
                  className="ac-svgn"
                />
                <circle
                  cx="60"
                  cy="210"
                  r="4"
                  fill="rgba(0,212,255,0.6)"
                  filter={`url(#${fglow})`}
                  className="ac-svgn"
                  style={{ animationDelay: "0.3s" }}
                />
                <circle
                  cx="240"
                  cy="210"
                  r="4"
                  fill="rgba(0,212,255,0.6)"
                  filter={`url(#${fglow})`}
                  className="ac-svgn"
                  style={{ animationDelay: "0.55s" }}
                />
                <circle
                  cx="420"
                  cy="210"
                  r="4"
                  fill="rgba(0,212,255,0.6)"
                  filter={`url(#${fglow})`}
                  className="ac-svgn"
                  style={{ animationDelay: "0.8s" }}
                />
                <text
                  x="50"
                  y="238"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.4)"
                  letterSpacing="0.07em"
                  textAnchor="middle"
                  className="ac-svgt"
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                    animationDelay: "0.45s",
                  }}
                >
                  Research
                </text>
                <text
                  x="240"
                  y="238"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.4)"
                  letterSpacing="0.07em"
                  textAnchor="middle"
                  className="ac-svgt"
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                    animationDelay: "0.7s",
                  }}
                >
                  Venture
                </text>
                <text
                  x="432"
                  y="238"
                  fontSize="11"
                  fontWeight="300"
                  fill="rgba(244,248,255,0.4)"
                  letterSpacing="0.07em"
                  textAnchor="middle"
                  className="ac-svgt"
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                    animationDelay: "0.95s",
                  }}
                >
                  Capital
                </text>
              </svg>
            </div>
            <p className="ac-st-label" style={storyLv(4)}>
              Three layers. One unified system.
            </p>
          </div>
          </div>
        </section>

        <section
          className={`ac-ch ${slideClass(2, introSlide, introTransition, introDone || reduced)}`}
          id="loop"
          aria-label="The loop"
        >
          <div className="ac-loop-in">
            <div className="ac-loop-svg-w">
              <svg
                viewBox="0 0 480 480"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <filter id={fg2}>
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <marker
                    id={mk}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M2 2L8 5L2 8"
                      fill="none"
                      stroke="rgba(0,212,255,0.4)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </marker>
                </defs>
                <g style={loopLv(3)}>
                  <circle
                    cx="240"
                    cy="240"
                    r="170"
                    fill="none"
                    stroke="rgba(255,255,255,0.035)"
                    strokeWidth="0.7"
                  />
                </g>
                <g style={loopLv(2)}>
                  <circle
                    cx="240"
                    cy="240"
                    r="108"
                    fill="none"
                    stroke="rgba(0,212,255,0.04)"
                    strokeWidth="0.7"
                  />
                </g>
                <g style={loopLv(10)}>
                  <path
                    d="M240 70 A170 170 0 0 1 387 355"
                    fill="none"
                    stroke="rgba(0,212,255,0.18)"
                    strokeWidth="0.8"
                    markerEnd={`url(#${mk})`}
                    className="ac-larc"
                  />
                </g>
                <g style={loopLv(11)}>
                  <path
                    d="M387 355 A170 170 0 0 1 93 355"
                    fill="none"
                    stroke="rgba(0,212,255,0.18)"
                    strokeWidth="0.8"
                    markerEnd={`url(#${mk})`}
                    className="ac-larc"
                  />
                </g>
                <g style={loopLv(12)}>
                  <path
                    d="M93 355 A170 170 0 0 1 240 70"
                    fill="none"
                    stroke="rgba(0,212,255,0.18)"
                    strokeWidth="0.8"
                    markerEnd={`url(#${mk})`}
                    className="ac-larc"
                  />
                </g>
                <g style={loopLv(1)}>
                  <circle
                    cx="240"
                    cy="240"
                    r="30"
                    fill="rgba(0,212,255,0.04)"
                    stroke="rgba(0,212,255,0.18)"
                    strokeWidth="0.7"
                  />
                  <text
                    x="240"
                    y="244"
                    fontSize="8"
                    fontWeight="300"
                    fill="rgba(0,212,255,0.55)"
                    letterSpacing="0.18em"
                    textAnchor="middle"
                    style={{
                      fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                    }}
                  >
                    ASHVI
                  </text>
                </g>
                <g style={loopLv(4)}>
                  <circle
                    cx="240"
                    cy="70"
                    r="7"
                    fill="#00D4FF"
                    filter={`url(#${fg2})`}
                  />
                  <circle
                    cx="240"
                    cy="70"
                    r="18"
                    fill="rgba(0,212,255,0.05)"
                    stroke="rgba(0,212,255,0.14)"
                    strokeWidth="0.6"
                  />
                </g>
                <g style={loopLv(5)}>
                  <circle
                    cx="387"
                    cy="355"
                    r="7"
                    fill="rgba(0,212,255,0.7)"
                    filter={`url(#${fg2})`}
                  />
                  <circle
                    cx="387"
                    cy="355"
                    r="18"
                    fill="rgba(0,212,255,0.04)"
                    stroke="rgba(0,212,255,0.12)"
                    strokeWidth="0.6"
                  />
                </g>
                <g style={loopLv(6)}>
                  <circle
                    cx="93"
                    cy="355"
                    r="7"
                    fill="rgba(0,212,255,0.7)"
                    filter={`url(#${fg2})`}
                  />
                  <circle
                    cx="93"
                    cy="355"
                    r="18"
                    fill="rgba(0,212,255,0.04)"
                    stroke="rgba(0,212,255,0.12)"
                    strokeWidth="0.6"
                  />
                </g>
                <g style={loopLv(7)}>
                  <text
                    x="240"
                    y="44"
                    fontSize="11"
                    fontWeight="300"
                    fill="rgba(244,248,255,0.5)"
                    letterSpacing="0.07em"
                    textAnchor="middle"
                    style={{
                      fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                    }}
                  >
                    Research
                  </text>
                </g>
                <g style={loopLv(8)}>
                  <text
                    x="424"
                    y="359"
                    fontSize="11"
                    fontWeight="300"
                    fill="rgba(244,248,255,0.5)"
                    letterSpacing="0.07em"
                    textAnchor="start"
                    style={{
                      fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                    }}
                  >
                    Venture
                  </text>
                </g>
                <g style={loopLv(9)}>
                  <text
                    x="55"
                    y="359"
                    fontSize="11"
                    fontWeight="300"
                    fill="rgba(244,248,255,0.5)"
                    letterSpacing="0.07em"
                    textAnchor="end"
                    style={{
                      fontFamily: "var(--font-inter), ui-sans-serif, sans-serif",
                    }}
                  >
                    Capital
                  </text>
                </g>
              </svg>
            </div>
            <div className="flex flex-col items-center gap-5">
              <p className="ac-loop-caption" style={loopLv(13)}>
                Intelligence alone is not enough.
                <br />
                It needs <em>systems, support, and belief.</em>
              </p>
              <p className="ac-loop-sub" style={loopLv(14)}>
                Ashvi exists to provide that system.
              </p>
            </div>
          </div>
        </section>

        <section
          className={`ac-ch ${slideClass(3, introSlide, introTransition, introDone || reduced)}`}
          id="hero"
          aria-label="Hero"
        >
          <div className="ac-hero-in">
            <div className="ac-hero-badge" style={heroLv(3)}>
              <span className="ac-badge-dot" aria-hidden />
              Deep Tech Venture Studio
            </div>
            <h1 className="ac-h1" style={heroLv(1)}>
              Building <strong>Intelligence.</strong>
              <br />
              Creating Companies.
            </h1>
            <p className="ac-hero-sub" style={heroLv(2)}>
              We design and build technology systems — from AI and software to
              data and infrastructure — and turn them into real-world companies
              and solutions.
            </p>
            <div className="ac-btn-row" style={heroLv(4)}>
              <a
                href="#story"
                className="ac-btn-p"
                onClick={onExploreAshviClick}
              >
                Explore Ashvi
              </a>
              <a href="#solutions" className="ac-btn-s">
                For Businesses
              </a>
            </div>
            <div className="ac-hero-learn" style={heroLv(5)}>
              <button
                type="button"
                className="ac-hero-learn__cta"
                onClick={scrollToProducts}
              >
                <span className="ac-hero-learn__label">
                  Click here to learn more
                </span>
                <span className="ac-hero-learn__arrow" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        {!introDone && !reduced && (
          <div
            className="pointer-events-none min-h-[400dvh] w-full shrink-0"
            aria-hidden
          />
        )}

        <div className="ac-hdiv" aria-hidden />

        <CompaniesShowcase />

        <section className="ac-ch" id="solutions" aria-label="Solutions">
          <div className="ac-s-label ac-fi">Technology Solutions</div>
          <div className="ac-sol-grid ac-fi ac-fi-d2">
            <article className="ac-sol-cell">
              <div className="ac-sol-name">Intelligent Automation</div>
              <div className="ac-sol-desc">
                AI systems and automation for complex, high-stakes workflows.
              </div>
            </article>
            <article className="ac-sol-cell">
              <div className="ac-sol-name">Software &amp; Platform Development</div>
              <div className="ac-sol-desc">
                Full-stack engineering from architecture to deployment at
                scale.
              </div>
            </article>
            <article className="ac-sol-cell">
              <div className="ac-sol-name">Data &amp; Decision Systems</div>
              <div className="ac-sol-desc">
                Pipelines, intelligence layers, and clarity for critical
                decisions.
              </div>
            </article>
            <article className="ac-sol-cell">
              <div className="ac-sol-name">Custom Technology Systems</div>
              <div className="ac-sol-desc">
                Bespoke systems when off-the-shelf tools are not enough.
              </div>
            </article>
          </div>
        </section>

        <div className="ac-hdiv" aria-hidden />

        <section className="ac-ch" id="research" aria-label="Research">
          <div className="ac-s-label ac-fi">Research</div>
          <p className="ac-r-lead ac-fi ac-fi-d1">
            We invest in deep technology research across AI, systems design,
            data, and scalable architectures.
          </p>
          <div className="ac-kw-cloud ac-fi ac-fi-d2">
            {[
              "Agent Architectures",
              "Model Distillation",
              "Self-Evaluating Systems",
              "Multi-Agent Intelligence",
              "Scalable Reasoning",
              "Intelligence Compression",
            ].map((k) => (
              <span key={k} className="ac-kw">
                {k}
              </span>
            ))}
          </div>
          <p className="ac-r-note ac-fi ac-fi-d3">
            Built for long-term breakthroughs, not short-term outcomes.
          </p>
        </section>

        <div className="ac-hdiv" aria-hidden />

        <section className="ac-ch" id="mission" aria-label="Mission">
          <div className="ac-mission-in">
            <p className="ac-m-label ac-fi">Our Mission</p>
            <p className="ac-m-line ac-fi ac-fi-d1">
              India has some of the most <strong>brilliant minds</strong> in the
              world.
              <br />
              But many never reach their full potential.
            </p>
            <div className="ac-m-pause ac-fi ac-fi-d2" />
            <p
              className="ac-m-line ac-fi ac-fi-d2"
              style={{ color: "var(--ashvi-gray)" }}
            >
              Not because of lack of intelligence —
              <br />
              but because the system around them is incomplete.
            </p>
            <div className="ac-m-pause ac-fi ac-fi-d3" />
            <div className="ac-m-list ac-fi ac-fi-d3">
              <div className="ac-m-item">Research is supported</div>
              <div className="ac-m-item">Builders are empowered</div>
              <div className="ac-m-item">Capital is accessible</div>
              <div className="ac-m-item">Ideas can become reality</div>
            </div>
            <div className="ac-m-pause ac-fi ac-fi-d4" />
            <p className="ac-m-final ac-fi ac-fi-d4">
              So no one building something meaningful
              <br />
              has to do it alone.
            </p>
          </div>
        </section>

        <div className="ac-hdiv" aria-hidden />

        <section className="ac-ch" id="founder" aria-label="Founder">
          <p className="ac-f-name ac-fi">
            Apoorv
            <br />
            Agrawal
          </p>
          <p className="ac-f-role ac-fi ac-fi-d2">
            Founder &amp; Chief Intelligence Officer
          </p>
          <div className="ac-f-div ac-fi ac-fi-d3" />
          <p className="ac-f-note ac-fi ac-fi-d3">
            Building systems that enable technology and people to grow together.
          </p>
        </section>

        <section className="ac-ch" id="vision" aria-label="Vision">
          <VisionStarField />
          <div className="ac-vis-in">
            <div
              className="ac-f-div ac-fi"
              style={{ background: "var(--ashvi-dim2)" }}
            />
            <p className="ac-vis-q ac-fi ac-fi-d1">
              The future will be built by systems
              <br />
              that can build <span>technology and companies.</span>
              <br />
              Ashvi is one of them.
            </p>
            <div className="ac-btn-row ac-fi ac-fi-d2">
              <a href="mailto:hello@ashvi.tech" className="ac-btn-p">
                Work with Ashvi
              </a>
              <a href="#mission" className="ac-btn-s">
                Our Mission
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="ac-footer">
        <div className="ac-ft-logo">
          ash<b>vi</b>
        </div>
        <Link href="/prateesh" className="ac-ft-tribute">
          Dedicated to a friend who believed in building something greater.
        </Link>
        <div className="flex flex-col items-end gap-1 text-right sm:items-end">
          <small>
            Bengaluru, India · {new Date().getFullYear()}
          </small>
          <Link
            href="/manifesto"
            className="text-[10px] font-light text-white/15 transition-colors hover:text-white/35"
          >
            Manifesto
          </Link>
        </div>
      </footer>
    </div>
  );
}
