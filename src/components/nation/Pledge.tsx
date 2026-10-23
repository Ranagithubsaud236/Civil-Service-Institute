"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eraser } from "lucide-react";
import { Heading } from "./Heading";

/** Sign a pledge with mouse or finger; sealing it brings down a brass stamp. */
export function Pledge() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [inked, setInked] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [date, setDate] = useState("");

  // match the canvas resolution to its on-screen size
  useEffect(() => {
    const c = canvas.current!;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      const ctx = c.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0a382b";
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, p: e.pressure || 0.5 };
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (sealed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvas.current!.getContext("2d")!;
    const pt = point(e);
    // faster strokes come out thinner, like a real nib
    const speed = Math.hypot(pt.x - last.current.x, pt.y - last.current.y);
    ctx.lineWidth = Math.max(1.4, 4.2 - speed * 0.12) * (0.6 + pt.p * 0.8);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    last.current = pt;
    if (!inked) setInked(true);
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const c = canvas.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setInked(false);
    setSealed(false);
  };
  const seal = () => {
    setDate(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
    setSealed(true);
  };

  return (
    <section id="pledge" data-theme="light" className="grain py-24 lg:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Heading eyebrow="Make it official — to yourself" title="Sign your pledge." intro="Every officer takes an oath. Yours can start today. Sign with your mouse or finger, then seal it." />

        <motion.div animate={sealed ? { x: [0, -6, 6, -3, 0] } : {}} transition={{ duration: 0.35, delay: 0.25 }} className="relative overflow-hidden rounded-[26px] bg-paper p-7 shadow-[0_30px_60px_-30px_rgba(19,33,26,0.35)] ring-1 ring-line sm:p-10">
          <p className="text-xs tracking-[0.2em] text-ink-mute uppercase">Pledge of preparation</p>
          <p className="mt-4 font-display text-2xl leading-snug text-ink sm:text-[1.7rem]">
            I will prepare with honesty, read with an open mind and, if I am chosen, serve every citizen without fear or favour.
          </p>

          <div className="relative mt-8">
            <canvas
              ref={canvas}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              data-cursor={sealed ? undefined : "Sign"}
              aria-label="Signature pad"
              className="h-36 w-full cursor-crosshair touch-none rounded-xl bg-ivory/70"
            />
            {!inked && <p className="pointer-events-none absolute inset-0 grid place-items-center font-hand text-3xl text-ink-mute/50">Sign here</p>}
            <div className="mx-4 -mt-6 border-b border-ink/25" />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button onClick={clear} className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
              <Eraser className="size-4" /> Clear
            </button>
            <button
              onClick={seal}
              disabled={!inked || sealed}
              className="sweep inline-flex h-11 items-center rounded-full bg-forest-800 px-6 text-sm font-medium text-ivory transition-all hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sealed ? "Sealed" : "Seal my pledge"}
            </button>
          </div>

          {/* the stamp comes down from above the paper and lands with a thump */}
          <AnimatePresence>
            {sealed && (
              <motion.div
                initial={{ scale: 2.6, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                transition={{ type: "spring", stiffness: 380, damping: 16 }}
                className="pointer-events-none absolute right-6 bottom-24 sm:right-10"
              >
                <svg viewBox="0 0 160 160" className="size-36 sm:size-40" aria-label={`Sealed on ${date}`}>
                  <defs>
                    <path id="stamp-ring" d="M80 80 m -58 0 a 58 58 0 1 1 116 0 a 58 58 0 1 1 -116 0" />
                  </defs>
                  <circle cx="80" cy="80" r="74" fill="none" stroke="#a07a3c" strokeWidth="4" />
                  <circle cx="80" cy="80" r="44" fill="none" stroke="#a07a3c" strokeWidth="2" />
                  <text className="fill-[#a07a3c] font-sans text-[13px] font-semibold tracking-[0.3em]">
                    <textPath href="#stamp-ring">CIVIL SERVICES INSTITUTE · PLEDGE ·</textPath>
                  </text>
                  <text x="80" y="76" textAnchor="middle" className="fill-[#a07a3c] font-display text-[22px]">CSS</text>
                  <text x="80" y="98" textAnchor="middle" className="fill-[#a07a3c] font-display text-[22px]">2027</text>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
          {sealed && <p className="mt-4 text-xs text-ink-mute">Sealed on {date}. Keep this promise in mind on the hard days.</p>}
        </motion.div>
      </div>
    </section>
  );
}
