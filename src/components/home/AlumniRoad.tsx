"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { Flag, MessageSquareQuote, Footprints } from "lucide-react";
import { alumniStations } from "@/data/people";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

// The road is one quadratic curve over the hill. Its control point sits at the horizontal middle,
// so x grows linearly with t and every point can be computed without measuring the DOM.
const P0 = { x: 140, y: 672 };
const P1 = { x: 600, y: 440 };
const P2 = { x: 1060, y: 672 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const at = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * t * (1 - t) * P1.x + t ** 2 * P2.x,
  y: (1 - t) ** 2 * P0.y + 2 * t * (1 - t) * P1.y + t ** 2 * P2.y,
});
/** The road walked so far: the first part of the curve, split at t (de Casteljau). */
const trailTo = (t: number) => {
  const end = at(t);
  return `M ${P0.x} ${P0.y} Q ${lerp(P0.x, P1.x, t)} ${lerp(P0.y, P1.y, t)} ${end.x} ${end.y}`;
};

const STOPS = [0.18, 0.4, 0.62, 0.84];
const TREES = [
  { x: 330, base: 588, h: 150, r: 62, d: 0 },
  { x: 450, base: 568, h: 175, r: 70, d: 0.8 },
  { x: 760, base: 570, h: 165, r: 66, d: 0.4 },
  { x: 880, base: 590, h: 140, r: 58, d: 1.2 },
];

/**
 * Illustrated alumni road (inspired by ginekocentar.hr's hill scene): a gold dot walks the dashed road
 * as the page scrolls, raising a flag at each officer or review stop. The stops are empty slots
 * until CSI supplies verified alumni and reviews.
 */
export function AlumniRoad() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t = useTransform(scrollYProgress, [0.06, 0.94], [0, 1], { clamp: true });
  const [active, setActive] = useState(-1);

  useMotionValueEvent(t, "change", (v) => {
    const next = v > 0.97 ? STOPS.length : STOPS.filter((s) => v >= s).length - 1;
    setActive((a) => (a === next ? a : next));
  });

  const dotX = useTransform(t, (v) => at(v).x);
  const dotY = useTransform(t, (v) => at(v).y);
  const trail = useTransform(t, trailTo);
  const sunY = useTransform(t, [0, 1], [0, 70]);
  const moon = useTransform(t, [0.55, 1], [0, 1]);
  const sky = useTransform(t, [0, 1], ["#e6ecf1", "#d2dde7"]);

  return (
    <section ref={ref} id="results" className="relative h-[320vh]">
      <motion.div style={{ backgroundColor: sky }} className="sticky top-0 flex h-svh flex-col overflow-hidden pt-24 lg:pt-28">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">Alumni</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-balance text-ink md:text-5xl">The road from a CSI classroom to allocation.</h2>
          </div>
          <StopCard active={active} />
        </div>

        <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax meet" className="mt-auto block max-h-[62svh] w-[170%] max-w-none self-center sm:w-full" aria-hidden>
          <defs>
            <mask id="crescent">
              <rect x="0" y="0" width="1200" height="700" fill="white" />
              <circle cx="1018" cy="112" r="34" fill="black" />
            </mask>
          </defs>

          <motion.circle cx="600" cy="320" r="270" fill="#f4f6f8" style={{ y: sunY }} />

          <motion.g style={{ opacity: moon }} fill="#d9b877">
            <circle cx="1000" cy="120" r="40" mask="url(#crescent)" />
            <polygon points="1050,96 1054,108 1067,108 1057,116 1061,128 1050,121 1039,128 1043,116 1033,108 1046,108" />
          </motion.g>

          <Cloud x={190} y={300} delay={0} />
          <Cloud x={930} y={360} delay={-9} flip />

          {/* wider than the viewBox so the hills reach the screen edges on wide displays */}
          <path d="M -800 545 Q -300 470 0 540 T 600 525 T 1200 505 T 2000 525 L 2000 760 L -800 760 Z" fill="#c9d6e1" />

          {TREES.map((tr) => (
            <g key={tr.x} className="origin-bottom animate-[sway_6s_ease-in-out_infinite] [transform-box:fill-box]" style={{ animationDelay: `${tr.d}s` }}>
              <circle cx={tr.x} cy={tr.base - tr.h} r={tr.r} fill="#b4c7d6" />
              <line x1={tr.x} y1={tr.base} x2={tr.x - 4} y2={tr.base - tr.h + 10} stroke="#7c8692" strokeWidth="6" strokeLinecap="round" />
              <path d={`M ${tr.x - 2} ${tr.base - tr.h * 0.55} l -28 -26 M ${tr.x - 3} ${tr.base - tr.h * 0.75} l 24 -22`} stroke="#7c8692" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ))}

          <path d="M -60 700 Q 600 380 1260 700 Z" fill="#a7bccd" />

          <path d={trailTo(1)} fill="none" stroke="#f7f8f9" strokeWidth="4" strokeDasharray="14 12" strokeLinecap="round" />
          <motion.path d={trail} fill="none" stroke="#d9b877" strokeWidth="5" strokeLinecap="round" />

          {alumniStations.map((s, i) => {
            const p = at(STOPS[i]);
            return <Stop key={s.label} x={p.x} y={p.y} raised={active >= i} kind={s.kind} />;
          })}

          <Dot x={dotX} y={dotY} />
        </svg>
      </motion.div>
    </section>
  );
}

