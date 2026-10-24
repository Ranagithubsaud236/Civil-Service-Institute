"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { Scramble } from "@/components/ui/Scramble";

const qualities = [
  { word: "Integrity", urdu: "دیانت", line: "Doing right when no one is watching." },
  { word: "Empathy", urdu: "ہمدردی", line: "Seeing the citizen behind every file." },
  { word: "Courage", urdu: "حوصلہ", line: "Deciding under pressure, and owning it." },
  { word: "Judgement", urdu: "بصیرت", line: "Weighing evidence before opinion." },
  { word: "Discipline", urdu: "نظم", line: "Showing up prepared, every single day." },
  { word: "Service", urdu: "خدمت", line: "Putting the public before the self." },
];

function Grid({ bright }: { bright?: boolean }) {
  return (
    <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {qualities.map((q) => (
        <div key={q.word}>
          <p lang="ur" className={bright ? "font-urdu text-2xl text-gold-light" : "font-urdu text-2xl text-ivory/[0.07]"}>{q.urdu}</p>
          <p className={bright ? "font-display text-6xl tracking-tight text-ivory sm:text-7xl" : "font-display text-6xl tracking-tight text-ivory/[0.07] sm:text-7xl"}>{q.word}</p>
          <p className={bright ? "mt-2 text-ivory/75" : "mt-2 text-ivory/[0.05]"}>{q.line}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * The qualities of an officer, hidden in the dark. The cursor becomes a torch that reveals them;
 * on touch screens (or when the cursor leaves) the light drifts around on its own.
 */
export function Torch() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.style.setProperty("--r", "2000px");
      return;
    }
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    const start = performance.now();
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => (pointer = null);
    const tick = (now: number) => {
      const r = el.getBoundingClientRect();
      // a slow figure-of-eight when nobody is steering
      const t = (now - start) / 1000;
      const auto = { x: r.width * (0.5 + 0.38 * Math.sin(t * 0.45)), y: r.height * (0.5 + 0.32 * Math.sin(t * 0.9)) };
      const target = pointer ?? auto;
      const cx = parseFloat(el.style.getPropertyValue("--x") || String(auto.x));
      const cy = parseFloat(el.style.getPropertyValue("--y") || String(auto.y));
      el.style.setProperty("--x", `${cx + (target.x - cx) * 0.12}px`);
      el.style.setProperty("--y", `${cy + (target.y - cy) * 0.12}px`);
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  return (
    <section id="torch" data-theme="dark" className="bg-navy-950 py-24 text-ivory lg:py-32">
      <div className="container-page">
        <p className="eyebrow text-gold-light">
          <Scramble text="What the commission looks for" />
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.06] tracking-tight md:text-[3.4rem]">Some qualities only show when you shine a light on them.</h2>

        <div ref={ref} data-cursor="Reveal" className="relative mt-16 cursor-none [--r:220px] sm:[--r:280px]">
          {/* the faint layer everyone sees */}
          <Grid />
          {/* the bright layer, visible only inside the torch beam */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage: "radial-gradient(circle var(--r) at var(--x, 50%) var(--y, 50%), #000 0%, rgba(0,0,0,0.85) 40%, transparent 100%)",
              maskImage: "radial-gradient(circle var(--r) at var(--x, 50%) var(--y, 50%), #000 0%, rgba(0,0,0,0.85) 40%, transparent 100%)",
            }}
          >
            <Grid bright />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{ background: "radial-gradient(circle calc(var(--r) * 0.9) at var(--x, 50%) var(--y, 50%), rgba(206,151,68,0.16), transparent 70%)" }}
          />
        </div>
      </div>
    </section>
  );
}
