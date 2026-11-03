import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark" | "teal";
  className?: string;
  external?: boolean;
};

const variants = {
  primary:
    "bg-ashvi-deep text-ashvi-white shadow-[0_8px_24px_rgba(2,19,54,0.16)] hover:bg-ashvi-blue hover:shadow-[0_10px_28px_rgba(0,56,118,0.22)] focus-visible:outline-ashvi-blue",
  secondary:
    "bg-ashvi-white/80 text-ashvi-ink ring-1 ring-ashvi-ink/12 hover:bg-ashvi-white hover:ring-ashvi-ink/28",
  ghost: "bg-transparent text-ashvi-ink hover:text-ashvi-blue",
  dark: "bg-ashvi-white text-ashvi-deep hover:bg-ashvi-cloud",
  teal: "bg-ashvi-teal text-ashvi-deep hover:brightness-95",
};

export function BrandButton({
  href,
  children,
  variant = "primary",
  className,
  external = false,
}: BrandButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium tracking-[-0.01em] transition-all duration-300",
    variants[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
