"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { GraduationCap, HeartPulse, Route, UsersRound } from "lucide-react";
import { impact } from "@/data/nation";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;
const icons = [GraduationCap, HeartPulse, Route, UsersRound];
// node positions in a 500 × 500 box, with gently curved links from the centre
const nodes = [
  { x: 100, y: 110 },
  { x: 400, y: 100 },
  { x: 410, y: 400 },
  { x: 95, y: 395 },
];
const link = (n: { x: number; y: number }) => `M250 250 Q${(250 + n.x) / 2 + (n.y < 250 ? 40 : -40)} ${(250 + n.y) / 2} ${n.x} ${n.y}`;

/** "Every decision shapes a future" — scroll to connect one officer to the outcomes they influence. */
export function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "center 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 26 });
  const [active, setActive] = useState(0);
  const item = impact[active];

  return (
    <section id="impact" data-theme="light" className="grain overflow-hidden py-24 lg:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Heading eyebrow="The impact of service" title="Every decision shapes a future." intro="One officer's signature can open a school, staff a clinic or rebuild a road. Scroll to connect the dots, then select an outcome." />

          <div className="mt-10 flex flex-wrap gap-2">
            {impact.map((d, i) => {
              const Icon = icons[i];
              return (
                <button
                  key={d.key}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn("inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm ring-1 transition-all duration-300", active === i ? "bg-forest-800 text-ivory ring-forest-800" : "bg-paper text-ink-soft ring-line hover:ring-ink/30")}
                >
                  <Icon className="size-4" /> {d.key}
                </button>
              );
            })}
          </div>

          <div className="mt-8 min-h-24">
            <AnimatePresence mode="wait">
              <motion.p key={item.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} className="max-w-md font-display text-2xl leading-snug tracking-tight text-ink">
                {item.body}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[520px]">
          <svg viewBox="0 0 500 500" className="absolute inset-0 size-full" aria-hidden>
            <circle cx="250" cy="250" r="190" fill="none" className="stroke-line" strokeDasharray="2 6" />
            <circle cx="250" cy="250" r="120" fill="none" className="stroke-line" />
            {nodes.map((n, i) => (
              <Link key={i} d={link(n)} progress={p} index={i} on={active === i} />
            ))}
          </svg>

          {/* centre: the officer */}
          <div className="absolute top-1/2 left-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-forest-800 text-center text-ivory shadow-[0_20px_50px_-20px_rgba(4,23,15,0.7)] sm:size-32">
            <div>
              <p lang="ur" className="mb-3 font-urdu text-lg leading-none text-brass-light">افسر</p>
              <p className="font-display text-lg leading-tight">One officer</p>
            </div>
          </div>

          {impact.map((d, i) => {
            const Icon = icons[i];
            const n = nodes[i];
            return (
              <button
                key={d.key}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={d.key}
                style={{ left: `${(n.x / 500) * 100}%`, top: `${(n.y / 500) * 100}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span className={cn("grid size-14 place-items-center rounded-2xl ring-1 transition-all duration-300 sm:size-16", active === i ? "scale-110 bg-brass-light text-forest-950 ring-brass" : "bg-paper text-forest-800 ring-line group-hover:ring-ink/30")}>
                  <Icon className="size-6" />
                </span>
                <span className={cn("absolute top-full left-1/2 mt-2 -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-colors", active === i ? "text-ink" : "text-ink-mute")}>{d.key}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Link({ d, progress, index, on }: { d: string; progress: ReturnType<typeof useSpring>; index: number; on: boolean }) {
  // each link starts drawing a little after the previous one
  const length = useTransform(progress, [index * 0.15, index * 0.15 + 0.55], [0, 1]);
  const reduce = useReducedMotion();
  return (
    <>
      <motion.path d={d} fill="none" stroke="#a8834a" strokeWidth={on ? 2.2 : 1.2} strokeOpacity={on ? 1 : 0.45} style={{ pathLength: length }} className="transition-[stroke-width,stroke-opacity] duration-300" />
      {/* a pulse travelling from the officer to the outcome */}
      {on && !reduce && (
        <circle r={4} fill="#a8834a">
          <animateMotion dur="1.8s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </>
  );
}
