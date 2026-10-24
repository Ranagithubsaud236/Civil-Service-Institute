"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { slides } from "@/data/media";
import { cn } from "@/lib/cn";

const DURATION = 6500;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Full-width carousel of real CSI highlights. Instagram images are only 640px, so each slide
 * shows its image sharp at natural size and reuses a blurred copy to fill the full width.
 */
export function HighlightsSlider() {
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setState(([n]) => [(n + d + slides.length) % slides.length, d]);
  const jump = (n: number) => setState(([cur]) => [n, n > cur ? 1 : -1]);

  // restarts on every change, so a manual move resets the timer
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setState(([n]) => [(n + 1) % slides.length, 1]), DURATION);
    return () => clearTimeout(t);
  }, [i, paused]);

  const s = slides[i];
  const video = s.img.w > s.img.h;

  return (
    <section
      id="highlights"
      aria-roledescription="carousel"
      aria-label="CSI highlights"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate overflow-hidden bg-navy-deep text-white outline-none sm:h-[min(86svh,760px)] sm:min-h-[560px]"
    >
      {/* blurred backdrop from the same image */}
      <AnimatePresence initial={false}>
        <motion.div key={i} initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1.05 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease }} className="absolute inset-0 -z-10">
          <Image src={s.img.src} alt="" fill sizes="100vw" className="object-cover blur-2xl saturate-150" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/40" />

      <div className="container-page grid items-center gap-8 pt-14 pb-24 sm:h-full sm:py-16 lg:grid-cols-[1fr_1.1fr]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={i} className="max-w-lg">
            {[
              <p key="k" className="eyebrow text-gold-light">{s.kicker}</p>,
              <h2 key="t" className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl">{s.title}</h2>,
              <p key="b" className="mt-5 text-lg leading-relaxed text-white/70 text-pretty">{s.body}</p>,
              <a key="a" href={s.href} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-navy-deep transition-colors hover:bg-gold-soft">
                {video ? "Watch on YouTube" : "View on Instagram"} <ArrowUpRight className="size-4" />
              </a>,
            ].map((el, n) => (
              <motion.div key={n} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.55, delay: n * 0.07, ease }}>
                {el}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="relative flex h-[300px] items-center justify-center sm:h-full sm:max-h-[520px]">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={dir}
              initial={{ opacity: 0, x: dir * 120, rotate: dir * 4, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, rotate: video ? 0 : -2, scale: 1 }}
              exit={{ opacity: 0, x: dir * -120, rotate: dir * -4, scale: 0.92 }}
              transition={{ duration: 0.8, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => Math.abs(info.offset.x) > 80 && go(info.offset.x < 0 ? 1 : -1)}
              className={cn("group relative block overflow-hidden rounded-3xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15", video ? "aspect-video w-full max-w-xl" : "h-full max-h-[480px]")}
              style={video ? undefined : { aspectRatio: `${s.img.w} / ${s.img.h}` }}
            >
              <Image src={s.img.src} alt={s.img.alt || s.title} fill sizes="(min-width: 1024px) 40vw, 80vw" className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-105" priority={i === 0} />
              {video && (
                <span className="absolute inset-0 grid place-items-center bg-navy-deep/10 transition-colors group-hover:bg-navy-deep/30">
                  <span className="grid size-16 place-items-center rounded-full bg-white/95 text-navy-deep shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1 size-6 fill-current" />
                  </span>
                </span>
              )}
            </motion.a>
          </AnimatePresence>
        </div>
      </div>

      {/* controls */}
      <div className="absolute inset-x-0 bottom-6">
        <div className="container-page flex items-center justify-between gap-6">
          <div className="flex flex-1 gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((x, n) => (
              <button key={x.title} role="tab" aria-selected={n === i} aria-label={x.title} onClick={() => jump(n)} className="group h-6 max-w-28 flex-1 py-2.5">
                <span className="block h-1 overflow-hidden rounded-full bg-white/20 transition-colors group-hover:bg-white/35">
                  {n === i && (
                    <motion.span
                      key={`${i}-${paused}`}
                      className="block h-full bg-gold-light"
                      initial={{ width: paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                    />
                  )}
                  {n < i && <span className="block h-full bg-white/60" />}
                </span>
              </button>
            ))}
          </div>
          <span className="hidden font-display text-lg tabular-nums text-white/60 sm:block">
            {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <Arrow onClick={() => go(-1)} label="Previous slide"><ChevronLeft className="size-5" /></Arrow>
            <Arrow onClick={() => go(1)} label="Next slide"><ChevronRight className="size-5" /></Arrow>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white hover:text-navy-deep">
      {children}
    </button>
  );
}
