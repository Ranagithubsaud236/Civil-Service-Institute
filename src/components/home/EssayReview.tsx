"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { essay, remarks, rubric, totalDeduction, type Remark } from "@/data/essay";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;
const byId = new Map(remarks.map((r) => [r.id, r]));
const finalScore = 100 - totalDeduction;

/**
 * A sample script that gets marked as the reader scrolls: each flagged phrase is underlined in red
 * when it reaches the upper part of the screen, its margin note appears, and the score drops.
 */
export function EssayReview() {
  const [seen, setSeen] = useState<number[]>([]);
  const markSeen = useCallback((id: number) => setSeen((s) => (s.includes(id) ? s : [...s, id])), []);

  const score = 100 - remarks.filter((r) => seen.includes(r.id)).reduce((sum, r) => sum + r.deduct, 0);
  const done = seen.length === remarks.length;

  return (
    <section id="essay" className="bg-subtle/60 py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Red-pen evaluation"
          title="Scroll down and watch an essay get marked."
          intro="A sample CSS essay, evaluated the way CSI marks every script: line by line, with the reason for every mark lost."
        />

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[1fr_300px] lg:gap-8">
          <article className="relative rounded-3xl bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,27,45,0.35)] ring-1 ring-line sm:p-10">
            <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-6">
              <div>
                <p className="text-xs font-medium tracking-[0.14em] text-ink-mute uppercase">English Essay · Sample script</p>
                <h3 className="mt-2 font-display text-2xl tracking-tight text-ink sm:text-3xl">{essay.title}</h3>
              </div>
              <p className="font-hand text-2xl text-pen">Checked by CSI</p>
            </header>

            <div className="relative">
              {/* the red margin rule of an answer booklet */}
              <span className="absolute top-0 bottom-0 left-0 hidden w-px bg-pen/25 sm:block" />
              {essay.paragraphs.map((para, p) => {
                const notes = para.flatMap((f) => (typeof f === "string" ? [] : [byId.get(f.id)!]));
                return (
                  <div key={p} className="grid gap-x-8 gap-y-3 py-5 sm:pl-6 lg:grid-cols-[1fr_210px]">
                    <p className="font-display text-[17px] leading-[2] text-ink sm:text-lg sm:leading-[2]">
                      {para.map((f, i) =>
                        typeof f === "string" ? f : <Marked key={i} text={f.text} remark={byId.get(f.id)!} active={seen.includes(f.id)} onSeen={markSeen} />,
                      )}
                    </p>
                    <div className="space-y-3">
                      {notes.map((r) => (
                        <Note key={r.id} remark={r} active={seen.includes(r.id)} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <aside className="lg:sticky lg:top-28">
            <Scorecard score={score} seen={seen} done={done} />
          </aside>
        </div>

        {/* phones: the scorecard sits below the essay, so keep a live score pinned while reading */}
        <div className="pointer-events-none sticky bottom-24 mt-6 flex justify-center lg:hidden">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-navy-deep px-5 py-2.5 text-sm text-white shadow-lg">
            <span className="font-display text-xl tabular-nums">{score}</span>
            <span className="text-white/60">/ 100 · {seen.length} of {remarks.length} remarks</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marked({ text, remark, active, onSeen }: { text: string; remark: Remark; active: boolean; onSeen: (id: number) => void }) {
  return (
    <motion.span
      onViewportEnter={() => onSeen(remark.id)}
      // fires once the phrase has scrolled into the upper four-fifths of the screen
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      className={cn(
        "rounded-sm decoration-2 underline-offset-[5px] transition-[background-color,text-decoration-color] duration-700",
        remark.good ? "underline" : "underline decoration-wavy",
        active
          ? remark.good
            ? "bg-tick/10 decoration-tick"
            : "bg-pen-soft decoration-pen"
          : "bg-transparent decoration-transparent",
      )}
    >
      {text}
      <motion.sup
        initial={false}
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        className={cn("ml-0.5 inline-grid size-4 place-items-center rounded-full font-sans text-[10px] font-semibold text-white", remark.good ? "bg-tick" : "bg-pen")}
      >
        {remark.id}
      </motion.sup>
    </motion.span>
  );
}

function Note({ remark, active }: { remark: Remark; active: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14, rotate: active ? -1 : 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex gap-2.5"
    >
      <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white", remark.good ? "bg-tick" : "bg-pen")}>
        {remark.good ? <Check className="size-3" /> : remark.id}
      </span>
      <p className={cn("font-hand text-[19px] leading-[1.15]", remark.good ? "text-tick" : "text-pen")}>
        {remark.note}
        {!remark.good && <span className="ml-1.5 rounded bg-pen px-1.5 font-sans text-[11px] font-semibold text-white">−{remark.deduct}</span>}
      </p>
    </motion.div>
  );
}

function Scorecard({ score, seen, done }: { score: number; seen: number[]; done: boolean }) {
  const spring = useSpring(100, { stiffness: 70, damping: 18 });
  const shown = useTransform(spring, (v) => Math.round(v));
  useEffect(() => spring.set(score), [spring, score]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-line">
      <p className="text-xs font-medium tracking-[0.14em] text-ink-mute uppercase">Running score</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <motion.span className="font-display text-7xl tracking-tight text-ink tabular-nums">{shown}</motion.span>
        <span className="text-lg text-ink-mute">/ 100</span>
      </p>
      <p className="mt-1 text-sm text-ink-mute">
        {seen.length} of {remarks.length} remarks
      </p>

      <ul className="mt-7 space-y-4">
        {rubric.map((c) => {
          const lost = remarks.filter((r) => r.category === c.name && seen.includes(r.id)).reduce((s, r) => s + r.deduct, 0);
          const got = c.max - lost;
          return (
            <li key={c.name}>
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">{c.name}</span>
                <span className="font-medium text-ink tabular-nums">
                  {got}
                  <span className="text-ink-mute"> / {c.max}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-subtle">
                <motion.div className="h-full rounded-full bg-navy" initial={false} animate={{ width: `${(got / c.max) * 100}%` }} transition={{ duration: 0.8, ease }} />
              </div>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 2.2, rotate: -24 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.4 }}
            className="mt-8 flex items-center gap-4"
          >
            <span className="grid size-24 shrink-0 place-items-center rounded-full border-[3px] border-double border-pen text-center text-pen">
              <span>
                <span className="block font-display text-3xl leading-none">{finalScore}</span>
                <span className="block text-[10px] font-semibold tracking-[0.2em]">/ 100</span>
              </span>
            </span>
            <p className="font-hand text-xl leading-tight text-pen">Good facts. Now build a thesis and rewrite the introduction.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
