"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { IntroSequence } from "@/components/landing/IntroSequence";
import { VisionStarField } from "@/components/landing/VisionStarField";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FI_SELECTOR = ".ac-fi";

export function CinematicStory() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const storyPlayedRef = useRef(false);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setNavVisible(
        introDone && window.scrollY > window.innerHeight * 0.25,
      );
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
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    root.querySelectorAll(FI_SELECTOR).forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [reduced]);

  useEffect(() => {
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

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || storyPlayedRef.current) continue;
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
        }
      },
      { threshold: 0.2 },
    );

    io.observe(story);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const loop = document.getElementById("loop");
    if (!loop) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            loop.querySelectorAll(".ac-larc").forEach((arc) => {
              arc.classList.add("ac-larc--flow");
            });
          }
        }
      },
      { threshold: 0.2 },
    );

    io.observe(loop);
    return () => io.disconnect();
  }, [reduced]);

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
      ".ac-landing a, .ac-landing button, .ac-prod-cell, .ac-sol-cell, .ac-kw";
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

  return (
    <div
      ref={rootRef}
      className={`ac-landing ${reduced ? "ac-landing--reduced" : ""}`}
    >
      {!introDone && (
        <IntroSequence reduced={reduced} onComplete={handleIntroComplete} />
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
        <section className="ac-ch" id="opening" aria-label="Opening">
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
            <span className="ac-snub-txt">Scroll</span>
          </div>
        </section>

        <section className="ac-ch" id="story" aria-label="How it starts">
          <div className="ac-story-in">
            <div className="ac-pulse-stack ac-fi">
              <span className="ac-pring" aria-hidden />
              <span className="ac-pring ac-pring--2" aria-hidden />
              <span className="ac-pring ac-pring--3" aria-hidden />
              <span className="ac-pdot" aria-hidden />
            </div>
            <p className="ac-st-label ac-fi ac-fi-d1">
              Every system begins with a signal.
            </p>
            <div className="ac-node-svg ac-fi ac-fi-d2">
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
            <p className="ac-st-label ac-fi ac-fi-d3">
              Three layers. One unified system.
            </p>
          </div>
        </section>

        <section className="ac-ch" id="loop" aria-label="The loop">
          <div className="ac-loop-in">
            <div className="ac-loop-svg-w ac-fi">
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
                <circle
                  cx="240"
                  cy="240"
                  r="170"
                  fill="none"
                  stroke="rgba(255,255,255,0.035)"
                  strokeWidth="0.7"
                />
                <circle
                  cx="240"
                  cy="240"
                  r="108"
                  fill="none"
                  stroke="rgba(0,212,255,0.04)"
                  strokeWidth="0.7"
                />
                <path
                  d="M240 70 A170 170 0 0 1 387 355"
                  fill="none"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="0.8"
                  markerEnd={`url(#${mk})`}
                  className="ac-larc"
                />
                <path
                  d="M387 355 A170 170 0 0 1 93 355"
                  fill="none"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="0.8"
                  markerEnd={`url(#${mk})`}
                  className="ac-larc"
                  style={{ animationDelay: "0.5s" }}
                />
                <path
                  d="M93 355 A170 170 0 0 1 240 70"
                  fill="none"
                  stroke="rgba(0,212,255,0.18)"
                  strokeWidth="0.8"
                  markerEnd={`url(#${mk})`}
                  className="ac-larc"
                  style={{ animationDelay: "1s" }}
                />
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
                <circle cx="240" cy="70" r="7" fill="#00D4FF" filter={`url(#${fg2})`} />
                <circle
                  cx="240"
                  cy="70"
                  r="18"
                  fill="rgba(0,212,255,0.05)"
                  stroke="rgba(0,212,255,0.14)"
                  strokeWidth="0.6"
                />
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
              </svg>
            </div>
            <div className="flex flex-col items-center gap-5">
              <p className="ac-loop-caption ac-fi ac-fi-d2">
                Intelligence alone is not enough.
                <br />
                It needs <em>systems, support, and belief.</em>
              </p>
              <p className="ac-loop-sub ac-fi ac-fi-d3">
                Ashvi exists to provide that system.
              </p>
            </div>
          </div>
        </section>

        <section className="ac-ch" id="hero" aria-label="Hero">
          <div className="ac-hero-in">
            <div className="ac-hero-badge ac-fi">
              <span className="ac-badge-dot" aria-hidden />
              Deep Tech Venture Studio
            </div>
            <h1 className="ac-h1 ac-fi ac-fi-d1">
              Building <strong>Intelligence.</strong>
              <br />
              Creating Companies.
            </h1>
            <p className="ac-hero-sub ac-fi ac-fi-d2">
              We design and build technology systems — from AI and software to
              data and infrastructure — and turn them into real-world companies
              and solutions.
            </p>
            <div className="ac-btn-row ac-fi ac-fi-d3">
              <a href="#story" className="ac-btn-p">
                Explore Ashvi
              </a>
              <a href="#solutions" className="ac-btn-s">
                For Businesses
              </a>
            </div>
          </div>
        </section>

        <div className="ac-hdiv" aria-hidden />

        <section className="ac-ch" id="products" aria-label="Companies">
          <div className="ac-s-label ac-fi">Companies</div>
          <p className="ac-fi ac-fi-d1 mb-10 max-w-[520px] text-center text-sm font-light text-[var(--ashvi-gray)]">
            Each company is built through this system.
          </p>
          <div className="ac-prod-grid ac-fi ac-fi-d2">
            <article className="ac-prod-cell">
              <div className="ac-prod-name">PokerForge</div>
              <div className="ac-prod-desc">
                Simulation and strategy systems for decision-making.
              </div>
              <div className="ac-prod-tag">Live</div>
            </article>
            <article className="ac-prod-cell">
              <div className="ac-prod-name">HeroDuo</div>
              <div className="ac-prod-desc">
                Human + technology collaboration system.
              </div>
              <div className="ac-prod-tag">Building</div>
            </article>
            <article className="ac-prod-cell">
              <div className="ac-prod-name">AI CFO</div>
              <div className="ac-prod-desc">
                Financial intelligence platform built with partners.
              </div>
              <div className="ac-prod-tag">Partners</div>
            </article>
          </div>
        </section>

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
