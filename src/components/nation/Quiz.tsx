"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";

type Key = "PAS" | "PSP" | "FSP" | "REV" | "AUD";

const results: Record<Key, { name: string; urdu: string; body: string }> = {
  PAS: { name: "Pakistan Administrative Service", urdu: "انتظامیہ", body: "You lead from the front. Deputy commissioners and secretaries hold districts and departments together — crisis by crisis, file by file." },
  PSP: { name: "Police Service of Pakistan", urdu: "پولیس", body: "Calm under pressure and drawn to justice. Police officers keep order, lead large forces and stand between citizens and harm." },
  FSP: { name: "Foreign Service of Pakistan", urdu: "خارجہ", body: "A persuader and a listener. Diplomats represent Pakistan abroad, negotiate its interests and build bridges between nations." },
  REV: { name: "Inland Revenue & Customs", urdu: "محصولات", body: "You see the economy behind every headline. Revenue officers fund the state and keep trade flowing through ports and borders." },
  AUD: { name: "Pakistan Audit & Accounts Service", urdu: "آڈٹ", body: "Precise and principled. Auditors follow the money so every rupee of public spending can be accounted for." },
};

const questions: { q: string; options: { label: string; score: Partial<Record<Key, number>> }[] }[] = [
  {
    q: "A crisis hits your district at midnight. You…",
    options: [
      { label: "Take charge on the ground", score: { PAS: 2, PSP: 1 } },
      { label: "Secure the area and restore order", score: { PSP: 2 } },
      { label: "Bring every side to the table", score: { FSP: 2, PAS: 1 } },
      { label: "Check what the budget allows", score: { AUD: 2, REV: 1 } },
    ],
  },
  {
    q: "The newspaper section you read first:",
    options: [
      { label: "National affairs", score: { PAS: 2 } },
      { label: "Courts and crime", score: { PSP: 2 } },
      { label: "World news", score: { FSP: 2 } },
      { label: "Business and economy", score: { REV: 2, AUD: 1 } },
    ],
  },
  {
    q: "Your ideal office looks out over…",
    options: [
      { label: "A busy district headquarters", score: { PAS: 2 } },
      { label: "A police lines parade ground", score: { PSP: 2 } },
      { label: "A foreign capital's skyline", score: { FSP: 2 } },
      { label: "Container ships at the port", score: { REV: 2 } },
    ],
  },
  {
    q: "Friends come to you because you're good at…",
    options: [
      { label: "Leading people", score: { PAS: 2, PSP: 1 } },
      { label: "Staying brave under pressure", score: { PSP: 2 } },
      { label: "Languages and persuasion", score: { FSP: 2 } },
      { label: "Numbers and detail", score: { AUD: 2, REV: 1 } },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;
// fixed burst directions, so the particle layout is the same on server and client
const burst = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2;
  const r = 110 + ((i * 37) % 70);
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: 4 + (i % 3) * 3 };
});

/** "Which service suits you?" — four quick questions and a result revealed with a burst of gold. */
export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = step === questions.length;

  const totals = answers.reduce<Record<Key, number>>(
    (acc, a, i) => {
      for (const [k, v] of Object.entries(questions[i].options[a].score)) acc[k as Key] += v ?? 0;
      return acc;
    },
    { PAS: 0, PSP: 0, FSP: 0, REV: 0, AUD: 0 },
  );
  const best = (Object.keys(totals) as Key[]).reduce((a, b) => (totals[b] > totals[a] ? b : a), "PAS");

  const choose = (i: number) => {
    setAnswers((a) => [...a.slice(0, step), i]);
    setStep((s) => s + 1);
  };
  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  return (
    <section id="quiz" data-theme="light" className="bg-paper py-24 lg:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Heading eyebrow="Find your fit" title="Which service suits you?" intro="Four quick questions. No right answers — just a first hint at where your instincts might take you." />

        <div className="relative min-h-[26rem] overflow-hidden rounded-[28px] bg-forest-900 p-7 text-ivory sm:p-10">
          {/* progress */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <span key={i} className={cn("h-1 rounded-full transition-all duration-500", i < step ? "w-8 bg-brass-light" : i === step ? "w-8 bg-ivory/40" : "w-4 bg-ivory/15")} />
              ))}
            </div>
            {step > 0 && !done && (
              <button onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1 text-xs text-ivory/60 hover:text-ivory">
                <ArrowLeft className="size-3.5" /> Back
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease }}>
                <p className="text-xs text-ivory/45">Question {step + 1} of {questions.length}</p>
                <h3 className="mt-2 font-display text-3xl leading-tight tracking-tight sm:text-4xl">{questions[step].q}</h3>
                <div className="mt-8 grid gap-3">
                  {questions[step].options.map((o, i) => (
                    <motion.button
                      key={o.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, ease }}
                      onClick={() => choose(i)}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-5 py-4 text-left ring-1 transition-all duration-200",
                        answers[step] === i ? "bg-brass-light text-forest-950 ring-brass-light" : "bg-ivory/[0.04] ring-ivory/10 hover:bg-ivory/[0.09] hover:ring-ivory/30",
                      )}
                    >
                      <span>{o.label}</span>
                      <span className="text-xs opacity-40 transition-opacity group-hover:opacity-80">{String.fromCharCode(65 + i)}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="relative text-center">
                <div className="pointer-events-none absolute top-16 left-1/2" aria-hidden>
                  {burst.map((b, i) => (
                    <motion.span
                      key={i}
                      className="absolute rounded-full bg-brass-light"
                      style={{ width: b.s, height: b.s }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: b.x, y: b.y, opacity: 0, scale: 0.4 }}
                      transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ))}
                </div>
                <p className="text-xs tracking-[0.2em] text-brass-light uppercase">Your closest match</p>
                <p lang="ur" className="mt-4 font-urdu text-3xl leading-loose text-brass-light/80">{results[best].urdu}</p>
                <h3 className="mt-1 font-display text-4xl leading-tight tracking-tight">{results[best].name}</h3>
                <p className="mx-auto mt-4 max-w-md leading-relaxed text-ivory/70">{results[best].body}</p>
                <button onClick={restart} className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ring-1 ring-ivory/25 transition-colors hover:bg-ivory/10">
                  <RotateCcw className="size-4" /> Take it again
                </button>
                <p className="mt-6 text-[11px] text-ivory/35">For fun only — real allocation depends on merit and your preference list.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
