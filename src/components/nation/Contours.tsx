"use client";

import { motion } from "motion/react";

/**
 * Topographic contour rings that draw themselves — a nod to Pakistan's landscape.
 * Paths are generated deterministically (rounded) so server and client markup match.
 */
function ring(cx: number, cy: number, r: number, k: number, stretch: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const rr = r * (1 + 0.12 * Math.sin(3 * t + k * 0.5) + 0.07 * Math.sin(5 * t - k * 0.3));
    pts.push(`${(cx + Math.cos(t) * rr * stretch).toFixed(1)} ${(cy + Math.sin(t) * rr).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

type Props = { cx: number; cy: number; count?: number; start?: number; step?: number; delay?: number; className?: string };

export function Contours({ cx, cy, count = 12, start = 50, step = 44, delay = 0, className }: Props) {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      {Array.from({ length: count }, (_, k) => (
        <motion.path
          key={k}
          d={ring(cx, cy, start + k * step, k, 1.35)}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 - k / (count + 4) }}
          transition={{ pathLength: { duration: 2.6, delay: delay + k * 0.09, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.6, delay: delay + k * 0.09 } }}
        />
      ))}
    </svg>
  );
}
