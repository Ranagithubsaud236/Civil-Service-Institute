"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

// drops: x position (%), size, and when in the scroll each one falls
const drops = [
  { x: 12, r: 46, at: 0.05 }, { x: 28, r: 64, at: 0.12 }, { x: 44, r: 52, at: 0.02 }, { x: 58, r: 72, at: 0.16 },
  { x: 71, r: 48, at: 0.08 }, { x: 86, r: 60, at: 0.2 }, { x: 36, r: 40, at: 0.26 }, { x: 64, r: 44, at: 0.3 },
  { x: 20, r: 54, at: 0.34 }, { x: 80, r: 50, at: 0.38 },
];

function Drop({ d, p }: { d: (typeof drops)[number]; p: MotionValue<number> }) {
  const cy = useTransform(p, [d.at, d.at + 0.4], [-120, 820]);
  const r = useTransform(p, [d.at, d.at + 0.4, d.at + 0.55], [d.r * 0.4, d.r, d.r * 1.8]);
  return <motion.circle cx={d.x * 10} cy={cy} r={r} />;
}

/**
 * Ink drops fall and merge into a rising pool until the page floods dark — a liquid hand-off
 * from the ivory stories into the deep navy quote that follows. Entirely driven by the
 * visitor's own scrolling, so it renders the same for everyone (no server/client mismatch).
 */
export function InkFlood() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const pool = useTransform(p, [0.25, 0.95], [800, -60]);
  // the line appears only once the rising ink has passed behind it (ivory text needs the dark)
  const textOpacity = useTransform(p, [0.64, 0.76, 0.92, 1], [0, 1, 1, 0.6]);
  // once the ink has risen past the header, the header switches to its light-on-dark style
  const [flooded, setFlooded] = useState(false);
  useMotionValueEvent(p, "change", (v) => setFlooded(v > 0.85));

  return (
    <section ref={ref} aria-hidden data-theme={flooded ? "dark" : "light"} className="relative h-[180vh] bg-ivory-200">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs>
            {/* the "goo" filter: blur then sharpen alpha, so separate drops merge like liquid */}
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 34 -14" />
            </filter>
          </defs>
          <g filter="url(#goo)" className="fill-navy-900">
            {drops.map((d, i) => (
              <Drop key={i} d={d} p={p} />
            ))}
            <motion.rect x="-100" width="1200" height="1000" y={pool} />
          </g>
        </svg>
        <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 grid place-items-center px-6 text-center">
          <p className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-ivory sm:text-6xl">
            Every officer was once an aspirant with a <em className="text-gold-light">blank page.</em>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
