import type { NextConfig } from "next";
import path from "path";

/**
 * Content-Security-Policy-Report-Only
 *
 * Enforced CSP is deferred: Next.js App Router ships inline bootstrap/runtime
 * script and style that currently need 'unsafe-inline' (or a nonce middleware
 * pipeline we are not introducing in Phase 4A). Report-Only still documents
 * intended origins for fonts, images, WebGL/canvas (same-origin), Contact API,
 * and clickjacking (frame-ancestors).
 *
 * Path to enforcement: add nonce-based middleware for script-src/style-src,
 * remove 'unsafe-inline', then flip Report-Only → Content-Security-Policy.
 */
const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // Next.js hydration + framework chunks. Vercel Analytics loads from same-origin
  // `/_vercel/insights/*` (or resilient same-deployment intake) when hosted on Vercel.
  "script-src 'self' 'unsafe-inline'",
  // Tailwind / next/font inject style attributes; avoid 'unsafe-eval'.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Contact POST + same-origin navigations + same-origin Vercel Analytics intake.
  // No third-party analytics hosts added (do not weaken CSP for GA/etc.).
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
  /**
   * HSTS is already emitted by Vercel/Cloudflare on ashvi.tech
   * (max-age=63072000, no includeSubDomains/preload observed). We mirror the
   * same max-age for local `next start` parity and do NOT set includeSubDomains
   * or preload without confirming every subdomain serves HTTPS.
   */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000",
  },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Homepage LCP: earliest possible discovery of the hero sculpture via HTTP Link
   * (before HTML parse completes). Matches /art/sculpture-900.webp used by Hero.
   * Site-wide security headers apply to all routes; Link preload stays homepage-only.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              "</art/sculpture-900.webp>; rel=preload; as=image; type=image/webp",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
