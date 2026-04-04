"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SCHOLAR_URL =
  "https://scholar.google.com/citations?user=i3SWHncAAAAJ&hl=en";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/prateesh-goyal-2a1534253/";

export function TributeContent() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  return (
    <div
      className={`ac-memorial-root${visible ? " ac-memorial-root--visible" : ""}`}
    >
      <div className="ac-memorial-glow" aria-hidden />
      <main className="ac-memorial-main">
        <header className="ac-memorial-header ac-memorial-block">
          <p className="ac-memorial-eyebrow">In loving memory</p>
          <h1 className="ac-memorial-name">Prateesh Goyal</h1>
        </header>

        <section
          className="ac-memorial-section ac-memorial-section--lede ac-memorial-block"
          aria-label="Remembered"
        >
          <p className="ac-memorial-line">A brilliant mind.</p>
          <p className="ac-memorial-line">A relentless seeker of truth.</p>
          <p className="ac-memorial-line">A builder of the future.</p>
        </section>

        <section
          className="ac-memorial-section ac-memorial-block"
          aria-labelledby="memorial-timeline-heading"
        >
          <h2
            id="memorial-timeline-heading"
            className="ac-memorial-kicker"
          >
            Timeline
          </h2>
          <ul className="ac-memorial-timeline">
            <li>
              <span className="ac-memorial-timeline-title">IIT Bombay</span>
              <span className="ac-memorial-timeline-detail">
                {" "}
                (AIR 53, Computer Science)
              </span>
            </li>
            <li>
              <span className="ac-memorial-timeline-title">MIT Research</span>
            </li>
            <li>
              <span className="ac-memorial-timeline-title">
                Microsoft Research
              </span>
            </li>
            <li>
              <span className="ac-memorial-timeline-title">
                37+ research papers
              </span>
            </li>
          </ul>
        </section>

        <section
          className="ac-memorial-section ac-memorial-block"
          aria-labelledby="memorial-links-heading"
        >
          <h2 id="memorial-links-heading" className="ac-memorial-kicker">
            Links
          </h2>
          <ul className="ac-memorial-links">
            <li>
              <a
                href={SCHOLAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ac-memorial-external"
              >
                Research papers — Google Scholar
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ac-memorial-external"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </section>

        <section
          className="ac-memorial-section ac-memorial-block"
          aria-labelledby="memorial-philosophy-heading"
        >
          <h2 id="memorial-philosophy-heading" className="ac-memorial-kicker">
            Philosophy
          </h2>
          <p className="ac-memorial-philosophy">
            He believed in creating breakthrough technology for the good of the
            world.
          </p>
        </section>

        <footer className="ac-memorial-footer ac-memorial-block">
          <p className="ac-memorial-closing">This work continues.</p>
          <p className="ac-memorial-back-wrap">
            <Link href="/" className="ac-memorial-back">
              ← Ashvi
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
