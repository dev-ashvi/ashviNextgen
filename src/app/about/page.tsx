import type { Metadata } from "next";
import { AboutConviction } from "@/components/about/AboutConviction";
import { AboutInvitation } from "@/components/about/AboutInvitation";
import { AboutInstitution } from "@/components/about/AboutInstitution";
import { AboutLongView } from "@/components/about/AboutLongView";
import { AboutOpportunity } from "@/components/about/AboutOpportunity";

export const metadata: Metadata = {
  title: "About",
  description:
    "AshviTech is building toward a technology institution where commercial ventures and independent research develop as equally meaningful pursuits.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About AshviTech",
    description:
      "Building businesses. Advancing technology. Two pursuits, one institution.",
    url: "/about",
  },
};

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
