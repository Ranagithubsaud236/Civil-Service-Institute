"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { stories } from "@/data/nation";
import { cn } from "@/lib/cn";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;
const DURATION = 8000;
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("");

/** Documentary-style success stories: a large portrait frame, a first-person quote, slow crossfades. */
export function Stories() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const s = stories[i];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((n) => (n + 1) % stories.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused]);

  return (
    <section id="stories" data-theme="light" className="bg-ivory-200 py-24 lg:py-32">
      <div className="container-page">
        <Heading eyebrow="Success stories" title="Journeys that ended at the commission — and began in the field." />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-navy-900">
              {/* portrait frame — a monogram stands in until the client supplies photographs */}
              <Parallax offset={{ base: 16, lg: 36 }} className="absolute -inset-10">
                <div className="size-full bg-[radial-gradient(ellipse_at_30%_20%,rgba(206,151,68,0.28),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgba(2,77,132,0.9),transparent_60%)]" />
              </Parallax>
              <AnimatePresence mode="wait">
                <motion.div key={s.name} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-[9rem] leading-none text-ivory/85 italic sm:text-[11rem]">{initials(s.name)}</span>
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent p-7 pt-20 text-ivory">
                <AnimatePresence mode="wait">
                  <motion.div key={s.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
                    <p className="text-sm text-gold-light">{s.role}</p>
                    <p className="mt-1 text-xs text-ivory/60">{s.year} · from {s.place}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <div>
            <div className="min-h-[16rem]">
              <AnimatePresence mode="wait">
                <motion.figure key={s.name} initial={{ opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.55, ease }}>
                  <span className="font-display text-7xl leading-none text-gold">“</span>
                  <blockquote className="-mt-4 font-display text-3xl leading-snug tracking-tight text-ink text-pretty md:text-[2.4rem]">{s.quote}</blockquote>
                  <figcaption className="mt-8 text-ink-soft">
                    <span className="font-medium text-ink">{s.name}</span> — {s.role}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4" role="tablist" aria-label="Stories">
              {stories.map((x, n) => (
                <button key={x.name} role="tab" aria-selected={n === i} onClick={() => setI(n)} className="group py-2 text-left">
                  <span className="block h-0.5 overflow-hidden rounded-full bg-ink/10">
                    {n === i && (
                      <motion.span key={`${i}-${paused}`} className="block h-full bg-navy-800" initial={{ width: paused ? "100%" : "0%" }} animate={{ width: "100%" }} transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }} />
                    )}
                  </span>
                  <span className={cn("mt-2 block truncate text-xs transition-colors", n === i ? "text-ink" : "text-ink-mute group-hover:text-ink-soft")}>{x.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
