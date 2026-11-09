import type { Metadata } from "next";
import { ResearchPage } from "@/components/research-page/ResearchPage";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Ashvi Research — independent inquiry into intelligent systems, emerging technologies and the fundamental questions that shape technological progress.",
  alternates: { canonical: "https://ashvi.tech/research" },
};

export default function Page() {
  return (
    <div className="bg-paper pt-[84px]">
      <ResearchPage />
    </div>
  );
}
