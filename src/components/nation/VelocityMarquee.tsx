"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { groups } from "@/data/nation";

const wrap = (min: number, max: number, v: number) => ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min;

/** One row of the marquee: drifts on its own, then speeds up, reverses and leans with scroll velocity. */
function Row({ base, items, outline }: { base: number; items: string[]; outline?: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skewX = useTransform(velocity, [-2500, 2500], [10, -10]);
  const dir = useRef(1);
  const pos = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    // scrolling up reverses the drift; scrolling fast speeds it up
    if (boost.get() < 0) dir.current = -1;
    else if (boost.get() > 0) dir.current = 1;
    x.set(x.get() + dir.current * base * (delta / 1000) * (1 + Math.abs(boost.get())));
  });

  return (
    <motion.div style={{ x: pos, skewX: reduce ? 0 : skewX }} className="flex w-max gap-10 whitespace-nowrap">
      {[...items, ...items].map((g, i) => (
        <span key={i} className={outline ? "font-display text-5xl tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(213,182,120,0.6)] sm:text-7xl" : "font-display text-5xl tracking-tight text-ivory sm:text-7xl"}>
          {g} <span className="text-brass-light">✦</span>
        </span>
      ))}
    </motion.div>
  );
}

/** Twelve occupational groups streaming past — the faster you scroll, the faster they fly. */
export function VelocityMarquee() {
  return (
    <section data-theme="dark" aria-label="CSS occupational groups" className="overflow-hidden bg-forest-950 py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:gap-6">
        <Row base={-2.2} items={groups.slice(0, 6)} />
        <Row base={2.2} items={groups.slice(6)} outline />
      </div>
    </section>
  );
}
