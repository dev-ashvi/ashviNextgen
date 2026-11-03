import { cn } from "@/lib/utils";

type SectionContainerProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "cloud" | "white" | "deep" | "blue";
  as?: "section" | "div";
};

const tones = {
  cloud: "bg-ashvi-cloud text-ashvi-ink",
  white: "bg-ashvi-white text-ashvi-ink",
  deep: "bg-ashvi-deep text-[color:var(--dark-text)]",
  blue: "bg-ashvi-blue text-[color:var(--dark-text)]",
};

export function SectionContainer({
  id,
  children,
  className,
  tone = "cloud",
  as: Tag = "section",
}: SectionContainerProps) {
  return (
    <Tag id={id} className={cn("relative scroll-mt-24", tones[tone], className)}>
      <div className="shell">{children}</div>
    </Tag>
  );
}
