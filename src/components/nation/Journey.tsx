"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Check, Flame } from "lucide-react";
import { milestones, weekPlan } from "@/data/nation";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;

// road through four bends; milestones sit at y = 200, 600, 1000, 1400 of a 1000 × 1600 box
const road = "M300 0 L300 200 C300 400 700 400 700 600 C700 800 300 800 300 1000 C300 1200 700 1200 700 1400 L700 1600";
const bends = [30, 70, 30, 70];

export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const lineScale = useTransform(draw, [0, 1], [0, 1]);
  const [reached, setReached] = useState(-1);
  const geometry = useRef<SVGPathElement>(null);
  const tipX = useMotionValue("30%");
  const tipY = useMotionValue("0%");
  const tipMobile = useTransform(draw, (v) => `${v * 100}%`);

  // a milestone "arrives" just before the drawn line reaches its bend
  useMotionValueEvent(scrollYProgress, "change", (v) => setReached(Math.min(3, Math.floor((v + 0.05) / 0.25))));
  // a glowing spark rides the tip of the drawn line
  useMotionValueEvent(draw, "change", (v) => {
    const path = geometry.current;
    if (!path) return;
    const pt = path.getPointAtLength(path.getTotalLength() * Math.min(Math.max(v, 0), 1));
    tipX.set(`${pt.x / 10}%`);
    tipY.set(`${pt.y / 16}%`);
  });

  return (
    <section id="begin" data-theme="dark" className="relative isolate overflow-hidden bg-navy-950 py-24 text-ivory lg:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(2,77,132,0.6),transparent)]" />
      <div className="container-page">
        <Heading
          dark
          eyebrow="Scene 03 · Your preparation journey"
          title="A golden thread from first question to first posting."
          intro="Four milestones, each with the resources, practice and feedback you need before moving to the next."
        />

        <div ref={ref} className="relative mt-16 lg:mt-24">
          {/* desktop: a winding road whose gold centre line is drawn by scrolling */}
          <svg viewBox="0 0 1000 1600" preserveAspectRatio="none" className="absolute inset-0 hidden size-full lg:block" aria-hidden>
            <path d={road} fill="none" stroke="#023b6b" strokeWidth={34} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={road} fill="none" stroke="#ce9744" strokeOpacity={0.15} strokeWidth={1.5} strokeDasharray="6 10" vectorEffect="non-scaling-stroke" />
            <motion.path
              d={road}
              fill="none"
              stroke="#ce9744"
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{ pathLength: draw, filter: "drop-shadow(0 0 6px rgba(206,151,68,0.85))" }}
              vectorEffect="non-scaling-stroke"
            />
            <path ref={geometry} d={road} fill="none" stroke="none" />
          </svg>
          <motion.span style={{ left: tipX, top: tipY }} className="pointer-events-none absolute z-10 hidden size-3 -translate-1/2 rounded-full bg-[#fff1cf] shadow-[0_0_18px_6px_rgba(206,151,68,0.7)] lg:block" aria-hidden />
          {/* mobile: a straight thread down the left edge */}
          <div className="absolute top-0 bottom-0 left-[19px] w-px bg-ivory/10 lg:hidden" aria-hidden>
            <motion.div style={{ scaleY: lineScale }} className="h-full w-full origin-top bg-gold-light shadow-[0_0_8px_rgba(206,151,68,0.8)]" />
            <motion.span style={{ top: tipMobile }} className="absolute left-1/2 size-2.5 -translate-1/2 rounded-full bg-[#fff1cf] shadow-[0_0_14px_5px_rgba(206,151,68,0.7)]" />
          </div>

          <ol className="relative grid gap-12 lg:block lg:h-[1600px]">
            {milestones.map((m, i) => {
              const on = reached >= i;
              const roadLeft = bends[i] === 30;
              return (
                <li
                  key={m.key}
                  // desktop: pinned beside its bend in the road; mobile: a simple stacked list
                  style={{ "--top": `${12.5 + i * 25}%` } as React.CSSProperties}
                  className={cn("relative pl-14 lg:absolute lg:top-[var(--top)] lg:w-[42%] lg:-translate-y-1/2 lg:pl-0", roadLeft ? "lg:left-[38%]" : "lg:right-[38%] lg:text-right")}
                >
                  {/* the marker on the road: 8% of the container (≈19% of this card) away from the card edge */}
                  <span
                    className={cn(
                      "absolute top-1 left-[11px] size-[17px] rounded-full ring-4 ring-navy-950 transition-colors duration-500 lg:top-1/2 lg:-translate-y-1/2",
                      roadLeft ? "lg:left-[calc(-19%-9px)]" : "lg:right-[calc(-19%-9px)] lg:left-auto",
                      on ? "bg-gold-light" : "bg-navy-700",
                    )}
                  />
                  <motion.div
                    initial={false}
                    animate={{ opacity: on ? 1 : 0.2, rotateY: on ? 0 : roadLeft ? -55 : 55, x: on ? 0 : roadLeft ? -24 : 24 }}
                    transition={{ duration: 0.9, ease }}
                    // hinge on the edge facing the road, so each card opens out of the line
                    style={{ transformPerspective: 1000, originX: roadLeft ? 0 : 1 }}
                  >
                    <div className={cn("flex items-baseline gap-4", !roadLeft && "lg:flex-row-reverse")}>
                      <span className="text-xs tabular-nums text-ivory/45">0{i + 1}</span>
                      <span lang="ur" className="font-urdu text-lg text-gold-light/70">{m.urdu}</span>
                    </div>
                    <h3 className="mt-2 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">{m.key}</h3>
                    <p className="mt-4 max-w-md leading-relaxed text-ivory/65 lg:inline-block">{m.body}</p>
                    <ul className={cn("mt-5 flex flex-wrap gap-2", !roadLeft && "lg:justify-end")}>
                      {m.items.map((it) => (
                        <li key={it} className="rounded-full bg-ivory/[0.06] px-3 py-1.5 text-xs text-ivory/80 ring-1 ring-ivory/10">{it}</li>
                      ))}
                    </ul>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>

        <Tracker />
      </div>
    </section>
  );
}

/** "Your command center": tick off the week's plan and watch the ring fill. */
function Tracker() {
  const [done, setDone] = useState<boolean[]>(weekPlan.map((_, i) => i < 2));
  const count = done.filter(Boolean).length;
  const pct = count / weekPlan.length;
  const R = 54;
  const C = 2 * Math.PI * R;
  const ringRef = useRef<SVGSVGElement>(null);
  const seen = useInView(ringRef, { once: true });

  return (
    <Reveal className="mt-24 lg:mt-32">
      <div className="grid overflow-hidden rounded-[28px] bg-ivory text-ink ring-1 ring-ivory/10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col items-center justify-center gap-6 bg-ivory-200 p-10 text-center">
          <p className="eyebrow text-gold">This week</p>
          <div className="relative size-40">
            <svg ref={ringRef} viewBox="0 0 128 128" className="size-full -rotate-90">
              <circle cx="64" cy="64" r={R} fill="none" className="stroke-ivory-300" strokeWidth={8} />
              <motion.circle
                cx="64"
                cy="64"
                r={R}
                fill="none"
                className="stroke-navy-800"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: seen ? C * (1 - pct) : C }}
                transition={{ duration: 0.9, ease }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div>
                <p className="font-display text-4xl tabular-nums">{Math.round(pct * 100)}%</p>
                <p className="text-xs text-ink-mute">{count} of {weekPlan.length} done</p>
              </div>
            </div>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-1.5 text-sm ring-1 ring-line">
            <Flame className="size-4 text-gold" /> 12-day preparation streak
          </p>
        </div>

        <div className="p-7 sm:p-10">
          <h3 className="font-display text-3xl tracking-tight">Your study plan</h3>
          <p className="mt-2 text-ink-soft">A preview of the dashboard every student receives. Tick a task to see your progress move.</p>
          <ul className="mt-6 divide-y divide-line">
            {weekPlan.map((w, i) => (
              <li key={w.day}>
                <button
                  onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                  aria-pressed={done[i]}
                  className="group flex w-full items-center gap-4 py-3.5 text-left"
                >
                  <span className={cn("grid size-6 shrink-0 place-items-center rounded-md ring-1 transition-all duration-300", done[i] ? "bg-navy-800 text-ivory ring-navy-800" : "ring-ink/25 group-hover:ring-ink/50")}>
                    <motion.span initial={false} animate={{ scale: done[i] ? 1 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 26 }}>
                      <Check className="size-3.5" />
                    </motion.span>
                  </span>
                  <span className="w-9 text-xs text-ink-mute">{w.day}</span>
                  <span className={cn("text-[15px] transition-colors duration-300", done[i] ? "text-ink-mute line-through decoration-ink/30" : "text-ink")}>{w.task}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
