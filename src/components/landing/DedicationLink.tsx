"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function DedicationLink({ href, children, className }: Props) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [exiting, setExiting] = useState(false);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNav = useCallback(() => {
    if (navTimer.current) {
      clearTimeout(navTimer.current);
      navTimer.current = null;
    }
  }, []);

  useEffect(() => () => clearNav(), [clearNav]);

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (exiting) return;
      setExiting(true);
      const ms = reduced ? 0 : 520;
      navTimer.current = setTimeout(() => {
        router.push(href);
      }, ms);
    },
    [exiting, href, reduced, router],
  );

  return (
    <>
      {exiting ? (
        <div
          className={`ac-page-exit-overlay${reduced ? " ac-page-exit-overlay--instant" : ""}`}
          aria-hidden
        />
      ) : null}
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    </>
  );
}
