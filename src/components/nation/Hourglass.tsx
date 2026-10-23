"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { site } from "@/data/site";
import { Heading } from "./Heading";

// the preparation year this hourglass measures: one year before the written exam
const EXAM = new Date(site.examDate).getTime();
const START = EXAM - 365 * 864e5;
const W = 220, H = 360, NECK = H / 2;

function remaining(now: number) {
  const d = Math.max(0, EXAM - now);
  return { days: Math.floor(d / 864e5), hours: Math.floor((d / 36e5) % 24), minutes: Math.floor((d / 6e4) % 60), seconds: Math.floor((d / 1e3) % 60) };
}

/** Half-width of the glass at height y — a pinched curve that narrows to the neck. */
const half = (y: number) => 10 + (W / 2 - 18) * Math.pow(Math.abs(y - NECK) / NECK, 0.75);

/**
 * An hourglass for the preparation year. The sand levels show how much of the year is gone and a
 * thin stream of grains keeps falling, next to a live countdown to the CSS written exam.
 */
export function Hourglass() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(canvas, { margin: "-80px" });
  const reduce = useReducedMotion();
  const [left, setLeft] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    const tick = () => setLeft(remaining(Date.now()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !inView) return;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = W * dpr;
    c.height = H * dpr;
    ctx.scale(dpr, dpr);
    const grains: { x: number; y: number; v: number }[] = [];
    let raf = 0;

    const sand = (topLevel: number, bottomLevel: number) => {
      ctx.fillStyle = "#d5b678";
      // top bulb: sand from topLevel down to the neck
      ctx.beginPath();
      for (let y = topLevel; y <= NECK; y += 2) ctx.lineTo(W / 2 - half(y) + 4, y);
      for (let y = NECK; y >= topLevel; y -= 2) ctx.lineTo(W / 2 + half(y) - 4, y);
      ctx.closePath();
      ctx.fill();
      // bottom bulb: a mound up to bottomLevel
      ctx.beginPath();
      ctx.moveTo(W / 2 - half(H - 4) + 4, H - 4);
      for (let y = H - 4; y >= bottomLevel; y -= 2) ctx.lineTo(W / 2 - half(y) + 4, y);
      ctx.quadraticCurveTo(W / 2, bottomLevel - 18, W / 2 + half(bottomLevel) - 4, bottomLevel);
      for (let y = bottomLevel; y <= H - 4; y += 2) ctx.lineTo(W / 2 + half(y) - 4, y);
      ctx.closePath();
      ctx.fill();
    };

    const frame = () => {
      const used = Math.min(1, Math.max(0, (Date.now() - START) / (EXAM - START)));
      const topLevel = NECK - (NECK - 24) * (1 - used);
      const bottomLevel = H - 6 - (NECK - 40) * used;
      ctx.clearRect(0, 0, W, H);
      sand(topLevel, bottomLevel);
      if (!reduce && used < 1) {
        // a few new grains every frame, falling from the neck to the mound
        for (let k = 0; k < 3; k++) grains.push({ x: W / 2 + (Math.random() - 0.5) * 3, y: NECK, v: 1 + Math.random() * 1.5 });
        ctx.fillStyle = "#f2cd82";
        for (let i = grains.length - 1; i >= 0; i--) {
          const g = grains[i];
          g.v += 0.25;
          g.y += g.v;
          g.x += (Math.random() - 0.5) * 0.6;
          if (g.y > bottomLevel - 14) grains.splice(i, 1);
          else ctx.fillRect(g.x, g.y, 1.6, 1.6);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  const glass = `M18 4 H${W - 18} ` + Array.from({ length: 91 }, (_, i) => { const y = 4 + (i * (H - 8)) / 90; return `L${(W / 2 + half(y)).toFixed(1)} ${y.toFixed(1)}`; }).join(" ") + ` H18 ` + Array.from({ length: 91 }, (_, i) => { const y = H - 4 - (i * (H - 8)) / 90; return `L${(W / 2 - half(y)).toFixed(1)} ${y.toFixed(1)}`; }).join(" ") + " Z";

  return (
    <section id="hourglass" data-theme="dark" className="bg-forest-900 py-24 text-ivory lg:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_auto_1fr]">
        <Heading dark eyebrow="Time is the syllabus too" title="The sand is already falling." intro="The levels show how much of the preparation year before the CSS 2027 written exam has already gone." />

        <div className="relative mx-auto" style={{ width: W, height: H }}>
          <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
            <path d={glass} fill="rgba(246,240,227,0.04)" stroke="rgba(246,240,227,0.45)" strokeWidth={1.5} />
            <rect x="6" y="0" width={W - 12} height="8" rx="3" fill="#a07a3c" />
            <rect x="6" y={H - 8} width={W - 12} height="8" rx="3" fill="#a07a3c" />
          </svg>
        </div>

        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {(["days", "hours", "minutes", "seconds"] as const).map((k) => (
            <div key={k} className="rounded-2xl bg-forest-950/50 px-5 py-4 ring-1 ring-ivory/10">
              <dd className="font-display text-4xl tabular-nums sm:text-5xl">{left ? String(left[k]).padStart(2, "0") : "--"}</dd>
              <dt className="mt-1 text-xs tracking-wider text-ivory/50 capitalize">{k} left</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
