"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";

const deck = [
  { text: "Pakistan has five provinces.", answer: false, why: "Four provinces — Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan — plus Gilgit-Baltistan, AJK and the Islamabad Capital Territory." },
  { text: "The current Constitution of Pakistan was adopted in 1973.", answer: true, why: "The 1973 Constitution remains in force, amended many times since." },
  { text: "K2, the world's second-highest peak, is in Gilgit-Baltistan.", answer: true, why: "K2 stands in the Karakoram range on the Gilgit-Baltistan–China border." },
  { text: "Quetta is the capital of Khyber Pakhtunkhwa.", answer: false, why: "Quetta is Balochistan's capital; Khyber Pakhtunkhwa's is Peshawar." },
  { text: "The Indus flows into the Arabian Sea.", answer: true, why: "It meets the sea through the delta south of Karachi and Thatta." },
  { text: "The 18th Amendment moved powers from the provinces to the federal government.", answer: false, why: "The other way round — it devolved major subjects to the provinces in 2010." },
];

const ease = [0.22, 1, 0.36, 1] as const;

/** Swipe right for true, left for false — quick-fire facts every aspirant should know. */
export function Flashcards() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [last, setLast] = useState<{ correct: boolean; why: string } | null>(null);
  const [exit, setExit] = useState(0);
  const done = index >= deck.length;

  const answer = (said: boolean) => {
    if (done) return;
    const card = deck[index];
    const correct = said === card.answer;
    setExit(said ? 1 : -1);
    setLast({ correct, why: card.why });
    if (correct) setScore((s) => s + 1);
    setIndex((i) => i + 1);
  };
  const restart = () => {
    setIndex(0);
    setScore(0);
    setLast(null);
  };

  return (
    <section id="flashcards" data-theme="light" className="overflow-hidden bg-ivory py-24 lg:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Heading eyebrow="Quick-fire facts" title="True or false? Swipe to answer." intro="Drag a card right for true and left for false — or use the buttons. The kind of facts the MPT expects you to know cold." />
          <div className="mt-8 min-h-28" aria-live="polite">
            <AnimatePresence mode="wait">
              {last && (
                <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("rounded-2xl p-4 ring-1", last.correct ? "bg-navy-800/5 ring-navy-700/30" : "bg-redpen/5 ring-redpen/30")}>
                  <p className={cn("flex items-center gap-2 font-medium", last.correct ? "text-navy-800" : "text-redpen")}>
                    {last.correct ? <Check className="size-4" /> : <X className="size-4" />} {last.correct ? "Correct" : "Not quite"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{last.why}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative h-[22rem] w-full max-w-sm" onKeyDown={(e) => (e.key === "ArrowRight" ? answer(true) : e.key === "ArrowLeft" ? answer(false) : null)}>
            {/* the cards waiting underneath */}
            {deck.slice(index + 1, index + 3).map((c, k) => (
              <div key={c.text} className="absolute inset-0 rounded-[26px] bg-paper ring-1 ring-line" style={{ transform: `translateY(${(k + 1) * 12}px) scale(${1 - (k + 1) * 0.05})`, zIndex: -k }} />
            ))}
            <AnimatePresence custom={exit}>
              {!done ? (
                <Card key={index} text={deck[index].text} n={index + 1} onAnswer={answer} />
              ) : (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} className="absolute inset-0 grid place-items-center rounded-[26px] bg-navy-900 p-8 text-center text-ivory">
                  <div>
                    <p className="font-display text-7xl tabular-nums text-gold-light">{score}<span className="text-3xl text-ivory/40">/{deck.length}</span></p>
                    <p className="mt-3 text-ivory/70">{score === deck.length ? "Perfect. The MPT has nothing on you." : score >= 4 ? "Strong start — keep revising." : "A good reason to join the MCQ sprint."}</p>
                    <button onClick={restart} className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ring-1 ring-ivory/25 hover:bg-ivory/10">
                      <RotateCcw className="size-4" /> Try again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button onClick={() => answer(false)} disabled={done} aria-label="Answer: false" className="grid size-14 place-items-center rounded-full bg-paper text-redpen ring-1 ring-line transition-all hover:scale-105 hover:ring-redpen/50 disabled:opacity-40">
              <X className="size-6" />
            </button>
            <span className="text-xs text-ink-mute tabular-nums">{Math.min(index + 1, deck.length)} / {deck.length}</span>
            <button onClick={() => answer(true)} disabled={done} aria-label="Answer: true" className="grid size-14 place-items-center rounded-full bg-paper text-navy-800 ring-1 ring-line transition-all hover:scale-105 hover:ring-navy-700/50 disabled:opacity-40">
              <Check className="size-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ text, n, onAnswer }: { text: string; n: number; onAnswer: (v: boolean) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const trueOpacity = useTransform(x, [20, 120], [0, 1]);
  const falseOpacity = useTransform(x, [-120, -20], [1, 0]);

  const end = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 110 || info.velocity.x > 600) onAnswer(true);
    else if (info.offset.x < -110 || info.velocity.x < -600) onAnswer(false);
  };

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={end}
      style={{ x, rotate }}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // flies off in the direction of the answer (passed in through AnimatePresence's custom)
      variants={{ gone: (dir: number) => ({ x: dir * 420, rotate: dir * 24, opacity: 0, transition: { duration: 0.35 } }) }}
      exit="gone"
      data-cursor="Swipe"
      tabIndex={0}
      aria-label={`Statement ${n}: ${text}. Press right arrow for true, left for false.`}
      className="absolute inset-0 flex cursor-grab touch-pan-y flex-col justify-between rounded-[26px] bg-paper p-8 shadow-[0_30px_60px_-30px_rgba(14,28,46,0.4)] ring-1 ring-line active:cursor-grabbing"
    >
      <div className="flex items-center justify-between text-xs text-ink-mute">
        <span>Card {n}</span>
        <span>MPT practice</span>
      </div>
      <p className="font-display text-[1.9rem] leading-snug tracking-tight text-ink">{text}</p>
      <div className="flex justify-between text-xs text-ink-mute">
        <span>← False</span>
        <span>True →</span>
      </div>
      {/* stamps that appear as the card is dragged */}
      <motion.span style={{ opacity: trueOpacity }} className="absolute top-16 right-8 rotate-12 rounded-lg border-2 border-navy-700 px-3 py-1 font-display text-xl text-navy-700">TRUE</motion.span>
      <motion.span style={{ opacity: falseOpacity }} className="absolute top-16 left-8 -rotate-12 rounded-lg border-2 border-redpen px-3 py-1 font-display text-xl text-redpen">FALSE</motion.span>
    </motion.div>
  );
}
