"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { alumniStations, type Station } from "@/data/people";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

type Stage = { kind: "start" } | { kind: "end" } | Station;
const stages: Stage[] = [{ kind: "start" }, ...alumniStations, { kind: "end" }];
const LAST = stages.length - 1;

/** Degrees the planet turns between two stops. */
const STEP = 24;
/** Sky tint per stop: pale blue and cream from the crest palette. */
const SKY = ["#e7eef5", "#f3efe5", "#e7eef5", "#f3efe5", "#e7eef5", "#f3efe5"];

// trees spread around the planet, leaving room for the markers at each stop
const TREES = Array.from({ length: 40 }, (_, n) => -24 + n * 7.3)
  .filter((a) => a < LAST * STEP + 26 && stages.every((_, i) => Math.abs(a - i * STEP - 3) > 5))
  .map((a, n) => ({ a, size: [1, 0.78, 0.92, 0.7, 0.86][n % 5], lean: [-4, 3, -2, 5, -3][n % 5], delay: (n % 4) * 0.7 }));

/**
 * Alumni scene inspired by ginekocentar.hr: the text sits inside a large sun, and a small planet
 * spins as the page scrolls, carrying trees and stops past a walker who stays at the top.
 */
export function AlumniRoad() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const s = useTransform(scrollYProgress, (v) => Math.min(Math.max(v, 0), 1) * LAST);
  const rotate = useSpring(useTransform(s, (v) => -v * STEP), { stiffness: 60, damping: 20, mass: 0.6 });
  const sky = useTransform(s, SKY.slice(0, stages.length).map((_, i) => i), SKY.slice(0, stages.length));
  const [active, setActive] = useState(0);

  useMotionValueEvent(s, "change", (v) => {
    const next = Math.round(v);
    setActive((a) => (a === next ? a : next));
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / LAST) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section ref={ref} id="results" className="relative" style={{ height: `${stages.length * 75}svh` }}>
      <motion.div style={{ backgroundColor: sky }} className="sticky top-0 h-svh overflow-hidden">
        <Birds />

        {/* the sun, with the stop's text centred inside it */}
        <div className="absolute top-[max(84px,9svh)] left-1/2 aspect-square w-[min(112vw,74svh,640px)] -translate-x-1/2 rounded-full bg-white/55">
          <svg viewBox="0 0 40 40" className="absolute top-[3%] right-[1%] w-[13%] animate-[bob_5s_ease-in-out_infinite]" aria-hidden>
            <defs>
              <mask id="moon-cut">
                <rect width="40" height="40" fill="white" />
                <circle cx="28" cy="14" r="15" fill="black" />
              </mask>
            </defs>
            <circle cx="20" cy="20" r="17" fill="#c9963f" mask="url(#moon-cut)" />
          </svg>

          <div className="absolute inset-x-[13%] top-[15%] bottom-[30%] flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 18, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.5, ease }}>
                <StageText stage={stages[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Cloud className="top-[38svh] left-[8%] animate-[drift_28s_ease-in-out_infinite]" />
        <Cloud className="top-[48svh] right-[6%] scale-x-[-1] animate-[drift_34s_ease-in-out_infinite] [animation-delay:-12s]" small />

        {/* the planet: rotates with scroll, carrying everything placed on its surface */}
        <motion.div style={{ rotate }} className="absolute top-[74svh] left-1/2 aspect-square w-[max(2000px,240vw)] -translate-x-1/2 rounded-full bg-navy/[0.14]">
          <div className="absolute inset-[28px] rounded-full border-[3px] border-dashed border-white/70" />
          {TREES.map((t) => (
            <OnSurface key={t.a} angle={t.a}>
              <Tree size={t.size} lean={t.lean} delay={t.delay} />
            </OnSurface>
          ))}
          {stages.map((st, i) => (
            <OnSurface key={i} angle={i * STEP + 3} sink={30}>
              <Marker kind={st.kind} live={i === active} />
            </OnSurface>
          ))}
        </motion.div>

        {/* the walker stays at the top of the planet while the world turns */}
        <span className="absolute top-[calc(74svh+19px)] left-1/2 block size-5 -translate-x-1/2 rounded-full bg-navy ring-4 ring-white">
          <span className="absolute inset-0 animate-ping rounded-full bg-navy/40 [animation-duration:2.2s]" />
        </span>

        <nav aria-label="Alumni stops" className="absolute top-1/2 right-8 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {stages.map((st, i) => (
            <button key={i} onClick={() => jump(i)} aria-label={`Go to stop ${i + 1}`} className="group grid size-5 place-items-center">
              <span className={cn("block rounded-full transition-all duration-300", i === active ? "size-3 bg-navy" : "size-2 bg-navy/25 group-hover:bg-navy/50")} />
            </button>
          ))}
        </nav>
      </motion.div>
    </section>
  );
}

