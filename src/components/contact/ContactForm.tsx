"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

const interests = [
  "Building a new AI-native business",
  "Transforming an existing company with AI",
  "Research collaboration",
  "Something else",
];

export function ContactForm() {
  const [interest, setInterest] = useState(interests[0]);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`AshviTech conversation — ${interest}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\n${message}`,
    );

    window.location.href = `mailto:hello@ashvi.tech?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-ashvi-white p-6 shadow-[0_1px_0_rgba(6,24,61,0.04)] md:p-8"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="text-[13px] font-medium text-ashvi-ink">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className="mt-2 w-full rounded-md border border-line bg-ashvi-cloud/50 px-3 py-2.5 text-[15px] text-ashvi-ink outline-none transition focus:border-ashvi-blue"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-[13px] font-medium text-ashvi-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-line bg-ashvi-cloud/50 px-3 py-2.5 text-[15px] text-ashvi-ink outline-none transition focus:border-ashvi-blue"
          />
        </div>

        <fieldset>
          <legend className="text-[13px] font-medium text-ashvi-ink">
            I&apos;m interested in
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  value={item}
                  className="peer sr-only"
                  checked={interest === item}
                  onChange={() => setInterest(item)}
                />
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1.5 text-[13px] ring-1 transition",
                    interest === item
                      ? "bg-ashvi-ink text-ashvi-white ring-ashvi-ink"
                      : "bg-ashvi-cloud text-ink-secondary ring-line hover:ring-ashvi-ink/30",
                  )}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="message" className="text-[13px] font-medium text-ashvi-ink">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="mt-2 w-full resize-y rounded-md border border-line bg-ashvi-cloud/50 px-3 py-2.5 text-[15px] text-ashvi-ink outline-none transition focus:border-ashvi-blue"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-ashvi-ink px-5 py-3 text-[15px] font-medium text-ashvi-white transition hover:bg-ashvi-blue sm:w-auto"
      >
        Start a Conversation
      </button>

      {submitted ? (
        <p className="mt-4 text-[14px] text-ink-muted" role="status">
          Opening your email client to send to hello@ashvi.tech. If nothing opens,
          please email us directly.
        </p>
      ) : (
        <p className="mt-4 text-[13px] text-ink-muted">
          This form opens a message to our confirmed address. A server-side
          contact backend is not configured yet.
        </p>
      )}
    </form>
  );
}
