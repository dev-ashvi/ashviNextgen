import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "label mb-4",
            tone === "dark" ? "text-ashvi-teal" : "text-ashvi-blue",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-balance font-serif text-[clamp(1.85rem,1.1rem+2.4vw,2.85rem)] font-medium leading-[1.12] tracking-[-0.025em] [font-variation-settings:'opsz'_48]",
          tone === "dark" ? "text-ashvi-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-lede",
            tone === "dark"
              ? "text-[color:var(--dark-text-secondary)]"
              : "text-ink-secondary",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
