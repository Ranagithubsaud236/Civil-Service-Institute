import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  dark?: boolean;
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, dark, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Reveal>
        <p className={cn("eyebrow", dark ? "text-gold-light" : "text-gold")}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={cn("mt-4 font-display text-4xl leading-[1.08] tracking-tight text-balance md:text-5xl", dark ? "text-white" : "text-ink")}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className={cn("mt-5 text-[17px] leading-relaxed text-pretty", dark ? "text-white/60" : "text-ink-soft")}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
