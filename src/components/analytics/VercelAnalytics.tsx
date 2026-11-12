"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/**
 * Privacy filter for Vercel Web Analytics pageviews/events.
 *
 * - Strips all query parameters (Contact may use `?interest=`; future tokens/ids
 *   must never leak into analytics URLs).
 * - Drops `/api/*` paths if they ever appear as navigations.
 * - Does not add cookies, identity, or form field data from our code.
 */
export function sanitizeAnalyticsEvent(
  event: BeforeSendEvent,
): BeforeSendEvent | null {
  try {
    // Events may send absolute or path-relative URLs.
    const url = new URL(event.url, "https://www.ashvi.tech");
    if (url.pathname.startsWith("/api/")) {
      return null;
    }
    url.search = "";
    url.hash = "";
    // Preserve relative form when the input was relative.
    const cleaned = event.url.startsWith("http")
      ? url.toString()
      : `${url.pathname}${url.search}${url.hash}`;
    return { ...event, url: cleaned || "/" };
  } catch {
    return null;
  }
}

export function VercelAnalytics() {
  return <Analytics beforeSend={sanitizeAnalyticsEvent} />;
}
