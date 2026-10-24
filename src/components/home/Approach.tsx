"use client";

import { useRef } from "react";
import { BookOpenText, PenLine, Timer, UsersRound } from "lucide-react";
import { method } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./SectionHeading";

const icons = [BookOpenText, Timer, PenLine, UsersRound];

/** The one section with parallax: alternate cards drift at different speeds, scrubbed to the scroll. */
export function Approach() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ wide: "(min-width: 640px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const { wide, reduce } = ctx.conditions!;
        if (reduce) return;
        gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
          const d = Number(el.dataset.depth) * (wide ? 1 : 0.3);
          gsap.fromTo(el, { y: d }, { y: -d, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="approach" className="container-page py-24 lg:py-32">
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
              <div key={m.title} data-depth={i % 2 ? 110 : 24} className="h-full">
              <Reveal className="h-full" delay={i * 0.08}>
                <article className="group h-full rounded-2xl bg-white p-7 ring-1 ring-line transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:ring-ink/15">
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
