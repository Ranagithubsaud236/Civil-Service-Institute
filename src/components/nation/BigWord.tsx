"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

type Props = { word: string; urdu: string; dark?: boolean };

/**
 * Oversized word that slides across the screen as the reader passes it,
 * with its Urdu counterpart drifting the other way — a transition between chapters.
 */
export function BigWord({ word, urdu, dark }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });
  const x = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["12%", "-28%"]);
  const xUrdu = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["-20%", "10%"]);
  const opacity = useTransform(p, [0, 0.35, 0.65, 1], [0.15, 1, 1, 0.15]);

  return (
    <div ref={ref} data-theme={dark ? "dark" : "light"} aria-hidden className={cn("relative overflow-hidden py-10 select-none sm:py-14", dark ? "bg-forest-950" : "bg-ivory")}>
      <motion.p
        style={{ x, opacity }}
        className={cn(
          "font-display text-[22vw] leading-[0.85] font-medium tracking-[-0.04em] whitespace-nowrap sm:text-[16vw]",
          dark ? "text-transparent [-webkit-text-stroke:1px_rgba(213,182,120,0.45)]" : "text-transparent [-webkit-text-stroke:1px_rgba(10,56,43,0.35)]",
        )}
      >
        {word} · {word}
      </motion.p>
      <motion.p style={{ x: xUrdu }} lang="ur" className={cn("-mt-2 text-right font-urdu text-5xl whitespace-nowrap sm:text-7xl", dark ? "text-brass-light/30" : "text-brass/40")}>
        {urdu} · {urdu} · {urdu}
      </motion.p>
    </div>
  );
}
