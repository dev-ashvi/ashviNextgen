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
      <h2 className="text-title text-balance">{title}</h2>
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