function StageText({ stage }: { stage: Stage }) {
  if (stage.kind === "start")
    return (
      <>
        <p className="eyebrow justify-center text-gold">Alumni</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,4.4svh,3rem)] leading-[1.08] tracking-tight text-balance text-ink">The road from a CSI classroom to allocation.</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft sm:text-base">Scroll to walk it. Flags are officers, bubbles are student reviews.</p>
      </>
    );
  if (stage.kind === "end")
    return (
      <>
        <p className="eyebrow justify-center text-gold">Allocation</p>
        <h2 className="mt-3 font-display text-[clamp(1.7rem,4.4svh,3rem)] leading-[1.08] tracking-tight text-balance text-ink">The next flag could be yours.</h2>
        <Button href="#contact" className="mt-5 h-11">Start with a free orientation</Button>
      </>
    );
  if (stage.star)
    return (
      <>
        <span className="relative mx-auto block size-[clamp(84px,14svh,132px)] overflow-hidden rounded-full ring-4 ring-gold-light ring-offset-4 ring-offset-white/60">
          <Image src={stage.star.photo} alt={stage.star.name} fill sizes="132px" className="scale-110 object-cover" />
        </span>
        <p className="mt-4 text-sm font-medium text-gold">{stage.label}</p>
        <p className="mt-1 font-display text-[clamp(1.6rem,4svh,2.6rem)] leading-[1.05] tracking-tight text-ink">{stage.star.name}</p>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          {stage.star.result} · <span className="font-medium text-navy">{stage.star.service}</span>
        </p>
      </>
    );
  if (stage.review)
    return (
      <>
        <p className="text-sm font-medium text-tick">{stage.label} · Real review</p>
        <p className="mt-3 font-display text-[clamp(1.05rem,2.5svh,1.6rem)] leading-snug tracking-tight text-ink">“{stage.review.quote}”</p>
        <a href={stage.review.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-ink-mute underline-offset-2 hover:text-navy hover:underline sm:text-sm">
          {stage.review.who} · {stage.review.source}
        </a>
      </>
    );
  return (
    <>
      <p className="text-sm font-medium text-gold">{stage.label} · Slot open</p>
      <p className="mt-3 font-display text-[clamp(1.5rem,3.6svh,2.4rem)] leading-[1.1] tracking-tight text-balance text-ink">
        {stage.kind === "officer" ? "A CSI officer’s story goes here." : "A real student review goes here."}
      </p>
      <p className="mt-3 text-sm text-ink-mute">{stage.hint} — to be supplied by CSI</p>
    </>
  );
}

/** Places a child standing on the planet's rim at the given angle (0° = top). */
function OnSurface({ angle, sink = 6, children }: { angle: number; sink?: number; children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
      <div className="absolute top-0 left-1/2" style={{ transform: `translate(-50%, calc(-100% + ${sink}px))` }}>
        {children}
      </div>
    </div>
  );
}

