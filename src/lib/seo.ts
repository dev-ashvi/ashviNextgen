import type { Metadata } from "next";

/** Preferred production origin (apex redirects here with 308). */
export const SITE_ORIGIN = "https://www.ashvi.tech";

export const SITE_NAME = "AshviTech";

export const DEFAULT_TITLE = "AshviTech — Building AI-Native Businesses";

export const DEFAULT_DESCRIPTION =
  "AshviTech is an AI-native technology company building new businesses with domain experts and exploring how intelligent systems can transform existing operations.";

/** Existing approved social share image (do not replace). */
export const OG_IMAGE = {
  url: "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: "AshviTech",
} as const;

/** Public logo for Organization JSON-LD. */
export const ORGANIZATION_LOGO_PATH = "/brand/logo-horizontal.png";

export const CONTACT_EMAIL = "hello@ashvi.tech";

export function absoluteUrl(path: string = "/"): string {
  if (path === "/" || path === "") return `${SITE_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}

type PageSeoInput = {
  /** Document title segment (template applies) or absolute home title via layout. */
  title: string;
  description: string;
  /** Path beginning with `/`, or `/` for home. */
  path: string;
  /** Absolute Open Graph / Twitter title (avoid inheriting homepage OG title). */
  ogTitle: string;
};

/**
 * Full per-page Metadata including canonical, Open Graph, and Twitter.
 * Always re-specifies `images` so nested openGraph merges do not drop the OG image.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  ogTitle,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const imageAbs = absoluteUrl(OG_IMAGE.url);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      url,
      images: [
        {
          url: OG_IMAGE.url,
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
          alt: OG_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [imageAbs],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: absoluteUrl(ORGANIZATION_LOGO_PATH),
    email: CONTACT_EMAIL,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  };
}
