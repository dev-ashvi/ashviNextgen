import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { buildPageMetadata } from "@/lib/seo";

const description =
  "Have a venture idea, a business challenge or a technical question worth exploring? We'd like to hear from you.";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description,
  path: "/contact",
  ogTitle: "Contact | AshviTech",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const { interest } = await searchParams;
  return <ContactPage initialInterest={interest} />;
}
