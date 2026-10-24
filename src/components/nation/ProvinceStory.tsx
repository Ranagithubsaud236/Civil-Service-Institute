"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { MapPin, UserRound } from "lucide-react";
import { provinces, type Post } from "@/data/provinces";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const N = provinces.length;
const DOTS = 240;
const RING = 140; // every outline is resampled to the same number of points so one can morph into the next
// the map sits in the centre of a 1000 × 640 stage, with post cards in columns either side
const BOX = { x: 330, y: 40, w: 340, h: 560 };
const SLOT_X = { left: 140, right: 860 };
const SLOT_Y = [140, 320, 500];
const CARD_HALF = 132;
// each province holds still for the first part of its scroll segment, then morphs into the next
const HOLD = 0.5;
// N − 1 morphs plus a final hold, so the last province gets its moment too
const SPAN = N - 1 + HOLD;
// a slightly different blue behind each province
const tints = ["#023b6b", "#033a63", "#0a3560", "#14304f", "#06406e", "#0b3d66"];

const rand = (n: number) => ((Math.sin(n * 12.9898 + 4.1414) * 43758.5453) % 1 + 1) % 1;
const smooth = (t: number) => t * t * (3 - 2 * t);

function inside(pts: number[][], x: number, y: number) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Evenly spaced points along a closed outline, clockwise, starting from its top-most point. */
function resample(pts: number[][], count: number) {
  const area = pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0);
  const ring = area < 0 ? [...pts].reverse() : pts;
  const top = ring.reduce((best, p, i) => (p[1] < ring[best][1] ? i : best), 0);
  const ordered = [...ring.slice(top), ...ring.slice(0, top)];
  const segs = ordered.map((p, i) => { const q = ordered[(i + 1) % ordered.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); });
  const total = segs.reduce((a, b) => a + b, 0);
  const out: number[][] = [];
  let seg = 0, acc = 0;
  for (let k = 0; k < count; k++) {
    const target = (k / count) * total;
    while (acc + segs[seg] < target) acc += segs[seg++];
    const t = (target - acc) / segs[seg];
    const a = ordered[seg], b = ordered[(seg + 1) % ordered.length];
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

/** Fits each outline into the stage, then samples its ring and its dots so shapes can blend into each other. */
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
    return [x + (rand(i + pi * 31) - 0.5) * step * 0.5, y + (rand(i * 3 + pi) - 0.5) * step * 0.5];
  });

  // leftmost three posts go to the left column, the rest to the right, each sorted top to bottom
  const placed = p.posts.map((post) => ({ post, at: fit(post.lon, post.lat) }));
  const byX = [...placed].sort((a, b) => a.at[0] - b.at[0]);
  const cols = [byX.slice(0, 3), byX.slice(3)].map((c) => c.sort((a, b) => a.at[1] - b.at[1]));
  const slots = cols.flatMap((col, side) => col.map((c, row) => ({ ...c, side: side ? "right" : "left", y: SLOT_Y[row] }) as const));

  return { ring: resample(pts, RING), dots, slots };
});

// the swirl each dot follows while travelling between shapes
const swirl = Array.from({ length: DOTS }, (_, k) => [(rand(k * 7 + 1) - 0.5) * 140, (rand(k * 11 + 5) - 0.5) * 140]);

const toPath = (pts: number[][]) => `M${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("L")}Z`;

// the whole country at small scale, for the corner overview map
const mini = (() => {
  const all = provinces.flatMap((p) => p.outline);
  const xs = all.map(([lon]) => lon * 0.86), ys = all.map(([, lat]) => -lat);
  const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
  const s = Math.min(150 / (Math.max(...xs) - minX), 150 / (Math.max(...ys) - minY));
  return provinces.map((p) => `M${p.outline.map(([lon, lat]) => `${((lon * 0.86 - minX) * s + 5).toFixed(1)} ${((-lat - minY) * s + 5).toFixed(1)}`).join("L")}Z`);
})();

/**
 * Scroll story through the six administrations. Each province holds for a moment, then its outline
 * morphs into the next one while the dots swirl and regroup — all scrubbed by the scroll, so it can
 * be played forwards or backwards. The officers' posts step aside during the morph and return.
 */
