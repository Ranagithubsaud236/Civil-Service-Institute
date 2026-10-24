"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

/** MPT-style questions with verified answers. */
const questions = [
  { paper: "Pakistan Affairs", q: "Pakistan’s first constitution came into force in which year?", options: ["1947", "1956", "1962", "1973"], answer: 1, why: "It came into force on 23 March 1956, making Pakistan an Islamic Republic." },
  { paper: "Current Affairs", q: "The Indus Waters Treaty of 1960 was brokered by:", options: ["The United Nations", "The Commonwealth", "The World Bank", "The IMF"], answer: 2, why: "The World Bank brokered the treaty and remains a signatory to it." },
  { paper: "English", q: "Which sentence is correct?", options: ["We discussed about the plan.", "We discussed on the plan.", "We discussed the plan.", "We discussed over the plan."], answer: 2, why: "“Discuss” takes a direct object — no preposition. It is one of the most common essay errors." },
  { paper: "Constitution", q: "Which Article of the 1973 Constitution declares Islam the state religion?", options: ["Article 1", "Article 2", "Article 19", "Article 25"], answer: 1, why: "Article 2: “Islam shall be the State religion of Pakistan.”" },
  { paper: "Current Affairs", q: "CPEC links Kashgar in China with which Pakistani port?", options: ["Karachi", "Port Qasim", "Ormara", "Gwadar"], answer: 3, why: "Gwadar, in Balochistan, is the corridor’s southern terminus." },
];

const CONFETTI = ["#0b3a68", "#a97c2f", "#d9b877", "#1f7a52", "#c0352b"];

export function Quiz() {
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = n >= questions.length;
  const q = questions[Math.min(n, questions.length - 1)];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setN((x) => x + 1);
  };
  const reset = () => {
    setN(0);
    setPicked(null);
    setScore(0);
  };

  return (
    <section id="quiz" className="container-page py-24 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <SectionHeading
          eyebrow="Test yourself"
          title="Five questions. Are you CSS-ready?"
          intro="Real MPT-style questions from the papers CSI teaches. Pick an answer to see the examiner’s explanation."
        />

        <div className="relative">
          {/* stacked cards behind give a deck feel */}
          <span className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-3xl bg-gold-soft" />
          <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-1 rounded-3xl bg-subtle ring-1 ring-line" />

          <div className="relative min-h-[460px] overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-line sm:p-10">
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-subtle">
                  <motion.span className="block h-full bg-navy" initial={false} animate={{ width: i < n || (i === n && picked !== null) ? "100%" : "0%" }} transition={{ duration: 0.5, ease }} />
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="relative grid min-h-[360px] place-items-center text-center">
                  {score >= 4 && <Confetti />}
                  <div>
                    <p className="font-display text-8xl tracking-tight text-navy tabular-nums">
                      {score}
                      <span className="text-3xl text-ink-mute">/{questions.length}</span>
                    </p>
                    <p className="mt-3 font-display text-2xl text-ink">{score >= 4 ? "Officer material." : score >= 2 ? "A solid start." : "Every officer started here."}</p>
                    <p className="mx-auto mt-2 max-w-xs text-ink-soft">CSI’s orientation shows you exactly where to begin.</p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <Button href="#contact">Book a free orientation</Button>
                      <button onClick={reset} className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium text-ink ring-1 ring-line hover:ring-ink/25">
                        <RotateCcw className="size-4" /> Try again
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={n} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease }} className="mt-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full bg-gold-soft px-2.5 py-0.5 font-medium text-gold">{q.paper}</span>
                    <span className="text-ink-mute tabular-nums">Question {n + 1} of {questions.length}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl leading-snug tracking-tight text-ink text-balance sm:text-3xl">{q.q}</h3>

                  <div className="mt-6 grid gap-2.5">
                    {q.options.map((o, i) => {
                      const state = picked === null ? "idle" : i === q.answer ? "right" : i === picked ? "wrong" : "dim";
                      return (
                        <motion.button
                          key={o}
                          onClick={() => pick(i)}
                          disabled={picked !== null}
                          animate={state === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : state === "right" ? { scale: [1, 1.03, 1] } : {}}
                          transition={{ duration: 0.45 }}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-left text-[15px] ring-1 transition-colors duration-200",
                            state === "idle" && "bg-subtle ring-transparent hover:bg-white hover:ring-navy/30",
                            state === "right" && "bg-tick/10 text-tick ring-tick/40",
                            state === "wrong" && "bg-pen-soft text-pen ring-pen/40",
                            state === "dim" && "bg-subtle text-ink-mute ring-transparent",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold ring-1 ring-line">{"ABCD"[i]}</span>
                            {o}
                          </span>
                          {state === "right" && <Check className="size-5 shrink-0" />}
                          {state === "wrong" && <X className="size-5 shrink-0" />}
                        </motion.button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {picked !== null && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                          <p className="max-w-md font-hand text-xl leading-snug text-navy">{q.why}</p>
                          <button onClick={next} className="h-11 rounded-full bg-navy px-5 text-sm font-medium text-white hover:bg-navy-deep">
                            {n === questions.length - 1 ? "See my score" : "Next question"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A one-shot burst of paper confetti from the centre. */
function Confetti() {
  const bits = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const r = 140 + ((i * 37) % 90);
    return { x: Math.cos(a) * r, y: Math.sin(a) * r - 40, rot: (i * 47) % 360, c: CONFETTI[i % CONFETTI.length], w: 6 + (i % 3) * 3 };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute block h-3 rounded-sm"
          style={{ width: b.w, backgroundColor: b.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 160], opacity: [1, 1, 0], rotate: b.rot + 360 }}
          transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.4, 1] }}
        />
      ))}
    </div>
  );
}
