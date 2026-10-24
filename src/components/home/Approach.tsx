import { BookOpenText, PenLine, Timer, UsersRound } from "lucide-react";
import { method } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHeading } from "./SectionHeading";

const icons = [BookOpenText, Timer, PenLine, UsersRound];

export function Approach() {
  return (
    <section id="approach" className="container-page py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <SectionHeading
          className="lg:sticky lg:top-32 lg:self-start"
          eyebrow="Our approach"
          title="A method built around how the FPSC actually marks."
          intro="Four habits, practised every week, separate a qualified script from an allocated officer. Our timetable is built around them."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {method.map((m, i) => {
            const Icon = icons[i];
            return (
              <Parallax key={m.title} offset={{ base: 24, sm: i % 2 ? 110 : 24 }} className="h-full">
              <Reveal className="h-full" delay={i * 0.08}>
                <article className="group h-full rounded-2xl bg-white p-7 ring-1 ring-line transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(15,27,45,0.25)] hover:ring-ink/15">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-subtle text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm tabular-nums text-ink-mute">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl tracking-tight text-ink">{m.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{m.body}</p>
                </article>
              </Reveal>
              </Parallax>
            );
          })}
        </div>
      </div>
    </section>
  );
}
