"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cities, pakistanOutline } from "@/data/nation";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";
import { Contours } from "./Contours";

const ease = [0.22, 1, 0.36, 1] as const;

// simple equirectangular projection into a 560 × 520 viewBox
const px = (lon: number) => +((lon - 60.5) * 31).toFixed(1);
const py = (lat: number) => +((37.6 - lat) * 36).toFixed(1);
const outline = `M${pakistanOutline.map(([lon, lat]) => `${px(lon)} ${py(lat)}`).join("L")}Z`;
const capital = cities[0];

/** Ray-casting test for whether a point sits inside the projected outline. */
const ring = pakistanOutline.map(([lon, lat]) => [px(lon), py(lat)]);
function inside(x: number, y: number) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
const rand = (n: number) => ((Math.sin(n * 12.9898) * 43758.5453) % 1 + 1) % 1;
// the dots that gather into the map: a grid clipped to the outline, each with a scattered start
const dots: { x: number; y: number; dx: number; dy: number; d: number }[] = [];
for (let y = 6; y < 520; y += 15) {
  for (let x = (y / 15) % 2 ? 6 : 13.5; x < 560; x += 15) {
    if (!inside(x, y)) continue;
    const k = dots.length;
    dots.push({ x, y, dx: Math.round((rand(k + 1) - 0.5) * 520), dy: Math.round((rand(k + 7) - 0.5) * 420), d: +(rand(k + 3) * 0.6).toFixed(2) });
  }
}

function arc(to: (typeof cities)[number]) {
  const x1 = px(capital.lon), y1 = py(capital.lat), x2 = px(to.lon), y2 = py(to.lat);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.18;
  return `M${x1} ${y1} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2} ${y2}`;
}

/** Scene 02 — The nation connects: the map draws, cities light up, each reveals an institution and a path. */
export function NationMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const city = cities[active];

  // cycles through cities until the visitor picks one
  useEffect(() => {
    if (!inView || !auto) return;
    const t = setTimeout(() => setActive((n) => (n + 1) % cities.length), 4200);
    return () => clearTimeout(t);
  }, [inView, auto, active]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section id="map" data-theme="dark" className="relative isolate overflow-hidden bg-forest-900 py-24 text-ivory lg:py-32">
      <div className="absolute inset-0 -z-10 text-brass-light/10">
        {inView && <Contours cx={300} cy={450} count={9} className="absolute inset-0 size-full" />}
      </div>

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <Heading
            dark
            eyebrow="Scene 02 · The nation connects"
            title="Every city holds a calling."
            intro="Institutions, commissions and careers span the whole country. Select a city to see where service happens."
          />

          <div className="mt-10 min-h-80 rounded-3xl bg-forest-950/50 p-7 ring-1 ring-ivory/10 backdrop-blur sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={city.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl tracking-tight">{city.name}</h3>
                  <span className="text-xs tabular-nums text-ivory/45">{String(active + 1).padStart(2, "0")} / {cities.length}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-brass-light">{city.institution}</p>
                <p className="mt-4 leading-relaxed text-ivory/70">{city.topic}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-xs text-ivory/80">
                  <ArrowUpRight className="size-3.5 text-brass-light" /> {city.path}
                </p>
                <p className="mt-5 text-[11px] tracking-[0.16em] text-ivory/40 uppercase">Related governance topics</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {city.topics.map((t, i) => (
                    <motion.li key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, ease }} className="rounded-full bg-ivory/[0.06] px-3 py-1.5 text-xs text-ivory/80 ring-1 ring-ivory/10">
                      {t}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            {auto && (
              <div className="mt-6 h-px overflow-hidden bg-ivory/10">
                <motion.div key={active} className="h-full bg-brass-light/70" initial={{ width: "0%" }} animate={{ width: inView ? "100%" : "0%" }} transition={{ duration: 4.2, ease: "linear" }} />
              </div>
            )}
          </div>

          {/* city chips: an easy tap target list on small screens */}
          <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
            {cities.map((c, i) => (
              <button key={c.name} onClick={() => pick(i)} className={cn("rounded-full px-3.5 py-1.5 text-xs ring-1 transition-colors", i === active ? "bg-brass-light text-forest-950 ring-brass-light" : "text-ivory/70 ring-ivory/15 hover:ring-ivory/40")}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div ref={ref} className="relative">
          <svg viewBox="0 0 560 520" className="h-auto w-full" role="img" aria-label="Illustrated map of Pakistan with highlighted cities">
            <defs>
              <radialGradient id="land" cx="55%" cy="45%" r="70%">
                <stop offset="0%" stopColor="#0f4a39" />
                <stop offset="100%" stopColor="#062820" />
              </radialGradient>
            </defs>
            {/* scattered points drift in and settle into the shape of the country */}
            <g>
              {dots.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={1.6}
                  fill="#d5b678"
                  style={{
                    opacity: inView ? 0.55 : 0,
                    transform: inView ? "translate(0px, 0px)" : `translate(${p.dx}px, ${p.dy}px)`,
                    transition: `transform 1.6s cubic-bezier(0.22,1,0.36,1) ${p.d}s, opacity 0.8s ease ${p.d}s`,
                  }}
                />
              ))}
            </g>
            <motion.path
              d={outline}
              fill="url(#land)"
              stroke="#d5b678"
              strokeWidth={1.4}
              strokeLinejoin="round"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={inView ? { pathLength: 1, fillOpacity: 0.5 } : {}}
              transition={{ pathLength: { duration: 2.4, delay: 0.8, ease: [0.65, 0, 0.35, 1] }, fillOpacity: { duration: 1, delay: 2.2 } }}
            />

            {cities.slice(1).map((c, i) => (
              <motion.path
                key={c.name}
                d={arc(c)}
                fill="none"
                stroke="#d5b678"
                strokeWidth={1}
                strokeDasharray="3 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: active === i + 1 ? 0.9 : 0.25 } : {}}
                transition={{ pathLength: { duration: 1.2, delay: 2.2 + i * 0.12 }, opacity: { duration: 0.4 } }}
              />
            ))}

            {cities.map((c, i) => {
              const x = px(c.lon), y = py(c.lat), on = i === active, left = c.label === "left";
              return (
                <motion.g
                  key={c.name}
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.name}: ${c.institution}`}
                  aria-pressed={on}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(i)}
                  className="cursor-pointer outline-none"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.8 + i * 0.16, duration: 0.5, ease }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  <circle cx={x} cy={y} r={16} fill="transparent" />
                  {on && (
                    <motion.circle cx={x} cy={y} r={6} fill="none" stroke="#d5b678" strokeWidth={1} initial={{ r: 6, opacity: 0.9 }} animate={{ r: 22, opacity: 0 }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }} />
                  )}
                  <circle cx={x} cy={y} r={on ? 6 : 4} className="transition-all duration-300" fill={on ? "#d5b678" : "#f6f0e3"} stroke="#062820" strokeWidth={2} />
                  <text
                    x={left ? x - 11 : x + 11}
                    y={y + 4}
                    textAnchor={left ? "end" : "start"}
                    className={cn("font-sans text-[11px] transition-all duration-300 select-none", on ? "fill-brass-light font-semibold" : "fill-ivory/60")}
                  >
                    {c.name}
                  </text>
                </motion.g>
              );
            })}
          </svg>
          <p className="mt-2 text-right text-[11px] text-ivory/35">Illustrative map, not to scale</p>
        </div>
      </div>
    </section>
  );
}
