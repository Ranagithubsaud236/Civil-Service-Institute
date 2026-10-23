"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/—";

/** Text that decodes letter by letter, left to right, the first time it scrolls into view. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduce || !el) return;
    const start = performance.now();
    const duration = 650 + text.length * 18;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * text.length);
      el.textContent = text
        .split("")
        .map((c, i) => (i < settled || c === " " ? c : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join("");
      if (t < 1) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text]);

  // the real text is what the server renders and what assistive tech reads
  return (
    <span ref={ref} aria-label={text} className={className}>
      {text}
    </span>
  );
}
