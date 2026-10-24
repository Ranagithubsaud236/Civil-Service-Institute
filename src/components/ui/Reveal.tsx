"use client";

import { motion, type HTMLMotionProps } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fades and lifts children once, when they enter the viewport. */
export function Reveal({ delay = 0, y = 20, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Each line rises from behind a mask — used for large headlines only. */
export function LineReveal({ lines, className, delay = 0 }: { lines: React.ReactNode[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.1, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
