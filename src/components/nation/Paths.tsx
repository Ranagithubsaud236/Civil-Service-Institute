"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info } from "lucide-react";
import { css, eligibility, groups, pathTabs, pms, stages } from "@/data/nation";
import { cn } from "@/lib/cn";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;
type Tab = (typeof pathTabs)[number];

export function Paths() {
  const [tab, setTab] = useState<Tab>("CSS");

  return (
    <section id="paths" data-theme="light" className="bg-paper py-24 lg:py-32">
      <div className="container-page">
        <Heading eyebrow="Explore your path" title="Two doors into public service — and many rooms beyond them." intro="Understand the examinations, who can sit them, how selection works and where each career leads." />

        <Reveal delay={0.1}>
          <div role="tablist" aria-label="Career path topics" className="mt-12 flex max-w-full gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]">
            {pathTabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn("relative shrink-0 px-4 pt-2 pb-4 text-[15px] transition-colors duration-200", tab === t ? "text-ink" : "text-ink-mute hover:text-ink")}
              >
                {t}
                {tab === t && <motion.span layoutId="path-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brass" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
              {tab === "CSS" && (
                <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                  <div>
                    <h3 className="font-display text-4xl tracking-tight">{css.title}</h3>
                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{css.body}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-px self-start overflow-hidden rounded-2xl bg-line ring-1 ring-line">
                    {css.facts.map((f) => (
                      <div key={f.label} className="bg-ivory p-5 sm:p-6">
                        <p className="font-display text-4xl tracking-tight text-forest-800 sm:text-5xl"><Counter to={+f.value} /></p>
                        <p className="mt-2 text-xs leading-snug text-ink-mute sm:text-sm">{f.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "PMS" && (
                <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                  <div>
                    <h3 className="font-display text-4xl tracking-tight">{pms.title}</h3>
                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{pms.body}</p>
                  </div>
                  <ul className="grid grid-cols-2 gap-3 self-start">
                    {pms.commissions.map((c, i) => (
                      <motion.li key={c} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, ease }} className="rounded-2xl bg-ivory p-5 ring-1 ring-line">
                        <span className="text-xs text-ink-mute">0{i + 1}</span>
                        <p className="mt-6 font-display text-xl leading-tight">{c}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "Eligibility" && (
                <dl className="divide-y divide-line border-y border-line">
                  {eligibility.map((e, i) => (
                    <motion.div key={e.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, ease }} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr]">
                      <dt className="font-display text-2xl">{e.label}</dt>
                      <dd className="text-lg leading-relaxed text-ink-soft">{e.value}</dd>
                    </motion.div>
                  ))}
                </dl>
              )}

              {tab === "Exam stages" && (
                <ol className="relative grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
                  <motion.span aria-hidden className="absolute top-5 right-0 left-0 hidden h-px origin-left bg-brass/50 lg:block" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease }} />
                  {stages.map((s, i) => (
                    <motion.li key={s.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1, ease }} className="relative">
                      <span className="relative grid size-10 place-items-center rounded-full bg-forest-800 text-sm text-ivory ring-4 ring-paper">{i + 1}</span>
                      <p className="mt-5 font-display text-2xl">{s.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-mute">{s.detail}</p>
                    </motion.li>
                  ))}
                </ol>
              )}

              {tab === "Career groups" && (
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {groups.map((g, i) => (
                    <motion.li
                      key={g}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.035, ease }}
                      className="group flex items-center gap-4 rounded-2xl bg-ivory px-5 py-4 ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-800 hover:ring-forest-800"
                    >
                      <span className="text-xs tabular-nums text-brass transition-colors group-hover:text-brass-light">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[15px] text-ink transition-colors group-hover:text-ivory">{g}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-10 flex items-start gap-2 text-sm text-ink-mute">
          <Info className="mt-0.5 size-4 shrink-0" />
          Rules change from year to year — always confirm eligibility and the scheme of examination in the latest FPSC or provincial commission notification.
        </p>
      </div>
    </section>
  );
}
