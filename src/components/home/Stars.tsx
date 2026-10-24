"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw, Sparkles } from "lucide-react";
import { stars, type Star } from "@/data/people";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./SectionHeading";

/** CSI's successful students. Each card flips (hover, or tap on touch screens) to CSI's original poster. */
export function Stars() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-star]", {
        y: 80,
        rotate: (i) => (i - 1) * 6,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stars" className="relative overflow-hidden bg-navy-deep py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,184,119,0.18),transparent_65%)]" />
      <div className="container-page relative">
        <SectionHeading
          dark
          eyebrow="Stars of CSI"
          title="From our classrooms to the civil service."
          intro="Recent CSI students who cleared CSS 2024 and the Sindh CCE written exam, as announced by the institute."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stars.map((s) => (
            <div key={s.name} data-star>
              <FlipCard star={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ star }: { star: Star }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={`${star.name}, ${star.result}. Show CSI's poster`}
      className="group block w-full text-left [perspective:1400px]"
    >
      <div
        className={cn(
          "relative aspect-[4/5] transition-transform duration-[900ms] ease-out-soft [transform-style:preserve-3d] pointer-fine:group-hover:[transform:rotateY(180deg)]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        {/* front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white/[0.06] p-8 text-center ring-1 ring-white/12 [backface-visibility:hidden]">
          <span className="relative block size-44">
            <svg viewBox="0 0 200 200" className="absolute -inset-3 size-[calc(100%+1.5rem)] animate-[spin_24s_linear_infinite] text-gold-light" aria-hidden>
              <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 7" />
            </svg>
            <span className="absolute inset-0 overflow-hidden rounded-full ring-4 ring-gold-light/80">
              <Image src={star.photo} alt={star.name} fill sizes="176px" className="scale-110 object-cover" />
            </span>
            <span className="absolute -right-1 bottom-2 rounded-full bg-gold-light px-3 py-1 text-xs font-semibold tracking-wide text-navy-deep shadow-lg">{star.group}</span>
          </span>

          <p className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.14em] text-gold-light uppercase">
            <Sparkles className="size-3.5" /> Star of CSI
          </p>
          <h3 className="mt-2 font-display text-3xl tracking-tight">{star.name}</h3>
          <p className="mt-1.5 text-white/70">{star.result}</p>
          <p className="mt-0.5 text-sm text-white/45">{star.service}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/40">
            <RotateCcw className="size-3.5" />
            <span>
              <span className="pointer-fine:hidden">Tap</span>
              <span className="hidden pointer-fine:inline">Hover</span> to see CSI&apos;s poster
            </span>
          </span>
        </div>

        {/* back: the institute's own announcement */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl bg-white ring-1 ring-white/12 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Image src={star.poster} alt={`CSI's Star of CSI poster for ${star.name}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    </button>
  );
}
