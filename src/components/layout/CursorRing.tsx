"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** A trailing ring that grows over anything clickable. Mouse devices only; the real cursor stays. */
export function CursorRing() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.4 });
  const y = useSpring(my, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce || !matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setOn(true);
      setHover(!!(e.target as Element).closest?.("a, button, [role=tab], input, select, textarea"));
    };
    const leave = () => setOn(false);
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [mx, my, reduce]);

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden pointer-fine:block"
    >
      <motion.span
        animate={{ scale: down ? 0.7 : hover ? 1.9 : 1, opacity: on ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
        className="block size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-gold bg-gold/5 mix-blend-multiply"
      />
    </motion.div>
  );
}
