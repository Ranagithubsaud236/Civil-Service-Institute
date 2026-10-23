"use client";

import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";
import { useFinePointer } from "@/lib/useFinePointer";

type Props = HTMLMotionProps<"div"> & { max?: number };

/**
 * Tilts toward the pointer. Children placed with `Depth` sit at different heights,
 * so labels, art and borders move at different speeds. Mouse devices only.
 */
export function Tilt({ max = 8, className, children, ...rest }: Props) {
  const fine = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), { stiffness: 180, damping: 18 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <div className="[perspective:900px]">
      <motion.div
        onPointerMove={
          fine
            ? (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set((e.clientX - r.left) / r.width - 0.5);
                my.set((e.clientY - r.top) / r.height - 0.5);
              }
            : undefined
        }
        onPointerLeave={() => (mx.set(0), my.set(0))}
        style={fine ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={cn("relative", className)}
        {...rest}
      >
        {children as React.ReactNode}
        {fine && (
          <motion.span
            aria-hidden
            style={{ backgroundPositionX: glareX }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(105deg,transparent_35%,rgba(255,240,210,0.16)_50%,transparent_65%)] bg-[length:250%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </motion.div>
    </div>
  );
}

/** A layer inside `Tilt`, lifted toward the viewer by `z` pixels. */
export function Depth({ z = 20, className, children }: { z?: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={className} style={{ transform: `translateZ(${z}px)` }}>
      {children}
    </div>
  );
}