function Tree({ size, lean, delay }: { size: number; lean: number; delay: number }) {
  return (
    <svg viewBox="0 0 160 280" className="block h-[clamp(120px,26svh,250px)] w-auto origin-bottom animate-[sway_6s_ease-in-out_infinite]" style={{ scale: size, animationDelay: `${delay}s` }} aria-hidden>
      <circle cx="80" cy="82" r="72" fill="#0b4f8c" opacity="0.16" />
      <g stroke="#7c8692" strokeLinecap="round" transform={`rotate(${lean} 80 280)`}>
        <line x1="80" y1="280" x2="84" y2="44" strokeWidth="8" />
        <path d="M 82 150 L 46 116 M 83 112 L 116 82 M 82 132 L 58 120 M 84 92 L 104 70" strokeWidth="5" />
      </g>
    </svg>
  );
}

function Marker({ kind, live }: { kind: Stage["kind"]; live: boolean }) {
  return (
    <motion.div animate={{ y: live ? -10 : 0, scale: live ? 1.08 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="origin-bottom">
      <svg viewBox="0 0 70 120" className="block h-[clamp(70px,13svh,120px)] w-auto" aria-hidden>
        <line x1="10" y1="120" x2="10" y2="14" stroke="#0f1b2d" strokeWidth="4" strokeLinecap="round" />
        {kind === "review" ? (
          <g fill="#0b4f8c">
            <rect x="14" y="8" width="52" height="36" rx="12" />
            <path d="M 24 42 l -6 14 l 18 -14 Z" />
            <circle cx="30" cy="26" r="3.5" fill="#fff" /><circle cx="40" cy="26" r="3.5" fill="#fff" /><circle cx="50" cy="26" r="3.5" fill="#fff" />
          </g>
        ) : kind === "end" ? (
          <g>
            <rect x="10" y="12" width="54" height="36" fill="#01411c" />
            <rect x="10" y="12" width="14" height="36" fill="#fff" />
            <circle cx="44" cy="30" r="10" fill="#fff" />
            <circle cx="47.5" cy="27.5" r="9" fill="#01411c" />
          </g>
        ) : kind === "start" ? (
          <g>
            <rect x="12" y="16" width="52" height="22" rx="4" fill="#a8772a" />
            <path d="M 64 16 l 6 11 l -6 11 Z" fill="#a8772a" />
          </g>
        ) : (
          <path d="M 10 12 L 62 28 L 10 44 Z" fill="#a8772a" />
        )}
      </svg>
    </motion.div>
  );
}

function Cloud({ className, small }: { className?: string; small?: boolean }) {
  return (
    <svg viewBox="0 0 140 60" className={cn("absolute hidden w-[clamp(90px,11vw,170px)] sm:block", small && "w-[clamp(70px,8vw,130px)]", className)} aria-hidden>
      <g fill="#fff" opacity="0.92">
        <circle cx="34" cy="34" r="22" />
        <circle cx="66" cy="24" r="24" />
        <circle cx="98" cy="34" r="20" />
        <rect x="12" y="34" width="110" height="24" rx="12" />
      </g>
    </svg>
  );
}

/** A small flock crossing the sky; each bird flaps on its own beat. */
function Birds() {
  const flock = [
    { x: 0, y: 0, s: 1, d: 0 },
    { x: 46, y: 18, s: 0.8, d: 0.3 },
    { x: 86, y: 6, s: 0.9, d: 0.15 },
    { x: 26, y: 42, s: 0.65, d: 0.45 },
    { x: 120, y: 34, s: 0.7, d: 0.6 },
    { x: 70, y: 56, s: 0.55, d: 0.25 },
  ];
  return (
    <div className="pointer-events-none absolute top-[16svh] left-0 w-40 animate-[fly_32s_linear_infinite]" aria-hidden>
      {flock.map((b, i) => (
        <svg key={i} viewBox="0 0 40 20" className="absolute w-10 origin-center animate-[flap_0.9s_ease-in-out_infinite]" style={{ left: b.x, top: b.y, scale: b.s, animationDelay: `${b.d}s` }}>
          <path d="M 2 4 Q 12 14 20 12 Q 28 14 38 4" fill="none" stroke="#8a8f99" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}