function Dot({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  return (
    <motion.g style={{ x, y }}>
      <circle r="22" fill="#0b3a68" opacity="0.14" className="animate-ping [animation-duration:2.4s] [transform-box:fill-box] origin-center" />
      <circle r="13" fill="#0b3a68" stroke="#fff" strokeWidth="4" />
    </motion.g>
  );
}

function Stop({ x, y, raised, kind }: { x: number; y: number; raised: boolean; kind: "officer" | "review" }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="6" fill="#fff" />
      <motion.g initial={false} animate={{ scaleY: raised ? 1 : 0, opacity: raised ? 1 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} style={{ originY: 1, transformBox: "fill-box" }}>
        <line x1="0" y1="0" x2="0" y2="-64" stroke="#0f1b2d" strokeWidth="3" />
        {kind === "officer" ? (
          <path d="M 0 -64 L 34 -54 L 0 -44 Z" fill="#a97c2f" />
        ) : (
          <g transform="translate(18 -60)">
            <rect x="-14" y="-14" width="36" height="26" rx="8" fill="#0b3a68" />
            <path d="M -4 12 l -6 9 l 12 -9 Z" fill="#0b3a68" />
          </g>
        )}
      </motion.g>
    </g>
  );
}

function Cloud({ x, y, delay, flip }: { x: number; y: number; delay: number; flip?: boolean }) {
  return (
    <g className="animate-[drift_26s_ease-in-out_infinite]" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y}) ${flip ? "scale(-1 1)" : ""}`} fill="#ffffff" opacity="0.92">
        <circle cx="0" cy="0" r="30" />
        <circle cx="36" cy="-14" r="38" />
        <circle cx="78" cy="-2" r="28" />
        <rect x="-30" y="0" width="136" height="26" rx="13" />
      </g>
    </g>
  );
}

/** The card above the scene: intro, then one empty slot per stop, then the call to action. */
function StopCard({ active }: { active: number }) {
  const stop = active >= 0 && active < alumniStations.length ? alumniStations[active] : null;
  return (
    <div className="relative min-h-44">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease }}
          className={cn("rounded-3xl p-6", stop && !stop.review ? "border-2 border-dashed border-navy/25 bg-white/70 backdrop-blur" : "bg-white/85 ring-1 ring-line backdrop-blur")}
        >
          {active < 0 && (
            <>
              <Footprints className="size-5 text-gold" />
              <p className="mt-3 font-display text-2xl tracking-tight text-ink">Keep scrolling to walk the road.</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">Each flag is an officer who prepared at CSI; each bubble is a student&apos;s own review.</p>
            </>
          )}
          {stop && (
            <>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-navy">
                  {stop.kind === "officer" ? <Flag className="size-4 text-gold" /> : <MessageSquareQuote className="size-4" />}
                  {stop.label}
                </span>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", stop.review ? "bg-tick/10 text-tick" : "bg-gold-soft text-gold")}>
                  {stop.review ? "Real review" : "Slot open"}
                </span>
              </div>
              {stop.review ? (
                <>
                  <p className="mt-3 font-display text-xl leading-snug tracking-tight text-ink">“{stop.review.quote}”</p>
                  <a href={stop.review.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-ink-mute underline-offset-2 hover:text-navy hover:underline">
                    {stop.review.who} · {stop.review.source}
                  </a>
                </>
              ) : (
                <>
                  <p className="mt-3 font-display text-2xl tracking-tight text-ink">
                    {stop.kind === "officer" ? "A CSI officer’s story goes here." : "A real student review goes here."}
                  </p>
                  <p className="mt-2 text-sm text-ink-mute">{stop.hint} — to be supplied by CSI</p>
                </>
              )}
            </>
          )}
          {active >= alumniStations.length && (
            <>
              <p className="font-display text-2xl tracking-tight text-ink">Allocation. The next flag could be yours.</p>
              <Button href="#contact" className="mt-4 h-11">Start with a free orientation</Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
