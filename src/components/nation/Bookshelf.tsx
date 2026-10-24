"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info, X } from "lucide-react";
import { optionals } from "@/data/people";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;
const TARGET = 600;
const covers: Record<string, string> = {
  "Engineering & Sciences": "from-[#376c92] to-[#0f3254]",
  "Social Sciences": "from-[#024d84] to-[#022b52]",
  "Law & Commerce": "from-[#a8742c] to-[#5a3d14]",
  "Arts & Humanities": "from-[#5f89a6] to-[#24496a]",
};

const books = Object.entries(optionals).flatMap(([family, { subjects }]) =>
  subjects.map(([title, marks], i) => ({ title, marks, family, height: 210 + ((title.length * 7 + i * 13) % 60) })),
);

/** Optional subjects as books on a shelf — pull them out to build a 600-mark plan. */
export function Bookshelf() {
  const [picked, setPicked] = useState<string[]>([]);
  const total = books.filter((b) => picked.includes(b.title)).reduce((a, b) => a + b.marks, 0);
  const over = total > TARGET;

  const toggle = (title: string) => setPicked((p) => (p.includes(title) ? p.filter((t) => t !== title) : [...p, title]));

  return (
    <section id="shelf" data-theme="light" className="overflow-hidden bg-ivory py-24 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Heading eyebrow="Choose your optionals" title="Pull six hundred marks off the shelf." intro="Optional papers make up half of the written exam. Pick books to build your plan — the tally fills as you go." />

          {/* the tally */}
          <div className="w-full max-w-sm rounded-2xl bg-paper p-5 ring-1 ring-line lg:w-80">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">Your optional marks</span>
              <span className={cn("font-display text-3xl tabular-nums", over ? "text-redpen" : "text-navy-800")}>
                {total}
                <span className="text-base text-ink-mute"> / {TARGET}</span>
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ivory-200">
              <motion.div className={cn("h-full rounded-full", over ? "bg-redpen" : total === TARGET ? "bg-navy-700" : "bg-gold")} animate={{ width: `${Math.min(100, (total / TARGET) * 100)}%` }} transition={{ type: "spring", stiffness: 140, damping: 20 }} />
            </div>
            <p className="mt-2 text-xs text-ink-mute">{over ? "That's over 600 — put a book back." : total === TARGET ? "Exactly 600. A complete plan." : `${TARGET - total} marks to go.`}</p>
          </div>
        </div>

        {/* the shelf */}
        <div className="relative mt-14 [perspective:1200px]">
          <div className="flex items-end gap-1.5 overflow-x-auto pt-14 [scrollbar-width:none] sm:gap-2" data-cursor="Pick">
            {books.map((b, i) => {
              const on = picked.includes(b.title);
              return (
                // the wrapper handles the entrance; the book itself handles hover and being picked
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.5, ease }}
                  className="shrink-0"
                >
                  <motion.button
                    onClick={() => toggle(b.title)}
                    aria-pressed={on}
                    aria-label={`${b.title}, ${b.marks} marks`}
                    whileHover={{ y: on ? -46 : -14, rotateZ: on ? 0 : -2 }}
                    animate={{ y: on ? -38 : 0, rotateY: on ? -18 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{ height: b.height, transformOrigin: "bottom center" }}
                    className={cn(
                      "relative block w-12 overflow-hidden rounded-t-md rounded-b-sm bg-gradient-to-b text-ivory shadow-[inset_-6px_0_10px_rgba(0,0,0,0.25),inset_3px_0_0_rgba(255,255,255,0.08)] sm:w-14",
                      covers[b.family],
                      on && "ring-2 ring-gold-light shadow-[0_18px_30px_-12px_rgba(168,116,44,0.7)]",
                    )}
                  >
                    <span className="absolute inset-x-0 top-3 mx-auto h-px w-7 bg-gold-light/60" />
                    <span className="absolute inset-x-0 bottom-3 mx-auto h-px w-7 bg-gold-light/60" />
                    {/* title band sits between the top rule and the marks, so long titles never overlap */}
                    <span className="absolute inset-x-0 top-5 bottom-11 grid place-items-center overflow-hidden">
                      <span className="text-[12px] leading-tight font-medium tracking-wide [writing-mode:vertical-rl] rotate-180">{b.title}</span>
                    </span>
                    <span className="absolute inset-x-0 bottom-5 text-center text-[10px] text-gold-light">{b.marks}</span>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
          {/* the plank */}
          <div className="h-4 rounded-sm bg-gradient-to-b from-[#a8742c] to-[#6e5228] shadow-[0_14px_24px_-10px_rgba(60,40,10,0.5)]" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <AnimatePresence>
            {picked.map((t) => (
              <motion.button
                key={t}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => toggle(t)}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 px-3 py-1.5 text-xs text-ivory"
              >
                {t} <X className="size-3" />
              </motion.button>
            ))}
          </AnimatePresence>
          {picked.length === 0 && <p className="text-sm text-ink-mute">No books chosen yet — tap a spine to pull it out.</p>}
        </div>
        <p className="mt-6 flex items-start gap-2 text-xs text-ink-mute">
          <Info className="mt-0.5 size-3.5 shrink-0" /> The FPSC limits which optional subjects can be combined — our advisors check every plan against the current rules.
        </p>
      </div>
    </section>
  );
}
