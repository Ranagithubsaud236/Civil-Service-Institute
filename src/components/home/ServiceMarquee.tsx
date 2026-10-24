"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

const groups = [
  "Pakistan Administrative Service",
  "Police Service of Pakistan",
  "Foreign Service of Pakistan",
  "Inland Revenue Service",
  "Pakistan Customs",
  "Commerce & Trade",
  "Information Group",
  "Military Lands & Cantonments",
];

/**
 * Two rows of occupational groups drifting in opposite directions. Scrolling speeds them up
 * and tilts them, so the band reacts to how fast the visitor moves.
 */
export function ServiceMarquee() {
  return (
    <section id="groups" aria-label="Occupational groups" className="overflow-hidden border-y border-line bg-white py-8">
      <Row dir={-1} />
      <Row dir={1} outline />
    </section>
  );
}

function Row({ dir, outline }: { dir: 1 | -1; outline?: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const width = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const speed = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(speed, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });
  const skew = useTransform(speed, [-2000, 2000], [8, -8]);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    if (!width.current && ref.current) width.current = ref.current.scrollWidth / 2;
    const w = width.current;
    if (!w) return;
    // base drift plus a scroll boost; the boost keeps the row's own direction
    const move = dir * (40 + Math.abs(boost.get()) * 60) * (delta / 1000);
    let next = x.get() + move;
    if (next <= -w) next += w;
    if (next > 0) next -= w;
    x.set(next);
  });

  return (
    <motion.div ref={ref} style={{ x, skewX: skew }} className="flex w-max py-1.5 whitespace-nowrap">
      {[0, 1].map((copy) => (
        <span key={copy} aria-hidden={copy === 1} className="flex">
          {groups.map((g) => (
            <span key={g} className="flex items-center">
              <span
                className={
                  outline
                    ? "font-display text-5xl tracking-tight text-transparent [-webkit-text-stroke:1px_var(--color-navy)] md:text-7xl"
                    : "font-display text-5xl tracking-tight text-navy md:text-7xl"
                }
              >
                {g}
              </span>
              <span className="mx-8 text-3xl text-gold md:text-4xl">✦</span>
            </span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}
