import Image from "next/image";
import { cn } from "@/lib/cn";
import { site } from "@/data/site";

/** Official CSI crest. The logo has a white background, so it sits inside a white disc. */
export function Crest({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-line", className)} style={{ width: size, height: size }}>
      <Image src="/logo-256.png" alt={`${site.name} crest`} width={size} height={size} className="scale-[1.06]" priority />
    </span>
  );
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
      <Crest size={40} className="transition-transform duration-500 ease-out-soft group-hover:rotate-[-8deg]" />
      <span className="leading-tight">
        <span className={cn("block font-display text-[17px] font-medium tracking-tight", light ? "text-white" : "text-ink")}>{site.name}</span>
        <span className={cn("block text-[11px]", light ? "text-white/55" : "text-ink-mute")}>{site.tagline}</span>
      </span>
    </a>
  );
}
