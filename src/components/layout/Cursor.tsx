"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "@/lib/useFinePointer";

const interactive = "a, button, [role=button], [role=tab], input, select, label, [data-cursor]";

/**
 * A brass ring that trails the pointer, swells over anything interactive and shows a short
 * label where an element asks for one (data-cursor="Drag"). Mouse devices only; the native
 * cursor stays visible for accessibility.
 */
export function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(interactive);
      setHover(!!el);
      setLabel(el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [fine, x, y]);

  if (!fine) return null;
  const size = label ? 76 : hover ? 46 : 28;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <motion.div style={{ x: rx, y: ry }} className="absolute top-0 left-0">
        <motion.div
          animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brass-light/80 transition-colors duration-200 ${label ? "bg-brass-light" : "bg-brass-light/10"}`}
        >
          <AnimatePresence>
            {label && (
              <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} className="text-[11px] font-semibold tracking-wide whitespace-nowrap text-forest-950">
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div style={{ x, y }} className="absolute top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass" />
    </div>
  );
}
