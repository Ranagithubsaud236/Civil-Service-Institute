"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { MapPin, UserRound } from "lucide-react";
import { provinces, type Post } from "@/data/provinces";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const DOTS = 240;
// the map sits in the centre of a 1000 × 640 stage, with post cards in columns either side
const BOX = { x: 330, y: 40, w: 340, h: 560 };
const SLOT_X = { left: 140, right: 860 };
const SLOT_Y = [140, 320, 500];
const CARD_HALF = 132;

const rand = (n: number) => ((Math.sin(n * 12.9898 + 4.1414) * 43758.5453) % 1 + 1) % 1;

function inside(pts: number[][], x: number, y: number) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Fits each outline into the stage and samples the same number of dots inside it, so dots can fly between shapes. */
const shapes = provinces.map((p, pi) => {
  const raw = p.outline.map(([lon, lat]) => [lon * 0.86, -lat]);
  const xs = raw.map((q) => q[0]), ys = raw.map((q) => q[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = Math.min(BOX.w / (maxX - minX), BOX.h / (maxY - minY));
  const ox = BOX.x + (BOX.w - (maxX - minX) * s) / 2, oy = BOX.y + (BOX.h - (maxY - minY) * s) / 2;
  const fit = (lon: number, lat: number) => [+(ox + (lon * 0.86 - minX) * s).toFixed(1), +(oy + (-lat - minY) * s).toFixed(1)];
  const pts = p.outline.map(([lon, lat]) => fit(lon, lat));

  // shrink the grid until enough points land inside, then take an even spread of exactly DOTS
  let step = 18, grid: number[][] = [];
  for (let tries = 0; tries < 30 && grid.length < DOTS; tries++, step *= 0.88) {
    grid = [];
    for (let y = BOX.y; y < BOX.y + BOX.h; y += step) for (let x = BOX.x; x < BOX.x + BOX.w; x += step) if (inside(pts, x, y)) grid.push([x, y]);
  }
  const dots = Array.from({ length: DOTS }, (_, i) => {
    const [x, y] = grid[Math.floor((i * grid.length) / DOTS)];
    return [+(x + (rand(i + pi * 31) - 0.5) * step * 0.5).toFixed(1), +(y + (rand(i * 3 + pi) - 0.5) * step * 0.5).toFixed(1)];
  });

  // leftmost three posts go to the left column, the rest to the right, each sorted top to bottom
  const placed = p.posts.map((post) => ({ post, at: fit(post.lon, post.lat) }));
  const byX = [...placed].sort((a, b) => a.at[0] - b.at[0]);
  const cols = [byX.slice(0, 3), byX.slice(3)].map((c) => c.sort((a, b) => a.at[1] - b.at[1]));
  const slots = cols.flatMap((col, side) => col.map((c, row) => ({ ...c, side: side ? "right" : "left", y: SLOT_Y[row] }) as const));

  return { d: `M${pts.map((q) => q.join(" ")).join("L")}Z`, dots, slots };
});

/** Scroll story: each province draws itself, the dots regroup into its shape and its officers take their posts. */
export function ProvinceStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(provinces.length - 1, Math.max(0, Math.floor(v * provinces.length)))));

  const p = provinces[i];
  const shape = shapes[i];

  const jump = (n: number) => {
    const el = ref.current!;
    const top = el.offsetTop + ((n + 0.5) / provinces.length) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="provinces" data-theme="dark" className="relative bg-forest-900 text-ivory" style={{ height: `${provinces.length * 90 + 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-24 pb-6 lg:pt-28">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_55%,rgba(31,122,92,0.25),transparent_70%)]" />

        <div className="container-page relative flex w-full items-end justify-between gap-6">
          <div className="min-h-[7.5rem] sm:min-h-[8.5rem]">
            <p className="eyebrow text-brass-light">One country · {provinces.length} administrations</p>
            <AnimatePresence mode="wait">
              <motion.div key={p.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease }}>
                <h2 className="mt-3 flex flex-wrap items-baseline gap-x-4 font-display text-4xl tracking-tight sm:text-6xl">
                  {p.name}
                  <span lang="ur" className="font-urdu text-2xl text-brass-light/70 sm:text-3xl">{p.urdu}</span>
                </h2>
                <p className="mt-2 max-w-xl text-sm text-ivory/60 sm:text-base">{p.line}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.dl key={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hidden shrink-0 text-right text-sm lg:block">
              <dt className="text-ivory/45">Capital</dt>
              <dd className="font-display text-2xl">{p.capital}</dd>
              <dt className="mt-3 text-ivory/45">Recruited through</dt>
              <dd className="max-w-56 text-ivory/80">{p.commission}</dd>
            </motion.dl>
          </AnimatePresence>
        </div>

        <div className="container-page relative flex min-h-0 w-full flex-1 flex-col items-center justify-center">
          <div className="relative aspect-[1000/640] w-full max-w-full max-lg:scale-[1.45]" style={{ maxHeight: "100%", width: "min(100%, calc((100svh - 19rem) * 1.5625))" }}>
            <svg viewBox="0 0 1000 640" className="absolute inset-0 size-full" role="img" aria-label={`Illustrated map of ${p.name} with key posts`}>
              {/* dots fly from the previous province into this one */}
              {shape.dots.map(([x, y], k) => (
                <circle
                  key={k}
                  r={2.3}
                  fill="#d5b678"
                  style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform 1.1s cubic-bezier(0.65,0,0.35,1) ${(k % 48) * 9}ms`, opacity: 0.75 }}
                />
              ))}
              <motion.path key={p.name} d={shape.d} fill="rgba(15,74,57,0.35)" stroke="#d5b678" strokeWidth={1.6} strokeLinejoin="round" initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }} transition={{ pathLength: { duration: 1.4, ease: [0.65, 0, 0.35, 1] }, fillOpacity: { duration: 0.8, delay: 0.9 } }} />

              {/* lines from each post card to its place on the map */}
              <AnimatePresence>
                {shape.slots.map((s, k) => {
                  const fromX = s.side === "left" ? SLOT_X.left + CARD_HALF : SLOT_X.right - CARD_HALF;
                  const midX = (fromX + s.at[0]) / 2;
                  return (
                    <motion.g key={`${p.name}-${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="hidden lg:inline">
                      <motion.path d={`M${fromX} ${s.y} C${midX} ${s.y} ${midX} ${s.at[1]} ${s.at[0]} ${s.at[1]}`} fill="none" stroke="#d5b678" strokeOpacity={0.55} strokeWidth={1} strokeDasharray="3 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.8 + k * 0.08, ease }} />
                      <motion.circle cx={s.at[0]} cy={s.at[1]} r={5} fill="#f6f0e3" stroke="#062820" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + k * 0.08, type: "spring", stiffness: 300, damping: 16 }} style={{ transformOrigin: `${s.at[0]}px ${s.at[1]}px` }} />
                    </motion.g>
                  );
                })}
              </AnimatePresence>
            </svg>

            {/* the posts, arranged around the map (desktop) */}
            <AnimatePresence>
              {shape.slots.map((s, k) => (
                <motion.div
                  key={`${p.name}-card-${k}`}
                  initial={{ opacity: 0, x: s.side === "left" ? -24 : 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.55, delay: 0.5 + k * 0.08, ease }}
                  style={{ left: `${(SLOT_X[s.side] / 1000) * 100}%`, top: `${(s.y / 640) * 100}%`, width: `${(CARD_HALF * 2 / 1000) * 100}%` }}
                  className="absolute hidden -translate-x-1/2 -translate-y-1/2 lg:block"
                >
                  <PostCard post={s.post} align={s.side} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* the posts as a compact list (mobile) */}
          <AnimatePresence mode="wait">
            <motion.ul key={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 grid w-full grid-cols-2 gap-2 lg:hidden">
              {p.posts.slice(0, 4).map((post) => (
                <li key={post.title + post.place} className="rounded-xl bg-forest-950/60 px-3 py-2 ring-1 ring-ivory/10">
                  <p className="text-xs leading-tight font-medium">{post.title}</p>
                  <p className="mt-0.5 text-[11px] text-ivory/50">{post.place}</p>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* province rail: shows progress and lets visitors jump */}
        <div className="container-page relative mt-4 w-full">
          <div className="grid grid-cols-6 gap-2">
            {provinces.map((q, n) => (
              <button key={q.name} onClick={() => jump(n)} className="group text-left" aria-label={`Show ${q.name}`} aria-current={n === i}>
                <span className="block h-0.5 overflow-hidden rounded-full bg-ivory/15">
                  <span className={cn("block h-full origin-left bg-brass-light transition-transform duration-500", n <= i ? "scale-x-100" : "scale-x-0")} />
                </span>
                <span className={cn("mt-2 hidden truncate text-xs transition-colors sm:block", n === i ? "text-ivory" : "text-ivory/45 group-hover:text-ivory/75")}>{q.name}</span>
              </button>
            ))}
          </div>
          <motion.div style={{ scaleX: bar }} className="mt-3 h-px origin-left bg-ivory/20 sm:hidden" />
          <p className="mt-3 text-right text-[11px] text-ivory/35">Illustrative outlines, not to scale</p>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, align }: { post: Post; align: "left" | "right" }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl bg-forest-950/70 p-3 ring-1 ring-ivory/10 backdrop-blur", align === "right" && "flex-row-reverse text-right")}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brass-light/15 text-brass-light ring-1 ring-brass-light/30">
        <UserRound className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] leading-tight font-medium">{post.title}</span>
        <span className={cn("mt-1 flex items-center gap-1 text-[11px] text-ivory/55", align === "right" && "justify-end")}>
          <MapPin className="size-3" /> {post.place}
        </span>
      </span>
    </div>
  );
}
