"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useFinePointer } from "@/lib/useFinePointer";

const quote = "With faith, discipline and selfless devotion to duty, there is nothing worthwhile that you cannot achieve.";
const rand = (n: number) => ((Math.sin(n * 91.345 + 7.13) * 43758.5453) % 1 + 1) % 1;

/**
 * The Quaid's words as loose letters. They gather into the sentence when it scrolls into view;
 * on mouse devices they flee from the cursor and drift back into place.
 */
export function ScatterQuote() {
  const box = useRef<HTMLDivElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(box, { once: true, margin: "-120px" });
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const words = quote.split(" ");

  useEffect(() => {
    const el = box.current;
    if (!el || reduce) return;
    const spans = letters.current.filter(Boolean) as HTMLSpanElement[];
    // current offset of each letter; they start scattered and ease home
    const off = spans.map((_, i) => ({ x: (rand(i) - 0.5) * 600, y: (rand(i + 50) - 0.5) * 400, r: (rand(i + 99) - 0.5) * 90 }));
    let home: { x: number; y: number }[] = [];
    // resting centre of each letter, relative to the quote box
    const measure = () => {
      home = spans.map((s) => ({ x: s.offsetLeft + s.offsetWidth / 2, y: s.offsetTop + s.offsetHeight / 2 }));
    };
    measure();
    let pointer: { x: number; y: number } | null = null;
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      pointer = { x: e.clientX - b.left, y: e.clientY - b.top };
    };
    const leave = () => (pointer = null);
    if (fine) {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
    }
    window.addEventListener("resize", measure);

    let raf = 0;
    const tick = () => {
      spans.forEach((s, i) => {
        const o = off[i];
        let tx = 0, ty = 0;
        if (pointer && inView) {
          // push away from the cursor, strongest close by
          const dx = home[i].x + o.x - pointer.x, dy = home[i].y + o.y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          const force = Math.max(0, 1 - d / 140) * 60;
          tx = (dx / d) * force;
          ty = (dy / d) * force;
        }
        const k = inView ? 0.09 : 0;
        o.x += (tx - o.x) * k;
        o.y += (ty - o.y) * k;
        o.r += ((pointer ? tx * 0.3 : 0) - o.r) * k;
        s.style.transform = `translate(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px) rotate(${o.r.toFixed(1)}deg)`;
        s.style.opacity = inView ? String(Math.max(0.25, 1 - Math.hypot(o.x, o.y) / 400)) : "0";
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
    };
  }, [inView, fine, reduce]);

  let n = 0;
  return (
    <section data-theme="dark" className="overflow-hidden bg-navy-900 py-28 text-ivory lg:py-40">
      <div className="container-page">
        <div ref={box} data-cursor={fine ? "Scatter" : undefined} className="relative mx-auto max-w-5xl text-center">
          <span aria-hidden className="block font-display text-8xl leading-none text-gold-light/40">“</span>
          <p aria-label={quote} className="-mt-6 font-display text-[2.1rem] leading-[1.25] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            {words.map((w, wi) => (
              <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
                {w.split("").map((c) => {
                  const i = n++;
                  return (
                    <span key={i} ref={(el) => { letters.current[i] = el; }} className="inline-block will-change-transform">
                      {c}
                    </span>
                  );
                })}
                {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </p>
          <p className="mt-10 text-sm tracking-[0.2em] text-gold-light uppercase">Quaid-e-Azam Muhammad Ali Jinnah</p>
          {fine && <p className="mt-2 text-xs text-ivory/35">Move your cursor through the words</p>}
        </div>
      </div>
    </section>
  );
}
