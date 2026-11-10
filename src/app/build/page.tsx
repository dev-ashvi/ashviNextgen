import type { Metadata } from "next";
import { BuildPage } from "@/components/build/BuildPage";

export const metadata: Metadata = {
  title: "Build",
  description: "Co-building AI-native ventures with founders and domain experts.",
  alternates: { canonical: "https://ashvi.tech/build" },
};

export default function Page() {
  return (
    <div className="bg-paper pt-[84px]">
      <BuildPage />
    </div>
  );
}
