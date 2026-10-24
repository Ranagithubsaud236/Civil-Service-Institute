"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Scramble } from "@/components/ui/Scramble";

const milestones = [
  { year: 1947, title: "A state built from scratch", body: "At independence, a small cadre of officers sets up ministries in Karachi, often with borrowed desks and handwritten files." },
  { year: 1973, title: "Occupational groups", body: "Administrative reforms reorganise the superior services into the occupational groups that CSS candidates choose between today." },
  { year: 2001, title: "District governments", body: "Devolution creates elected district governments, changing how officers and local representatives share responsibility." },
  { year: 2010, title: "The 18th Amendment", body: "Major subjects move from the federal government to the provinces — and provincial services grow in importance." },
  { year: 2026, title: "A new generation", body: "Screening tests, digital files and data-driven governance — and a new generation of aspirants preparing to serve." },
];

/** One digit as a vertical strip of 0–9 that rolls to its value, like a mechanical counter. */
function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-top">
      <motion.span className="absolute inset-x-0 top-0 flex flex-col" animate={{ y: `${-value * 10}%` }} transition={{ type: "spring", stiffness: 90, damping: 18 }}>
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className="block h-[1em] leading-none">{d}</span>
        ))}
      </motion.span>
    </span>
  );
}

/** Pakistan's civil service through five turning points; the year rolls as each one passes. */
export function History() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const year = String(milestones[active].year).split("").map(Number);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="history" data-theme="light" className="grain relative py-24 lg:py-32">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
          <p className="eyebrow text-gold">
            <Scramble text="Seventy-nine years of service" />
          </p>
          <p className="mt-4 font-display text-[22vw] leading-none tracking-tight text-navy-800 tabular-nums sm:text-[9rem] lg:text-[11rem]" aria-live="polite" aria-label={String(milestones[active].year)}>
            {year.map((d, i) => (
              <Digit key={i} value={d} />
            ))}
          </p>
          <div className="mt-6 flex gap-2">
            {milestones.map((m, i) => (
              <span key={m.year} className={cn("h-1 rounded-full transition-all duration-500", i === active ? "w-10 bg-gold" : "w-4 bg-ink/15")} />
            ))}
          </div>
        </div>

        <ol className="lg:py-[30vh]">
          {milestones.map((m, i) => (
            <li
              key={m.year}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-index={i}
              className="flex min-h-[55vh] items-center py-10 lg:min-h-[70vh]"
            >
              <motion.div animate={{ opacity: i === active ? 1 : 0.28, x: i === active ? 0 : 12 }} transition={{ duration: 0.5 }} className="max-w-md">
                <p className="text-sm text-gold">{m.year === 2026 ? "Today" : m.year}</p>
                <h3 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">{m.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">{m.body}</p>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
