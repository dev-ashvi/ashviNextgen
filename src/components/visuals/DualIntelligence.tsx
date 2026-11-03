import Image from "next/image";
import { cn } from "@/lib/utils";

type DualIntelligenceProps = {
  className?: string;
};

/**
 * Dual Intelligence — approved Firefly sculpture asset.
 * Contact shadow, ambient shadow, teal spill and navy glow are CSS layers
 * tied to the sculpture’s visual placement — not a silhouette drop-shadow.
 */
export function DualIntelligence({ className }: DualIntelligenceProps) {
  return (
    <div
      className={cn(
        "relative isolate mx-auto w-full aspect-[1024/764]",
        className,
      )}
      aria-hidden
    >
      {/* Gentle blue ambient behind the navy structure */}
      <div className="pointer-events-none absolute left-[46%] top-[42%] z-0 h-[78%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,56,118,0.14)_0%,rgba(0,56,118,0.05)_42%,transparent_74%)]" />

      {/* Soft highlight pocket behind the glass ribbon */}
      <div className="pointer-events-none absolute left-[64%] top-[46%] z-0 h-[55%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.5)_0%,transparent_72%)]" />

      {/* Broader low-opacity floor shadow */}
      <div className="pointer-events-none absolute bottom-[0%] left-[50%] z-0 h-[18%] w-[88%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(2,19,54,0.14)_0%,rgba(2,19,54,0.05)_48%,transparent_76%)] blur-[22px]" />

      {/* Concentrated contact shadow under the lowest point */}
      <div className="pointer-events-none absolute bottom-[2%] left-[46%] z-0 h-[10%] w-[42%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(2,19,54,0.34)_0%,rgba(2,19,54,0.12)_40%,transparent_72%)] blur-[10px]" />

      {/* Teal reflected-light spill beneath the ribbon */}
      <div className="pointer-events-none absolute bottom-[3.5%] left-[64%] z-0 h-[14%] w-[30%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,205,184,0.34)_0%,rgba(0,205,184,0.1)_44%,transparent_76%)] blur-[16px]" />

      {/* Sculpture — exact approved asset */}
      <div className="relative z-[1] h-full w-full">
        <Image
          src="/brand/dual-intelligence.webp"
          alt=""
          width={1024}
          height={764}
          priority
          unoptimized
          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 580px, 760px"
          className="h-full w-full object-contain select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
