import type { Metadata } from "next";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with AshviTech about building AI-native businesses or transforming existing operations.",
  alternates: { canonical: "https://ashvi.tech/contact" },
};

export default function ContactPage() {
  return (
    <div className="bg-ashvi-cloud pt-28 md:pt-36">
      <div className="shell grid gap-14 pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:pb-28">
        <AnimatedReveal>
          <p className="label text-ashvi-blue">Contact</p>
          <h1 className="mt-5 text-display text-balance">
            Let&apos;s Build What Comes Next
          </h1>
          <p className="mt-6 text-lede text-ink-secondary">
            If you have deep expertise in an industry, an idea for a new
            business, or an existing company that could operate differently with
            AI, we&apos;d be interested in understanding what you&apos;re
            building.
          </p>
          <div className="mt-10 space-y-3 text-[15px] text-ink-secondary">
            <p>
              Email:{" "}
              <a
                href="mailto:hello@ashvi.tech"
                className="font-medium text-ashvi-ink underline decoration-line underline-offset-4 hover:decoration-ashvi-teal"
              >
                hello@ashvi.tech
              </a>
            </p>
            <p className="text-ink-muted">
              Prefer email directly if your browser blocks mail links.
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.08}>
          <ContactForm />
        </AnimatedReveal>
      </div>
    </div>
  );
}
