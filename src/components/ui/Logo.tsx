import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "horizontal-light" | "horizontal-dark" | "stacked" | "symbol";

const sources: Record<LogoVariant, { src: string; width: number; height: number; alt: string }> = {
  "horizontal-light": {
    // Intrinsic 900×223 — keep exact ratio; size only via CSS height + w-auto
    src: "/brand/logo-horizontal-light.png",
    width: 900,
    height: 223,
    alt: "AshviTech",
  },
  "horizontal-dark": {
    // Cropped white-on-dark mark; height-only CSS sizing matches light header (never stretch)
    src: "/brand/logo-horizontal-dark.png",
    width: 874,
    height: 194,
    alt: "AshviTech",
  },
  stacked: {
    src: "/brand/logo-stacked-light.png",
    width: 181,
    height: 142,
    alt: "AshviTech",
  },
  symbol: {
    src: "/brand/logo-symbol.png",
    width: 73,
    height: 73,
    alt: "AshviTech",
  },
};

type LogoProps = {
  variant?: LogoVariant;
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function Logo({
  variant = "horizontal-light",
  href = "/",
  className,
  priority = false,
}: LogoProps) {
  const asset = sources[variant];
  const image = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn(
        // Height-only sizing — width follows intrinsic ratio (never stretch)
        "h-10 w-auto max-w-none object-contain object-left md:h-11",
        className,
      )}
      style={{ background: "transparent", boxShadow: "none" }}
    />
  );

  if (href === null) return image;

  return (
    <Link
      href={href}
      className="inline-flex items-center bg-transparent shadow-none ring-0"
      aria-label="AshviTech home"
    >
      {image}
    </Link>
  );
}
