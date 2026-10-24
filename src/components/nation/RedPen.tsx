"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";

const Progress = createContext<MotionValue<number> | null>(null);

/** 0 → 1 as the marking passes `at` (a point in the section's scroll progress). */
function useInk(at: number, span = 0.07) {
  const p = useContext(Progress)!;
  return useTransform(p, [at, at + span], [0, 1]);
}

const red = "#c0392b";

/** A phrase that gets a wavy underline, a circle or a strike-through with a correction. */
function Mark({ kind, at, fix, children }: { kind: "wave" | "circle" | "strike" | "tick"; at: number; fix?: string; children: React.ReactNode }) {
  const ink = useInk(at);
  const fixOpacity = useTransform(ink, [0.6, 1], [0, 1]);
  return (
    <span className="relative inline-block">
      {children}
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[-4%] -inset-y-1 h-[calc(100%+0.5rem)] w-[108%] overflow-visible" aria-hidden>
        {kind === "wave" && <motion.path d="M0 18 Q 6 14 12 18 T 24 18 T 36 18 T 48 18 T 60 18 T 72 18 T 84 18 T 100 18" fill="none" stroke={red} strokeWidth={1.6} vectorEffect="non-scaling-stroke" style={{ pathLength: ink }} />}
        {kind === "circle" && <motion.path d="M50 1 C 85 0 101 6 99 11 C 97 18 70 20 46 19 C 14 18 -1 15 1 9 C 3 3 28 1 56 2" fill="none" stroke={red} strokeWidth={1.6} vectorEffect="non-scaling-stroke" style={{ pathLength: ink }} />}
        {kind === "strike" && <motion.path d="M2 11 L 98 9" fill="none" stroke={red} strokeWidth={1.8} vectorEffect="non-scaling-stroke" style={{ pathLength: ink }} />}
      </svg>
      {fix && (
        <motion.span style={{ opacity: fixOpacity }} className="absolute -top-6 left-1/2 -translate-x-1/2 font-hand text-2xl leading-none whitespace-nowrap text-redpen -rotate-3">
          {fix}
        </motion.span>
      )}
    </span>
  );
}

/** A handwritten comment in the margin, written on as the marking reaches it. */
function Note({ at, children, tone = "red" }: { at: number; children: React.ReactNode; tone?: "red" | "good" }) {
  const ink = useInk(at, 0.08);
  const clip = useTransform(ink, (v) => `inset(0 ${100 - v * 100}% 0 0)`);
  return (
    <motion.p style={{ clipPath: clip }} className={cn("font-hand text-[1.55rem] leading-tight -rotate-2", tone === "good" ? "text-navy-700" : "text-redpen")}>
      {children}
    </motion.p>
  );
}

/** Scroll past an essay draft while an examiner's red pen marks it, line by line. */
export function RedPen() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const score = useTransform(p, [0.82, 0.95], [0, 1]);
  const scoreText = useTransform(p, [0.86, 0.95], [0, 1]);

  return (
    <section id="redpen" data-theme="light" className="grain py-24 lg:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <Heading
          className="lg:sticky lg:top-32 lg:self-start"
          eyebrow="Red-pen evaluation"
          title="Every script comes back covered in ink — on purpose."
          intro="Scroll down the page and watch an evaluator mark an English essay draft the way the FPSC examiner reports ask for: thesis, evidence, structure and language."
        />

        <Progress.Provider value={p}>
          <div ref={ref} className="relative">
            {/* answer-sheet paper: ruled lines and a red margin */}
            <div className="relative overflow-hidden rounded-[22px] bg-paper p-6 shadow-[0_30px_60px_-30px_rgba(14,28,46,0.35)] ring-1 ring-line sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_43px,rgba(14,28,46,0.07)_43px_44px)]" />
              <div className="pointer-events-none absolute inset-y-0 left-10 w-px bg-redpen/30 sm:left-14" />

              <p className="relative pl-6 text-xs tracking-[0.2em] text-ink-mute uppercase sm:pl-8">Essay · Climate change and governance in Pakistan</p>

              {[
                {
                  body: (
                    <>
                      Climate change is a very big problem for Pakistan and it <Mark kind="strike" at={0.08} fix="affects">effects</Mark> everyone. In my opinion, the government should <Mark kind="wave" at={0.16}>do something about it</Mark>.
                    </>
                  ),
                  note: <Note at={0.22}>Thesis? State your argument clearly.</Note>,
                },
                {
                  body: (
                    <>
                      The 2022 floods showed how weak our early-warning systems are. <Mark kind="circle" at={0.36}>Many people</Mark> lost their homes, and relief reached some districts <Mark kind="wave" at={0.46}>very late</Mark>.
                    </>
                  ),
                  note: <Note at={0.5}>How many? Cite a source.</Note>,
                },
                {
                  body: (
                    <>
                      Therefore, Pakistan must invest in climate-resilient infrastructure and strengthen local governments, so that relief reaches every district faster.
                    </>
                  ),
                  note: (
                    <Note at={0.66} tone="good">
                      ✓ Strong, specific conclusion.
                    </Note>
                  ),
                },
              ].map((para, i) => (
                <div key={i} className="relative mt-8 grid gap-3 pl-6 sm:grid-cols-[1fr_11rem] sm:gap-6 sm:pl-8">
                  <p className="font-display text-xl leading-[44px] text-ink sm:text-2xl sm:leading-[44px]">{para.body}</p>
                  <div className="sm:pt-2">{para.note}</div>
                </div>
              ))}

              {/* the score, circled at the end */}
              <div className="relative mt-10 flex items-end justify-between gap-6 pl-6 sm:pl-8">
                <Note at={0.76}>Rewrite the introduction, then resubmit.</Note>
                <div className="relative grid size-28 shrink-0 place-items-center">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-12" aria-hidden>
                    <motion.path d="M50 6 C 80 4 96 26 94 52 C 92 80 70 96 46 94 C 18 92 4 70 6 46 C 8 22 28 7 58 8" fill="none" stroke={red} strokeWidth={2.2} style={{ pathLength: score }} />
                  </svg>
                  <motion.span style={{ opacity: scoreText }} className="font-hand text-5xl leading-none text-redpen">14<span className="text-3xl">/20</span></motion.span>
                </div>
              </div>
            </div>
          </div>
        </Progress.Provider>
      </div>
    </section>
  );
}
