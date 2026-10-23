"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Contours } from "./Contours";
import { Skyline } from "./Skyline";

const ease = [0.22, 1, 0.36, 1] as const;

function useLayer(progress: MotionValue<number>, to: number, reduce: boolean | null) {
  return useSpring(useTransform(() => (reduce ? 0 : progress.get() * to)), { stiffness: 120, damping: 30, mass: 0.4 });
}

/** Scene 01 — The awakening: contour lines draw, a gold line sweeps in the headline, the skyline rises. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contourY = useLayer(scrollYProgress, 180, reduce);
  const textY = useLayer(scrollYProgress, -90, reduce);
  const hillsY = useLayer(scrollYProgress, 60, reduce);
  const cityY = useLayer(scrollYProgress, 20, reduce);
  const textOpacity = useTransform(() => (reduce ? 1 : 1 - Math.min(scrollYProgress.get() / 0.7, 1)));

  return (
    <section ref={ref} id="top" data-theme="dark" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest-950 pt-28 pb-[30vh] text-ivory">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_70%_30%,rgba(17,69,49,0.75),transparent_70%)]" />
      <motion.div style={{ y: contourY }} className="absolute inset-0 -z-10 text-brass-light/25">
        <Contours cx={1080} cy={300} count={14} className="absolute inset-0 size-full" />
        <Contours cx={160} cy={760} count={7} start={40} step={38} delay={0.6} className="absolute inset-0 size-full" />
      </motion.div>

      <motion.div style={{ y: textY, opacity: textOpacity }} className="container-page w-full">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }} className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="eyebrow text-brass-light">From aspirant to nation builder</span>
          <span lang="ur" dir="rtl" className="font-urdu text-lg leading-loose text-ivory/45">قوم کی خدمت</span>
        </motion.p>

        <h1 className="relative mt-6 max-w-4xl font-display text-[3.1rem] leading-[1.02] tracking-[-0.02em] sm:text-7xl lg:text-[6.2rem]">
          {/* the gold line travels across, unveiling each line of the headline behind it */}
          {["Be the change", <>you want to <em className="text-brass-light">see.</em></>].map((line, i) => (
            <span key={i} className="relative block">
              <motion.span
                className="block"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.3, delay: 0.5 + i * 0.35, ease: [0.65, 0, 0.35, 1] }}
              >
                {line}
              </motion.span>
              <motion.span
                aria-hidden
                className="absolute bottom-[0.12em] left-0 h-px w-full origin-left bg-brass-light"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ scaleX: { duration: 1.3, delay: 0.5 + i * 0.35, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.6, delay: 1.9 + i * 0.35 } }}
              />
            </span>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9, ease }} className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/70 text-pretty">
          Prepare for Pakistan&apos;s civil services with mentors who have served — and discover how one officer can change a district, a province, a nation.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.9, ease }} className="mt-10 flex flex-wrap gap-3">
          <Button href="#paths">Explore career paths</Button>
          <Button href="#map" variant="outlineLight" arrow={false}>See the nation connect</Button>
        </motion.div>
      </motion.div>

      <Skyline hillsY={hillsY} cityY={cityY} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.2em] text-ivory/50 uppercase sm:flex">
        Scroll to unfold
        <span className="relative h-10 w-px overflow-hidden bg-ivory/15">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-brass-light" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}
