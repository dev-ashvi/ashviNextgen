import { cn } from "@/lib/utils";

type StatusLabelProps = {
  children: React.ReactNode;
  tone?: "active" | "future" | "neutral";
  className?: string;
};

const tones = {
  active: "bg-ashvi-teal/15 text-[#0a6b60] ring-ashvi-teal/30",
  future: "bg-ashvi-blue/10 text-ashvi-blue ring-ashvi-blue/20",
  neutral: "bg-surface-muted text-ink-secondary ring-line",
};

export function StatusLabel({
  children,
  tone = "neutral",
  className,
}: StatusLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
