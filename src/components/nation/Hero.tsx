"use client";

import { Fragment, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useFinePointer } from "@/lib/useFinePointer";
import { useIntroReady } from "@/components/layout/Intro";
import { Contours } from "./Contours";
import { Skyline } from "./Skyline";

const ease = [0.22, 1, 0.36, 1] as const;
const smooth = { stiffness: 120, damping: 30, mass: 0.4 };

function useLayer(progress: MotionValue<number>, to: number, reduce: boolean | null) {
  return useSpring(useTransform(() => (reduce ? 0 : progress.get() * to)), smooth);
}

/** Pointer offset (−0.5…0.5) scaled into pixels, eased so the scene drifts rather than jumps. */
function usePointerLayer(m: MotionValue<number>, px: number) {
  return useSpring(useTransform(m, [-0.5, 0.5], [px, -px]), { stiffness: 70, damping: 20 });
}

/**
 * Scene 01 — The awakening. Contour lines draw, a gold line unveils the headline and the
 * Islamabad skyline rises against a low sun. Layers move at different speeds with the scroll
 * and, on mouse devices, with the cursor; as the visitor leaves, the whole scene folds into a card.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const ready = useIntroReady();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const contourY = useLayer(scrollYProgress, 180, reduce);
  const textY = useLayer(scrollYProgress, -90, reduce);
  const hillsY = useLayer(scrollYProgress, 60, reduce);
  const cityY = useLayer(scrollYProgress, 20, reduce);
  const textOpacity = useTransform(() => (reduce ? 1 : 1 - Math.min(scrollYProgress.get() / 0.7, 1)));
  // the hero shrinks into a rounded card as it hands over to the next section
  const stageScale = useTransform(() => (reduce ? 1 : 1 - Math.min(scrollYProgress.get(), 1) * 0.07));
  const stageRadius = useTransform(() => (reduce ? 0 : Math.min(scrollYProgress.get() * 2, 1) * 40));
  const indicator = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, 1]), smooth);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const contourX = usePointerLayer(mx, 30);
  const contourPY = usePointerLayer(my, 20);
  const hillsX = usePointerLayer(mx, 12);
  const cityX = usePointerLayer(mx, 26);
  const sunX = usePointerLayer(mx, 8);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 70, damping: 20 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 70, damping: 20 });

  return (
    <section
      ref={ref}
      id="top"
      data-theme="light"
      className="relative bg-ivory"
      onPointerMove={
        fine
          ? (e) => {
              mx.set(e.clientX / window.innerWidth - 0.5);
              my.set(e.clientY / window.innerHeight - 0.5);
            }
          : undefined
      }
    >
      {/* the dark theme belongs to the stage itself, so the header turns light once the stage folds away */}
      <motion.div
        data-theme="dark"
        style={{ scale: stageScale, borderBottomLeftRadius: stageRadius, borderBottomRightRadius: stageRadius }}
        className="relative isolate flex min-h-[100svh] origin-top items-center overflow-hidden bg-forest-950 pt-28 pb-[30vh] text-ivory"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_70%_30%,rgba(15,74,57,0.8),transparent_70%)]" />
        {/* remounted when the opening curtain lifts, so the whole sequence plays in view */}
        <Fragment key={ready ? "go" : "wait"}>
        <motion.div style={{ y: contourY }} className="absolute inset-0 -z-10">
          <motion.div style={{ x: contourX, y: contourPY }} className="absolute -inset-10 text-brass-light/25">
            <Contours cx={1080} cy={300} count={14} className="absolute inset-0 size-full" />
            <Contours cx={160} cy={760} count={7} start={40} step={38} delay={0.6} className="absolute inset-0 size-full" />
          </motion.div>
        </motion.div>

        {/* low sun glowing behind the skyline */}
        <motion.div style={{ y: hillsY, x: sunX }} className="pointer-events-none absolute right-[16%] bottom-[16vh] -z-10 sm:right-[24%]">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, delay: 1.2, ease }}
            className="size-56 rounded-full bg-[radial-gradient(circle,rgba(242,205,130,0.55)_0%,rgba(213,182,120,0.18)_38%,transparent_68%)] sm:size-80"
          >
            <motion.div animate={reduce ? undefined : { scale: [1, 1.06, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-[36%] rounded-full bg-[#f2cd82]/70 blur-sm" />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: textY, opacity: textOpacity }} className="container-page w-full [perspective:1200px]">
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY }}>
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
                    className="absolute bottom-[0.12em] left-0 h-px w-full origin-left bg-brass-light shadow-[0_0_12px_rgba(213,182,120,0.9)]"
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
              <Button href="#paths" magnetic>Explore career paths</Button>
              <Button href="#map" variant="outlineLight" arrow={false} magnetic>See the nation connect</Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <Skyline hillsY={hillsY} cityY={cityY} hillsX={hillsX} cityX={cityX} />

        {/* scroll cue: the thread fills as the visitor moves through the opening scene */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.2em] text-ivory/55 uppercase sm:flex">
          Scroll to unfold
          <span className="relative h-12 w-px overflow-hidden bg-ivory/15">
            <motion.span style={{ scaleY: indicator }} className="absolute inset-0 origin-top bg-brass-light" />
            <motion.span className="absolute inset-x-0 top-0 h-1/3 bg-ivory/70" animate={reduce ? undefined : { y: ["-100%", "300%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
          </span>
        </motion.div>
        </Fragment>
      </motion.div>
    </section>
  );
}
