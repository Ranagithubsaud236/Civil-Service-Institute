"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { resources } from "@/data/nation";
import { cn } from "@/lib/cn";
import { Depth, Tilt } from "@/components/ui/Tilt";
import { Heading } from "./Heading";

/** Swipeable preparation tools: native swipe on touch, drag / arrows / keyboard on desktop. */
export function Toolkit() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const { scrollXProgress } = useScroll({ container: track });
  const progress = useSpring(scrollXProgress, { stiffness: 140, damping: 26 });

  const step = (dir: 1 | -1) => {
    const el = track.current!;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };

  return (
    <section id="toolkit" data-theme="light" className="overflow-hidden bg-paper py-24 lg:py-32">
      <div className="container-page flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <Heading eyebrow="Preparation toolkit" title="Everything you need, one swipe away." intro="Drag, swipe or use the arrow keys to browse the tools every student receives." />
        <div className="flex gap-2">
          <button onClick={() => step(-1)} aria-label="Previous tool" className="grid size-12 place-items-center rounded-full ring-1 ring-line transition-all duration-200 hover:bg-forest-800 hover:text-ivory hover:ring-forest-800">
            <ArrowLeft className="size-5" />
          </button>
          <button onClick={() => step(1)} aria-label="Next tool" className="grid size-12 place-items-center rounded-full ring-1 ring-line transition-all duration-200 hover:bg-forest-800 hover:text-ivory hover:ring-forest-800">
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        tabIndex={0}
        aria-label="Preparation tools"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          step(e.key === "ArrowRight" ? 1 : -1);
        }}
        // mouse drag-to-scroll; touch devices keep their native swipe
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { x: e.clientX, left: track.current!.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          track.current!.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        onClickCapture={(e) => drag.current?.moved && e.preventDefault()}
        className="mt-12 flex cursor-grab gap-5 pointer-coarse:snap-x pointer-coarse:snap-mandatory overflow-x-auto px-5 pb-6 outline-none [scrollbar-width:none] active:cursor-grabbing sm:px-8 lg:px-[max(2rem,calc((100vw-76rem)/2+2rem))]"
      >
        {resources.map((r, i) => (
          <div key={r.title} data-card className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
            <Tilt max={7} className="group h-[420px] overflow-hidden rounded-[26px] select-none">
              <div className={cn("absolute inset-0 bg-gradient-to-br", r.tone)} />
              {/* abstract art layer — sits deepest, so it moves least */}
              <Depth z={0} className="absolute inset-0 opacity-50">
                <svg viewBox="0 0 340 420" className="size-full" aria-hidden>
                  {Array.from({ length: 7 }, (_, k) => (
                    <circle key={k} cx={260 - i * 12} cy={110 + i * 8} r={30 + k * 34} fill="none" stroke="#d5b678" strokeOpacity={0.35 - k * 0.04} />
                  ))}
                </svg>
              </Depth>
              <div className="absolute inset-0 flex flex-col justify-between p-7 text-ivory [transform-style:preserve-3d]">
                <Depth z={30} className="flex items-center justify-between">
                  <span className="rounded-full bg-ivory/10 px-3 py-1 text-xs ring-1 ring-ivory/20 backdrop-blur">{r.tag}</span>
                  <span className="font-display text-sm text-ivory/50">0{i + 1}</span>
                </Depth>
                <Depth z={55}>
                  <h3 className="font-display text-[2.1rem] leading-[1.05] tracking-tight">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{r.body}</p>
                </Depth>
              </div>
            </Tilt>
          </div>
        ))}
      </div>

      <div className="container-page mt-4">
        <div className="h-px overflow-hidden bg-line">
          <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-forest-800" />
        </div>
      </div>
    </section>
  );
}
