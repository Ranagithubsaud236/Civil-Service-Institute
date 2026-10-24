"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { Crest } from "@/components/ui/Logo";

const ReadyContext = createContext(false);

/** True once the opening curtain has lifted (or was skipped) — the hero waits for it. */
export const useIntroReady = () => useContext(ReadyContext);

const KEY = "csi-intro-seen";

/**
 * Opening curtain: crest, an Urdu welcome and a counter, then the curtain lifts. Plays once per
 * browser session and is skipped entirely for visitors who prefer reduced motion.
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"playing" | "lifting" | "done">("playing");
  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    const run = animate(count, 100, { duration: 1.7, ease: [0.65, 0, 0.35, 1] });
    const t = setTimeout(() => {
      setPhase("lifting");
      document.documentElement.style.overflow = "";
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
    }, 2100);
    return () => {
      run.stop();
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [count]);

  return (
    <ReadyContext.Provider value={phase !== "playing"}>
      {children}
      <AnimatePresence onExitComplete={() => setPhase("done")}>
        {phase === "playing" && (
          <motion.div
            key="intro"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            style={{ clipPath: "inset(0 0 0% 0)" }}
            className="fixed inset-0 z-[70] grid place-items-center bg-navy-950 text-ivory"
          >
            <div className="flex flex-col items-center text-center">
              <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <Crest size={72} />
              </motion.div>
              <motion.p lang="ur" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-8 font-urdu text-4xl leading-loose text-gold-light">
                خوش آمدید
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-1 text-xs tracking-[0.3em] text-ivory/50 uppercase">
                Civil Services Institute
              </motion.p>
              <div className="mt-10 h-px w-48 overflow-hidden bg-ivory/10">
                <motion.div className="h-full origin-left bg-gold-light" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.7, ease: [0.65, 0, 0.35, 1] }} />
              </div>
              <motion.span className="mt-4 font-display text-sm tabular-nums text-ivory/45">{shown}</motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ReadyContext.Provider>
  );
}
