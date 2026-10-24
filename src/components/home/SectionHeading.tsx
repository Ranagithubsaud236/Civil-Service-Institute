import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { SplitTitle } from "@/components/ui/SplitTitle";

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
      <SplitTitle className={cn("mt-4 font-display text-[2.35rem] leading-[1.06] tracking-[-0.015em] sm:text-5xl lg:text-[3.25rem]", dark ? "text-white" : "text-ink")}>{title}</SplitTitle>
      {intro && (
        <Reveal delay={0.1}>
          <p className={cn("mt-5 max-w-xl text-[17px] leading-[1.7]", dark ? "text-white/75" : "text-ink-soft")}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
