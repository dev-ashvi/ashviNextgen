import type { Metadata } from "next";
import { TributeContent } from "@/components/tribute/TributeContent";

export const metadata: Metadata = {
  title: "In Loving Memory — Prateesh Goyal",
  description:
    "A quiet space — brilliant mind, seeker of truth, builder of the future.",
  robots: { index: false, follow: false },
};

export default function LegacyPage() {
  return <TributeContent />;
}
