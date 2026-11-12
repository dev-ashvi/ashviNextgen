import type { Metadata } from "next";
import { BuildPage } from "@/components/build/BuildPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Co-building AI-native ventures with founders and domain experts.";

export const metadata: Metadata = buildPageMetadata({
  title: "Build",
  description,
  path: "/build",
  ogTitle: "Build | AshviTech",
});

export default function Page() {
  return (
    <div className="bg-paper pt-[84px]">
      <BuildPage />
    </div>
  );
}
