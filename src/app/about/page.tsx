import type { Metadata } from "next";
import { AboutConviction } from "@/components/about/AboutConviction";
import { AboutInvitation } from "@/components/about/AboutInvitation";
import { AboutInstitution } from "@/components/about/AboutInstitution";
import { AboutLongView } from "@/components/about/AboutLongView";
import { AboutOpportunity } from "@/components/about/AboutOpportunity";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "AshviTech is building toward a technology institution where commercial ventures and independent research develop as equally meaningful pursuits.";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description,
  path: "/about",
  ogTitle: "About AshviTech",
});

export default function AboutPage() {
  return (
    <>
      <AboutConviction />
      <AboutOpportunity />
      <AboutInstitution />
      <AboutLongView />
      <AboutInvitation />
    </>
  );
}
