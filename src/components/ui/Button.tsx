"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFinePointer } from "@/lib/useFinePointer";

const variants = {
  gold: "bg-gold-light text-navy-950 hover:bg-[#dcab5e] shadow-[0_10px_30px_-12px_rgba(206,151,68,0.75)]",
  navy: "bg-navy-800 text-ivory hover:bg-navy-900",
  outlineLight: "text-ivory ring-1 ring-ivory/30 hover:ring-ivory/70 hover:bg-ivory/5",
  outlineDark: "text-ink ring-1 ring-ink/20 hover:ring-ink/50 hover:bg-ink/[0.03]",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  arrow?: boolean;
  /** drifts toward the cursor when it comes near (mouse devices only) */
  magnetic?: boolean;
  className?: string;
};

/** Pill button with a gold light sweep on hover. Only in-page anchors are used in the demo. */
export function Button({ href, children, variant = "gold", arrow = true, magnetic = false, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const pull = magnetic && fine;

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const link = (
    <motion.a
      ref={ref}
      href={href}
      style={pull ? { x, y } : undefined}
      className={cn(
        "sweep group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-[background-color,box-shadow,color] duration-200 ease-out-soft active:scale-[0.98]",
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <span className="relative size-4 overflow-hidden">
          <ArrowRight className="absolute inset-0 size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-5" />
          <ArrowRight className="absolute inset-0 size-4 -translate-x-5 transition-transform duration-300 ease-out-soft group-hover:translate-x-0" />
        </span>
      )}
    </motion.a>
  );

  if (!magnetic) return link;
  // a slightly larger hit area, so the pull starts before the cursor touches the button
  return (
    <span className="-m-4 inline-flex p-4" onPointerMove={pull ? onMove : undefined} onPointerLeave={pull ? reset : undefined}>
      {link}
    </span>
  );
}
