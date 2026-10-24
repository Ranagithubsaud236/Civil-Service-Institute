import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Scramble } from "@/components/ui/Scramble";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  dark?: boolean;
  className?: string;
};

export function Heading({ eyebrow, title, intro, dark, className }: Props) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Reveal>
        <p className={cn("eyebrow", dark ? "text-gold-light" : "text-gold")}>
          <Scramble text={eyebrow} />
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={cn("mt-4 font-display text-4xl leading-[1.06] tracking-tight text-balance md:text-[3.4rem]", dark ? "text-ivory" : "text-ink")}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className={cn("mt-5 text-[17px] leading-relaxed text-pretty", dark ? "text-ivory/65" : "text-ink-soft")}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
