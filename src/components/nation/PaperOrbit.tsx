"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Calculator, Globe2, Landmark, MoonStar, PenLine } from "lucide-react";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";

const papers = [
  { name: "English Essay", icon: PenLine, body: "One essay, three hours — the paper that decides most attempts. Thesis, structure and argument matter more than vocabulary.", orbit: 0 },
  { name: "Précis & Composition", icon: BookOpen, body: "Précis writing, comprehension, grammar, idioms and translation — accuracy under time pressure.", orbit: 0 },
  { name: "General Science & Ability", icon: Calculator, body: "Everyday science alongside arithmetic, logic and reasoning — very scoreable with steady practice.", orbit: 1 },
  { name: "Current Affairs", icon: Globe2, body: "Pakistan's domestic and foreign affairs and the global issues that shape them.", orbit: 1 },
  { name: "Pakistan Affairs", icon: Landmark, body: "History, constitution, economy and geography of Pakistan — from the freedom movement to today.", orbit: 2 },
  { name: "Islamic Studies", icon: MoonStar, body: "Or Comparative Study of Major Religions for non-Muslim candidates.", orbit: 2 },
];
// three rings, each turning at its own speed; two papers sit opposite each other on every ring
const rings = [
  { size: 46, seconds: 40 },
  { size: 70, seconds: 60 },
  { size: 94, seconds: 85 },
];

/** The six compulsory papers as a small solar system around their 600 marks. Hover to pause and read. */
export function PaperOrbit() {
  const [active, setActive] = useState<number | null>(null);
  const paused = active !== null;

  return (
    <section id="orbit" data-theme="dark" className="overflow-hidden bg-forest-950 py-24 text-ivory lg:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Heading dark eyebrow="Six compulsory papers" title="Everything orbits the 600 marks you can't skip." intro="Hover or tap a planet to stop the system and read about the paper." />
          <div className="mt-8 min-h-40">
            <AnimatePresence mode="wait">
              {active !== null ? (
                <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <p className="text-sm text-brass-light">100 marks</p>
                  <h3 className="mt-1 font-display text-3xl tracking-tight">{papers[active].name}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ivory/70">{papers[active].body}</p>
                </motion.div>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-ivory/45">
                  Six papers × 100 marks each. Choose one to read more.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px]" onMouseLeave={() => setActive(null)}>
          {/* the sun */}
          <div className="absolute top-1/2 left-1/2 grid size-[24%] -translate-1/2 place-items-center rounded-full bg-[radial-gradient(circle,#f2cd82,#a07a3c)] text-center text-forest-950 shadow-[0_0_80px_20px_rgba(213,182,120,0.35)]">
            <div>
              <p className="font-display text-2xl leading-none sm:text-4xl">600</p>
              <p className="text-[10px] tracking-wider uppercase sm:text-xs">marks</p>
            </div>
          </div>

          {rings.map((ring, r) => (
            <div
              key={r}
              // rings are stacked full-size layers, so only the planets themselves take the pointer
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-dashed border-ivory/15 motion-safe:animate-[spin_var(--t)_linear_infinite]"
              style={{ width: `${ring.size}%`, height: `${ring.size}%`, "--t": `${ring.seconds}s`, animationPlayState: paused ? "paused" : "running" } as React.CSSProperties}
            >
              {papers
                .map((paper, i) => ({ paper, i }))
                .filter(({ paper }) => paper.orbit === r)
                .map(({ paper, i }, k) => {
                  const Icon = paper.icon;
                  return (
                    <div key={paper.name} className="absolute inset-0" style={{ rotate: `${k * 180 + r * 40}deg` }}>
                      {/* counter-spin keeps each planet upright while its ring turns */}
                      <div
                        className="absolute top-0 left-1/2 -translate-1/2 motion-safe:animate-[spin_var(--t)_linear_infinite_reverse]"
                        style={{ "--t": `${ring.seconds}s`, animationPlayState: paused ? "paused" : "running" } as React.CSSProperties}
                      >
                        <button
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          onClick={() => setActive(i)}
                          aria-label={paper.name}
                          style={{ rotate: `${-(k * 180 + r * 40)}deg` }}
                          className={cn(
                            "pointer-events-auto grid size-12 place-items-center rounded-full ring-1 transition-all duration-300 sm:size-16",
                            active === i ? "scale-125 bg-brass-light text-forest-950 ring-brass-light shadow-[0_0_30px_rgba(213,182,120,0.7)]" : "bg-forest-800 text-brass-light ring-brass-light/40 hover:bg-forest-700",
                          )}
                        >
                          <Icon className="size-5 sm:size-6" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