export function ProvinceStory() {
  const ref = useRef<HTMLElement>(null);
  const outline = useRef<SVGPathElement>(null);
  const dotEls = useRef<(SVGCircleElement | null)[]>([]);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.35 });
  const postsVisible = useMotionValue(1);
  const bg = useTransform(p, provinces.map((_, k) => k / SPAN), tints);
  const [i, setI] = useState(0);

  // turn the smoothed progress into "which province" and "how far into the morph"
  const draw = (v: number) => {
    const s = Math.min(Math.max(v, 0) * SPAN, N - 1);
    const base = Math.min(Math.floor(s), N - 1);
    const f = base === N - 1 ? 0 : s - base;
    const m = reduce ? (f > HOLD ? 1 : 0) : smooth(Math.min(1, Math.max(0, (f - HOLD) / (1 - HOLD))));
    const a = shapes[base], b = shapes[Math.min(base + 1, N - 1)];
    const lift = Math.sin(Math.PI * m); // 0 at rest, 1 mid-morph

    outline.current?.setAttribute("d", toPath(a.ring.map((q, k) => [q[0] + (b.ring[k][0] - q[0]) * m, q[1] + (b.ring[k][1] - q[1]) * m])));
    dotEls.current.forEach((el, k) => {
      if (!el) return;
      // each dot leaves a little after its neighbour, so the regrouping ripples across the map
      const local = reduce ? m : smooth(Math.min(1, Math.max(0, m * 1.25 - (k / DOTS) * 0.25)));
      const x = a.dots[k][0] + (b.dots[k][0] - a.dots[k][0]) * local + swirl[k][0] * Math.sin(Math.PI * local);
      const y = a.dots[k][1] + (b.dots[k][1] - a.dots[k][1]) * local + swirl[k][1] * Math.sin(Math.PI * local);
      el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    });
    postsVisible.set(1 - Math.min(1, lift * 1.8));
    setI(m > 0.5 ? Math.min(base + 1, N - 1) : base);
  };
  // the first frame is already drawn at Punjab by the markup below; every scroll redraws from here
  useMotionValueEvent(p, "change", draw);

  const prov = provinces[i];
  const shape = shapes[i];

  const jump = (n: number) => {
    const el = ref.current!;
    // land in the middle of that province's hold
    const top = el.offsetTop + ((n + HOLD * 0.5) / SPAN) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="provinces" data-theme="dark" className="relative text-ivory" style={{ height: `${N * 100 + 60}vh` }}>
      <motion.div style={{ backgroundColor: bg }} className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-24 pb-6 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_55%,rgba(42,111,176,0.28),transparent_70%)]" />

        <div className="container-page relative flex w-full items-end justify-between gap-6">
          <div className="min-h-[7.5rem] sm:min-h-[8.5rem]">
            <p className="eyebrow text-gold-light">One country · {N} administrations</p>
            <div className="relative mt-3 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={prov.name} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.55, ease }}>
                  <h2 className="flex flex-wrap items-baseline gap-x-4 font-display text-4xl tracking-tight sm:text-6xl">
                    {prov.name}
                    <span lang="ur" className="font-urdu text-2xl text-gold-light/70 sm:text-3xl">{prov.urdu}</span>
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-ivory/60 sm:text-base">{prov.line}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden shrink-0 items-start gap-6 lg:flex">
            <AnimatePresence mode="wait">
              <motion.dl key={prov.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="text-right text-sm">
                <dt className="text-ivory/45">Capital</dt>
                <dd className="font-display text-2xl">{prov.capital}</dd>
                <dt className="mt-3 text-ivory/45">Recruited through</dt>
                <dd className="max-w-52 text-ivory/80">{prov.commission}</dd>
              </motion.dl>
            </AnimatePresence>
            {/* where we are in the country */}
            <div className="relative">
              <svg viewBox="0 0 160 160" className="size-32" aria-hidden>
                {mini.map((d, k) => (
                  <path key={k} d={d} className="transition-[fill,stroke] duration-500" fill={k === i ? "#ce9744" : "rgba(245,246,248,0.06)"} stroke={k === i ? "#ce9744" : "rgba(245,246,248,0.25)"} strokeWidth={0.8} strokeLinejoin="round" />
                ))}
              </svg>
              <p className="mt-1 text-center font-display text-sm tabular-nums text-ivory/60">
                <span className="text-gold-light">{String(i + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="container-page relative flex min-h-0 w-full flex-1 flex-col items-center justify-center">
          <div className="relative aspect-[1000/640] w-full max-w-full max-lg:scale-[1.45]" style={{ maxHeight: "100%", width: "min(100%, calc((100svh - 19rem) * 1.5625))" }}>
            <svg viewBox="0 0 1000 640" className="absolute inset-0 size-full" role="img" aria-label={`Illustrated map of ${prov.name} with key posts`}>
              {/* the dots, positioned every frame from the scroll */}
              {shapes[0].dots.map(([x, y], k) => (
                <circle key={k} ref={(el) => { dotEls.current[k] = el; }} r={2.3} fill="#ce9744" opacity={0.78} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} />
              ))}
              <path ref={outline} d={toPath(shapes[0].ring)} fill="rgba(2,77,132,0.35)" stroke="#ce9744" strokeWidth={1.6} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(206,151,68,0.35))" }} />

              {/* lines from each post card to its place on the map */}
              <motion.g style={{ opacity: postsVisible }} className="hidden lg:inline">
                <AnimatePresence>
                  {shape.slots.map((s, k) => {
                    const fromX = s.side === "left" ? SLOT_X.left + CARD_HALF : SLOT_X.right - CARD_HALF;
                    const midX = (fromX + s.at[0]) / 2;
                    return (
                      <motion.g key={`${prov.name}-${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                        <motion.path d={`M${fromX} ${s.y} C${midX} ${s.y} ${midX} ${s.at[1]} ${s.at[0]} ${s.at[1]}`} fill="none" stroke="#ce9744" strokeOpacity={0.55} strokeWidth={1} strokeDasharray="3 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.15 + k * 0.06, ease }} />
                        <motion.circle cx={s.at[0]} cy={s.at[1]} r={5} fill="#f5f6f8" stroke="#022b52" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + k * 0.06, type: "spring", stiffness: 300, damping: 16 }} style={{ transformOrigin: `${s.at[0]}px ${s.at[1]}px` }} />
                      </motion.g>
                    );
                  })}
                </AnimatePresence>
              </motion.g>
            </svg>

            {/* the posts, arranged around the map (desktop) */}
            <motion.div style={{ opacity: postsVisible }} className="absolute inset-0 hidden lg:block">
              <AnimatePresence>
                {shape.slots.map((s, k) => (
                  <motion.div
                    key={`${prov.name}-card-${k}`}
                    initial={{ opacity: 0, x: s.side === "left" ? -24 : 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.5, delay: k * 0.06, ease }}
                    style={{ left: `${(SLOT_X[s.side] / 1000) * 100}%`, top: `${(s.y / 640) * 100}%`, width: `${((CARD_HALF * 2) / 1000) * 100}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <PostCard post={s.post} align={s.side} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* the posts as a compact list (mobile) */}
          <motion.div style={{ opacity: postsVisible }} className="mt-3 w-full lg:hidden">
            <AnimatePresence mode="wait">
              <motion.ul key={prov.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-2">
                {prov.posts.slice(0, 4).map((post) => (
                  <li key={post.title + post.place} className="rounded-xl bg-navy-950/60 px-3 py-2 ring-1 ring-ivory/10">
                    <p className="text-xs leading-tight font-medium">{post.title}</p>
                    <p className="mt-0.5 text-[11px] text-ivory/50">{post.place}</p>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* province rail: a continuous progress line, and names to jump between */}
        <div className="container-page relative mt-4 w-full">
          <div className="relative h-px bg-ivory/15">
            <motion.div style={{ scaleX: p }} className="absolute inset-0 origin-left bg-gold-light" />
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {provinces.map((q, n) => (
              <button key={q.name} onClick={() => jump(n)} className="group text-left" aria-label={`Show ${q.name}`} aria-current={n === i}>
                <span className={cn("block truncate text-[11px] transition-colors sm:text-xs", n === i ? "text-ivory" : "text-ivory/40 group-hover:text-ivory/75")}>
                  <span className="sm:hidden">{String(n + 1).padStart(2, "0")}</span>
                  <span className="hidden sm:inline">{q.name}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-right text-[11px] text-ivory/35">Illustrative outlines, not to scale</p>
        </div>
      </motion.div>
    </section>
  );
}

function PostCard({ post, align }: { post: Post; align: "left" | "right" }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl bg-navy-950/70 p-3 ring-1 ring-ivory/10 backdrop-blur", align === "right" && "flex-row-reverse text-right")}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-light/15 text-gold-light ring-1 ring-gold-light/30">
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
