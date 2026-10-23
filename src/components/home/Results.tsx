"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { achievers, testimonials } from "@/data/people";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHeading } from "./SectionHeading";

const DURATION = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

export function Results() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  // restarts on every change so a manual pick resets the auto-advance timer
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((n) => (n + 1) % testimonials.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused]);

  const t = testimonials[i];

  return (
    <section id="results" className="bg-subtle/60 py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading eyebrow="Results" title="Results are notified, not claimed." intro="Every name below is listed with service group, as published in the official FPSC and PPSC results." />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="flex h-full flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-line md:p-12"
            >
              <div className="flex min-h-56 flex-1 items-center">
                <AnimatePresence mode="wait">
                  <motion.figure key={i} initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }} transition={{ duration: 0.45, ease }}>
                    <blockquote className="font-display text-2xl leading-snug tracking-tight text-ink text-pretty md:text-[2rem]">“{t.quote}”</blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-navy text-sm text-white">{t.name.split(" ").map((w) => w[0]).join("")}</span>
                      <span>
                        <span className="block text-sm font-medium text-ink">{t.name}</span>
                        <span className="block text-sm text-ink-mute">{t.meta}</span>
                      </span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3" role="tablist" aria-label="Testimonials">
                {testimonials.map((x, n) => (
                  <button key={x.name} role="tab" aria-selected={n === i} aria-label={`Show testimonial from ${x.name}`} onClick={() => setI(n)} className="group py-2 text-left">
                    <span className="block h-0.5 overflow-hidden rounded-full bg-line">
                      {n === i && (
                        <motion.span
                          key={`${i}-${paused}`}
                          className="block h-full bg-navy"
                          initial={{ width: paused ? "100%" : "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                        />
                      )}
                    </span>
                    <span className={cn("mt-2 block truncate text-xs transition-colors", n === i ? "text-ink" : "text-ink-mute group-hover:text-ink-soft")}>{x.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <Parallax offset={{ base: 0, lg: 30 }} className="h-full">
          <Reveal className="h-full" delay={0.1}>
            <div className="h-full rounded-3xl bg-white p-8 ring-1 ring-line">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl tracking-tight text-ink">Roll of honour</h3>
                <span className="text-xs text-ink-mute">2025 results</span>
              </div>
              <ul className="mt-6 divide-y divide-line">
                {achievers.map((a) => (
                  <li key={a.name} className="-mx-3 flex items-center justify-between gap-4 rounded-xl px-3 py-3.5 transition-colors duration-200 hover:bg-subtle">
                    <div>
                      <p className="text-[15px] font-medium text-ink">{a.name}</p>
                      <p className="text-xs text-ink-mute">{a.exam}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-ink-soft">{a.merit}</span>
                      <span className="w-12 rounded-full bg-gold-soft py-1 text-center text-[11px] font-medium text-gold">{a.group}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
