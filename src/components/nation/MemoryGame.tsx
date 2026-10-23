"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { RotateCcw, Scale } from "lucide-react";
import { cn } from "@/lib/cn";
import { Heading } from "./Heading";

const pairs = [
  ["Article 1", "The Republic and its territories"],
  ["Article 2", "Islam as the State religion"],
  ["Article 9", "Security of person"],
  ["Article 19", "Freedom of speech"],
  ["Article 25", "Equality of citizens"],
  ["Article 25A", "Right to education"],
] as const;

type Card = { id: number; pair: number; face: string; kind: "article" | "topic" };

const cards: Card[] = pairs.flatMap(([a, t], i) => [
  { id: i * 2, pair: i, face: a, kind: "article" as const },
  { id: i * 2 + 1, pair: i, face: t, kind: "topic" as const },
]);
// a fixed first layout (same on server and client); "play again" reshuffles randomly
const firstOrder = [3, 8, 0, 11, 5, 6, 10, 1, 7, 2, 9, 4];

/** Match each article of the 1973 Constitution to its subject — a memory game against the clock. */
export function MemoryGame() {
  const [order, setOrder] = useState(firstOrder);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<number | null>(null);
  const won = matched.length === pairs.length;

  useEffect(() => {
    if (!startedAt || won) return;
    const id = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAt) / 1000)), 250);
    return () => clearInterval(id);
  }, [startedAt, won]);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const flip = (c: Card) => {
    if (open.length === 2 || open.includes(c.id) || matched.includes(c.pair)) return;
    if (!startedAt) setStartedAt(Date.now());
    const next = [...open, c.id];
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next.map((id) => cards[id]);
    if (a.pair === b.pair) {
      setMatched((m) => [...m, a.pair]);
      setOpen([]);
    } else {
      timer.current = window.setTimeout(() => setOpen([]), 900);
    }
  };

  const reset = () => {
    setOrder([...firstOrder].sort(() => Math.random() - 0.5));
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setStartedAt(null);
    setSeconds(0);
  };

  return (
    <section id="memory" data-theme="light" className="bg-paper py-24 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Heading eyebrow="Pakistan Affairs warm-up" title="Match the article to its promise." intro="Flip two cards at a time to pair each article of the 1973 Constitution with what it guarantees." />
          <div className="flex items-center gap-6 text-sm">
            <p><span className="font-display text-3xl tabular-nums">{moves}</span> <span className="text-ink-mute">moves</span></p>
            <p><span className="font-display text-3xl tabular-nums">{seconds}</span> <span className="text-ink-mute">sec</span></p>
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-line transition-colors hover:bg-ivory-200">
              <RotateCcw className="size-4" /> Shuffle
            </button>
          </div>
        </div>

        <div className="relative mt-12">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
            {order.map((id) => {
              const c = cards[id];
              const shown = open.includes(id) || matched.includes(c.pair);
              const done = matched.includes(c.pair);
              return (
                <button key={id} onClick={() => flip(c)} aria-label={shown ? c.face : "Hidden card"} className="aspect-[4/3] [perspective:900px]" data-cursor={shown ? undefined : "Flip"}>
                  <motion.span animate={{ rotateY: shown ? 180 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative block size-full [transform-style:preserve-3d]">
                    {/* back */}
                    <span className="absolute inset-0 grid place-items-center rounded-2xl bg-forest-800 text-brass-light ring-1 ring-forest-700 [backface-visibility:hidden]">
                      <Scale className="size-7 opacity-70" />
                      <span className="absolute inset-2 rounded-xl border border-brass-light/20" />
                    </span>
                    {/* face */}
                    <span
                      className={cn(
                        "absolute inset-0 grid place-items-center rounded-2xl p-3 text-center ring-1 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                        done ? "bg-brass-light text-forest-950 ring-brass" : "bg-ivory text-ink ring-line",
                      )}
                    >
                      <span className={c.kind === "article" ? "font-display text-xl sm:text-2xl" : "text-xs leading-snug sm:text-sm"}>{c.face}</span>
                    </span>
                  </motion.span>
                </button>
              );
            })}
          </div>

          {won && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className="absolute inset-0 grid place-items-center rounded-3xl bg-forest-900/92 text-center text-ivory backdrop-blur-sm">
              <div>
                <p className="font-display text-5xl tracking-tight">All six matched.</p>
                <p className="mt-3 text-ivory/70">{moves} moves in {seconds} seconds{moves <= 8 ? " — a constitutional scholar in the making." : "."}</p>
                <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-full bg-brass-light px-5 py-2.5 text-sm font-medium text-forest-950">
                  <RotateCcw className="size-4" /> Play again
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
