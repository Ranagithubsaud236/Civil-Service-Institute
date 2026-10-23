"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/data/site";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="container-page py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <SectionHeading className="lg:sticky lg:top-32 lg:self-start" eyebrow="FAQ" title="Questions aspirants ask us." intro="Can't find your answer? Message the admissions desk on WhatsApp — we usually reply within the hour." />

        <Reveal>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={cn("font-display text-xl tracking-tight transition-colors duration-200 md:text-[1.4rem]", isOpen ? "text-ink" : "text-ink-soft group-hover:text-ink")}>{f.q}</span>
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-all duration-300 ease-out-soft", isOpen ? "rotate-45 bg-navy text-white ring-navy" : "text-ink ring-line group-hover:ring-ink/30")}>
                      <Plus className="size-4" />
                    </span>
                  </button>
                  <div className={cn("grid transition-[grid-template-rows] duration-400 ease-out-soft", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className={cn("max-w-2xl pb-6 leading-relaxed text-ink-soft transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
