import type { Metadata } from "next";
import { TributeContent } from "@/components/tribute/TributeContent";

export const metadata: Metadata = {
  title: "In Loving Memory of Prateesh Goyal | Ashvi",
  description:
    "A quiet tribute — brilliant mind, seeker of truth, builder of the future.",
};

export default function PrateeshPage() {
  return <TributeContent />;
}
