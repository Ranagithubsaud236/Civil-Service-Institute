"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type HTMLMotionProps } from "motion/react";

/** Offset per breakpoint, mobile-first — e.g. `{ base: 12, sm: 40, lg: 60 }`. */
type Responsive = number | { base: number; sm?: number; lg?: number };

type Props = HTMLMotionProps<"div"> & {
  /** Pixels travelled while the element crosses the viewport. Negative moves against the scroll. */
  offset?: Responsive;
};

const queries = { sm: "(min-width: 640px)", lg: "(min-width: 1024px)" };

function useBreakpoint() {
  const [bp, setBp] = useState<"base" | "sm" | "lg">("base");
  useEffect(() => {
    const sm = window.matchMedia(queries.sm);
    const lg = window.matchMedia(queries.lg);
    const update = () => setBp(lg.matches ? "lg" : sm.matches ? "sm" : "base");
    update();
    sm.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      sm.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return bp;
}

function resolve(offset: Responsive, bp: "base" | "sm" | "lg") {
  if (typeof offset === "number") return offset;
  if (bp === "lg") return offset.lg ?? offset.sm ?? offset.base;
  if (bp === "sm") return offset.sm ?? offset.base;
  return offset.base;
}

/**
 * Moves its children vertically at a different rate to the page while the element is on screen.
 * Disabled when the user prefers reduced motion.
 */
export function Parallax({ offset = 60, style, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const bp = useBreakpoint();
  const px = reduce ? 0 : resolve(offset, bp);
  // kept in a motion value so a breakpoint change updates the transform without remounting
  const distance = useMotionValue(px);
  useEffect(() => distance.set(px), [distance, px]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(() => distance.get() * (1 - scrollYProgress.get() * 2));
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div ref={ref} style={{ ...style, y }} {...rest}>
      {children}
    </motion.div>
  );
}
