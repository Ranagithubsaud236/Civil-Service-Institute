"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { journey } from "@/data/site";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

/** Six exam stages on a line that draws itself as the user scrolls. */
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const s = journey[active];

  return (
    <section id="journey" className="relative isolate overflow-hidden bg-navy-deep py-24 text-white lg:py-32">
      <div className="container-page">
        <SectionHeading
          dark
          eyebrow="The journey"
          title="CSS is not one exam. It is six gates."
          intro="Select a stage to see what it demands and how we prepare you for it."
        />

        <div ref={ref} className="relative mt-16">
          <div className="absolute top-5 right-0 left-0 hidden h-px bg-navy md:block" />
          <motion.div style={{ scaleX }} className="absolute top-5 right-0 left-0 hidden h-px origin-left bg-gold-light md:block" />

          <div role="tablist" aria-label="Exam stages" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
            {journey.map((step, i) => (
              <button
                key={step.step}
                role="tab"
                aria-selected={active === i}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group flex flex-col items-start text-left"
              >
                <span
                  className={cn(
                    "relative grid size-10 place-items-center rounded-full text-xs tabular-nums ring-1 transition-all duration-300 ease-out-soft",
                    active === i ? "bg-gold-light text-navy-deep ring-gold-light" : "bg-navy-deep text-white/70 ring-white/25 group-hover:ring-white/60",
                  )}
                >
                  {step.step}
                </span>
                <p className={cn("mt-5 font-display text-xl transition-colors duration-200", active === i ? "text-white" : "text-white/70")}>{step.title}</p>
                <p className="mt-1 text-sm text-white/65">{step.detail}</p>
              </button>
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl bg-navy ring-1 ring-white/10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease }}
                className="flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-9"
              >
                <div>
                  <p className="text-sm text-white/50">Stage {s.step} · How we prepare you</p>
                  <p className="mt-2 max-w-2xl font-display text-2xl leading-snug md:text-3xl">{s.how}</p>
                </div>
                <div className="w-full shrink-0 md:w-48">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Progress</span>
                    <span className="tabular-nums">{Math.round(((active + 1) / journey.length) * 100)}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-navy-deep">
                    <motion.div className="h-full rounded-full bg-gold-light" initial={false} animate={{ width: `${((active + 1) / journey.length) * 100}%` }} transition={{ duration: 0.5, ease }} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
