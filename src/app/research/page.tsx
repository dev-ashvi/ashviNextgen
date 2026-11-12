import type { Metadata } from "next";
import { ResearchPage } from "@/components/research-page/ResearchPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Ashvi Research — independent inquiry into intelligent systems, emerging technologies and the fundamental questions that shape technological progress.";

export const metadata: Metadata = buildPageMetadata({
  title: "Research",
  description,
  path: "/research",
  ogTitle: "Research | AshviTech",
});

export default function Page() {
  return (
    <div className="bg-paper">
      <ResearchPage />
    </div>
  );
}
