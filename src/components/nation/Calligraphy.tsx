"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * "Pakistan" in Nastaliq, written stroke by stroke as the reader scrolls — the pen traces the
 * outline first, then gold ink floods in.
 */
export function Calligraphy() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const dash = useTransform(p, [0, 0.7], reduce ? [0, 0] : [3000, 0]);
  const fill = useTransform(p, [0.6, 0.85], reduce ? [1, 1] : [0, 1]);
  const glow = useTransform(p, [0.75, 1], [0, 0.6]);
  const captionOpacity = useTransform(p, [0.7, 0.9], [0, 1]);
  const captionY = useTransform(p, [0.7, 0.9], [20, 0]);

  return (
    <section ref={ref} data-theme="dark" className="relative h-[200vh] bg-forest-950" aria-label="Pakistan, written in Nastaliq">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden text-ivory">
        <motion.div style={{ opacity: glow }} className="pointer-events-none absolute size-[60vmin] rounded-full bg-[radial-gradient(circle,rgba(213,182,120,0.25),transparent_65%)]" />
        <svg viewBox="0 0 1000 420" className="relative w-[min(92vw,1100px)]" aria-hidden>
          <motion.text
            x="500"
            y="290"
            textAnchor="middle"
            className="font-urdu"
            fontSize="260"
            stroke="#d5b678"
            strokeWidth={2}
            strokeDasharray="3000"
            style={{ strokeDashoffset: dash, fill: "#d5b678", fillOpacity: fill }}
          >
            پاکستان
          </motion.text>
        </svg>
        <motion.div style={{ opacity: captionOpacity, y: captionY }} className="relative mt-4 text-center">
          <p className="eyebrow justify-center text-brass-light">Pakistan</p>
          <p className="mt-3 font-display text-2xl text-ivory/75 sm:text-3xl">Seventy-nine years. One promise to keep.</p>
        </motion.div>
      </div>
    </section>
  );
}
