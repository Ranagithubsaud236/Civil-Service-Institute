"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { Sparkles } from "lucide-react";
import { constellation } from "@/data/nation";
import { cn } from "@/lib/cn";
import { useFinePointer } from "@/lib/useFinePointer";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;
const you = { x: 500, y: 320 };

// deterministic star field (rounded so server and client markup match)
const stars = Array.from({ length: 90 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: +(r(1) * 1000).toFixed(1), y: +(r(2) * 640).toFixed(1), s: +(0.6 + r(3) * 1.4).toFixed(2), d: +(r(4) * 4).toFixed(2) };
});

/** Children spread on an arc around their hub, pointing away from "you". */
function routePoints(hub: (typeof constellation)[number]) {
  const base = Math.atan2(hub.y - you.y, hub.x - you.x);
  const n = hub.routes.length;
  return hub.routes.map((label, i) => {
    const a = base + (i - (n - 1) / 2) * 0.62;
    // alternate near/far so neighbouring labels don't collide
    const r = i % 2 ? 1.3 : 1;
    return { label, x: +(hub.x + Math.cos(a) * 150 * r).toFixed(1), y: +(hub.y + Math.sin(a) * 115 * r).toFixed(1) };
  });
}

/** "Where will you serve?" — career routes as glowing nodes in a slowly drifting sky. */
export function Constellation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const fine = useFinePointer();
  const [active, setActive] = useState(0);
  const hub = constellation[active];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const skyX = useSpring(useTransform(mx, [-0.5, 0.5], [18, -18]), { stiffness: 60, damping: 20 });
  const skyY = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 60, damping: 20 });
  const netX = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 60, damping: 20 });
  const netY = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), { stiffness: 60, damping: 20 });

  return (
    <section id="constellation" data-theme="dark" className="relative isolate overflow-hidden bg-forest-950 py-24 text-ivory lg:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_65%_45%,rgba(31,122,92,0.28),transparent_70%)]" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.85fr_1.4fr] lg:gap-10">
        <div>
          <Heading dark eyebrow="Explore your future" title="Where will you serve?" intro="Choose a pathway to see where it can lead. Each route is a different way to serve Pakistan." />

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Pathways">
            {constellation.map((h, i) => (
              <button
                key={h.key}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn("h-10 rounded-full px-4 text-sm ring-1 transition-all duration-200", active === i ? "bg-brass-light text-forest-950 ring-brass-light" : "text-ivory/70 ring-ivory/15 hover:text-ivory hover:ring-ivory/40")}
              >
                {h.key}
              </button>
            ))}
          </div>

          <div className="mt-8 min-h-56">
            <AnimatePresence mode="wait">
              <motion.div key={hub.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
                <h3 className="font-display text-3xl tracking-tight">{hub.title}</h3>
                <p className="mt-3 leading-relaxed text-ivory/65">{hub.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {hub.routes.map((r, i) => (
                    <motion.li key={r} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05, ease }} className="rounded-full bg-ivory/[0.06] px-3 py-1.5 text-xs text-ivory/80 ring-1 ring-ivory/10">
                      {r}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ivory/40">
            <Sparkles className="mt-0.5 size-3.5 shrink-0" />
            An interactive design preview of career routes, not a live map of official recruitment systems.
          </p>
        </div>

        <div
          ref={ref}
          className="relative -mx-5 sm:mx-0"
          onPointerMove={
            fine
              ? (e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  mx.set((e.clientX - r.left) / r.width - 0.5);
                  my.set((e.clientY - r.top) / r.height - 0.5);
                }
              : undefined
          }
          onPointerLeave={() => (mx.set(0), my.set(0))}
        >
          <svg viewBox="0 0 1000 640" className="h-auto w-full" role="img" aria-label="Constellation of civil service career pathways">
            <defs>
              <radialGradient id="glow">
                <stop offset="0%" stopColor="#d5b678" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#d5b678" stopOpacity="0" />
              </radialGradient>
            </defs>

            <motion.g style={{ x: skyX, y: skyY }}>
              {stars.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.s} className="animate-pulse fill-ivory/50" style={{ animationDelay: `${s.d}s`, animationDuration: `${3 + s.d}s` }} />
              ))}
            </motion.g>

            <motion.g style={{ x: netX, y: netY }}>
              {/* you → every hub */}
              {constellation.map((h, i) => (
                <motion.line
                  key={h.key}
                  x1={you.x}
                  y1={you.y}
                  x2={h.x}
                  y2={h.y}
                  stroke="#d5b678"
                  strokeWidth={active === i ? 1.6 : 0.8}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: active === i ? 0.9 : 0.3 } : {}}
                  transition={{ pathLength: { duration: 1.2, delay: 0.3 + i * 0.15, ease }, opacity: { duration: 0.4 } }}
                />
              ))}

              {/* routes of the active hub */}
              <AnimatePresence>
                {inView &&
                  routePoints(hub).map((p, i) => (
                    <motion.g key={`${hub.key}-${p.label}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                      <motion.line x1={hub.x} y1={hub.y} x2={p.x} y2={p.y} stroke="#d5b678" strokeOpacity={0.45} strokeWidth={1} strokeDasharray="3 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease }} />
                      <motion.circle cx={p.x} cy={p.y} r={5} fill="#f6f0e3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.45 + i * 0.06, type: "spring", stiffness: 300, damping: 16 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                      <motion.text
                        x={p.x}
                        y={p.y + (p.y > hub.y ? 30 : -18)}
                        textAnchor="middle"
                        className="hidden fill-ivory/75 font-sans text-[17px] sm:block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 + i * 0.06 }}
                      >
                        {p.label}
                      </motion.text>
                    </motion.g>
                  ))}
              </AnimatePresence>

              {/* hubs */}
              {constellation.map((h, i) => {
                const on = active === i;
                return (
                  <motion.g
                    key={h.key}
                    role="button"
                    tabIndex={0}
                    aria-label={`Explore ${h.title}`}
                    aria-pressed={on}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => fine && setActive(i)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(i)}
                    className="cursor-pointer outline-none"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.9 + i * 0.15, type: "spring", stiffness: 180, damping: 16 }}
                    style={{ transformOrigin: `${h.x}px ${h.y}px` }}
                  >
                    <circle cx={h.x} cy={h.y} r={on ? 80 : 54} fill="url(#glow)" className="transition-all duration-500" />
                    <circle cx={h.x} cy={h.y} r={on ? 15 : 11} fill={on ? "#d5b678" : "#0f4a39"} stroke="#d5b678" strokeWidth={1.5} className="transition-all duration-300" />
                    <text x={h.x} y={h.y - 30} textAnchor="middle" className={cn("font-display text-[30px] transition-all duration-300", on ? "fill-brass-light" : "fill-ivory/80")}>
                      {h.key}
                    </text>
                  </motion.g>
                );
              })}

              {/* you */}
              <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, ease }} style={{ transformOrigin: `${you.x}px ${you.y}px` }}>
                <circle cx={you.x} cy={you.y} r={60} fill="url(#glow)" />
                <motion.circle cx={you.x} cy={you.y} r={26} fill="none" stroke="#d5b678" strokeOpacity={0.5} animate={{ r: [26, 44], opacity: [0.8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />
                <circle cx={you.x} cy={you.y} r={24} fill="#f6f0e3" />
                <text x={you.x} y={you.y + 6} textAnchor="middle" className="fill-forest-950 font-sans text-[16px] font-semibold">
                  You
                </text>
              </motion.g>
            </motion.g>
          </svg>
        </div>
      </div>
    </section>
  );
}
