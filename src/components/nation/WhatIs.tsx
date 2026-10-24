"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Building2, Landmark, MapPinned } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";

const statement =
  "Civil service is the quiet machinery of a nation — the officers who turn a law into a school, a budget into a road, and a promise into a service that reaches every citizen.";

const tiers = [
  { icon: Landmark, title: "Federal", body: "CSS officers serve across twelve occupational groups — from district administration and policing to diplomacy and revenue." },
  { icon: Building2, title: "Provincial", body: "PMS officers run provincial departments and secretariats, shaping policy for millions of people." },
  { icon: MapPinned, title: "District", body: "Assistant and deputy commissioners bring the state to the doorstep — land, law, relief and development." },
];

/** Each word brightens as the reader scrolls through the statement. */
function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / total, (i + 1) / total], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

export function WhatIs() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = statement.split(" ");

  return (
    <section id="about" data-theme="light" className="grain relative isolate overflow-hidden py-28 lg:py-40">
      <Parallax offset={{ base: 40, lg: 120 }} aria-hidden className="pointer-events-none absolute top-10 -right-6 -z-10 select-none font-urdu text-[9rem] leading-none text-navy-800/[0.05] sm:text-[14rem] lg:text-[18rem]">
        <span lang="ur">خدمت</span>
      </Parallax>

      <div className="container-page">
        <Reveal>
          <p className="eyebrow text-gold">What is civil service?</p>
        </Reveal>
        <p ref={ref} className="mt-8 max-w-5xl font-display text-[2rem] leading-[1.18] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
          {words.map((w, i) => (
            <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
          ))}
        </p>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08} className="group bg-paper p-8 transition-colors duration-500 hover:bg-navy-900 lg:p-10">
              <t.icon className="size-6 text-gold transition-colors duration-500 group-hover:text-gold-light" />
              <h3 className="mt-8 font-display text-3xl tracking-tight text-ink transition-colors duration-500 group-hover:text-ivory">{t.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft transition-colors duration-500 group-hover:text-ivory/70">{t.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
