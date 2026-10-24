"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { categories, programmes, type Programme } from "@/data/programmes";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export function Programmes() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const list = programmes.filter((p) => cat === "All" || p.category === cat);

  return (
    <section id="programmes" className="bg-subtle/60 py-24 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Programmes"
            title="Structured to the current FPSC and PPSC schemes."
            intro="From a six-month foundation to a five-week viva board — choose the stage you are preparing for."
          />
          <Reveal delay={0.1}>
            <div role="tablist" aria-label="Filter programmes" className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-line [scrollbar-width:none] sm:gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={cat === c}
                  onClick={() => setCat(c)}
                  className={cn("relative h-9 shrink-0 rounded-full px-3.5 text-sm sm:px-4 transition-colors duration-200", cat === c ? "text-white" : "text-ink-soft hover:text-ink")}
                >
                  {cat === c && <motion.span layoutId="prog-tab" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: i * 0.04, ease }}
              >
                <div className="h-full">
                  <ProgrammeCard p={p} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProgrammeCard({ p }: { p: Programme }) {
  const dark = p.featured;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 ease-out-soft hover:-translate-y-1",
        dark ? "bg-navy-deep text-white shadow-[0_30px_60px_-30px_rgba(10,36,64,0.7)]" : "bg-white ring-1 ring-line hover:shadow-[0_24px_48px_-24px_rgba(15,27,45,0.25)] hover:ring-ink/15",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", dark ? "bg-white/10 text-gold-light" : "bg-gold-soft text-gold")}>{p.tag}</span>
        <span className={cn("text-xs", dark ? "text-white/50" : "text-ink-mute")}>{p.duration}</span>
      </div>

      <h3 className="mt-6 font-display text-[1.7rem] leading-tight tracking-tight">{p.title}</h3>
      <p className={cn("mt-3 text-[15px] leading-relaxed", dark ? "text-white/65" : "text-ink-soft")}>{p.summary}</p>

      <ul className="mt-6 mb-8 space-y-2.5 text-sm">
        {p.features.slice(0, 3).map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check className={cn("mt-0.5 size-4 shrink-0", dark ? "text-gold-light" : "text-navy")} />
            <span className={dark ? "text-white/80" : "text-ink-soft"}>{f}</span>
          </li>
        ))}
      </ul>

      <div className={cn("mt-auto flex items-center justify-between border-t pt-5", dark ? "border-white/10" : "border-line")}>
        <div>
          <p className={cn("text-xs", dark ? "text-white/50" : "text-ink-mute")}>Tuition from</p>
          <p className="mt-0.5 font-display text-xl">{p.fee}</p>
        </div>
        <a
          href="#contact"
          aria-label={`Enquire about ${p.title}`}
          className={cn(
            "grid size-11 place-items-center rounded-full transition-all duration-300 ease-out-soft group-hover:rotate-45",
            dark ? "bg-white text-navy-deep" : "bg-subtle text-ink group-hover:bg-navy group-hover:text-white",
          )}
        >
          <ArrowUpRight className="size-5" />
        </a>
      </div>
    </article>
  );
}
