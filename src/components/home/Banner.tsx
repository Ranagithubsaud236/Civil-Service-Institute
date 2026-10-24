"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { slides } from "@/data/media";
import { cn } from "@/lib/cn";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { IntakeCard } from "./IntakeCard";

const DURATION = 7; // seconds per slide
const count = slides.length + 1; // slide 0 is the CSI welcome

/**
 * Full-width banner carousel, the way official academy sites open. GSAP drives every transition:
 * the headline rises word by word, the image wipes in, the backdrop slowly zooms, and the progress
 * bar times the autoplay (paused on hover).
 */
export function Banner() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const prev = useRef<number | null>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const splits = useRef<SplitText[]>([]);
  const drag = useRef<number | null>(null);

  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  // split every headline once; the context reverts them on unmount
  useGSAP(
    () => {
      splits.current = gsap.utils.toArray<HTMLElement>("[data-title]", root.current).map((el) => SplitText.create(el, { type: "lines,words", mask: "lines" }));
    },
    { scope: root },
  );

  useGSAP(
    () => {
      // a manual jump must stop the previous slide's timer, or it would fire and skip a slide
      timer.current?.kill();
      const els = gsap.utils.toArray<HTMLElement>("[data-slide]", root.current);
      const cur = els[index];
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline();

      const old = prev.current;
      if (old !== null && old !== index) {
        const out = els[old];
        tl.to(out.querySelector("[data-content]"), { autoAlpha: 0, y: -24, duration: 0.4, ease: "power2.in" })
          .to(out.querySelector("[data-media]"), { autoAlpha: 0, x: -40, duration: 0.4, ease: "power2.in" }, "<")
          .set(out, { autoAlpha: 0 })
          .set([out.querySelector("[data-content]"), out.querySelector("[data-media]")], { clearProps: "all" });
      }
      prev.current = index;

      tl.set(cur, { autoAlpha: 1 });
      if (!reduce) {
        tl.fromTo(splits.current[index].words, { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.035, ease: "power4.out" })
          .fromTo(cur.querySelectorAll("[data-anim]"), { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09 }, "<0.25")
          .fromTo(
            cur.querySelector("[data-media]"),
            index === 0 ? { y: 50, autoAlpha: 0 } : { clipPath: "inset(0% 0% 0% 100% round 24px)", x: 60 },
            index === 0 ? { y: 0, autoAlpha: 1, duration: 1.1 } : { clipPath: "inset(0% 0% 0% 0% round 24px)", x: 0, duration: 1.2, ease: "expo.out" },
            "<-0.1",
          );
        gsap.fromTo(cur.querySelector("[data-bg]"), { scale: 1.18 }, { scale: 1.02, duration: DURATION + 1.5, ease: "none" });
      }

      // autoplay: the active progress bar fills, then advances
      gsap.set("[data-bar]", { scaleX: 0 });
      gsap.set(gsap.utils.toArray<HTMLElement>("[data-bar]", root.current).slice(0, index), { scaleX: 1 });
      timer.current = gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-bar]", root.current)[index],
        { scaleX: 0 },
        { scaleX: 1, duration: DURATION, ease: "none", onComplete: () => setIndex((i) => (i + 1) % count) },
      );
    },
    { scope: root, dependencies: [index] },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-roledescription="carousel"
      aria-label="CSI highlights"
      tabIndex={-1}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
      onMouseEnter={() => timer.current?.pause()}
      onMouseLeave={() => timer.current?.resume()}
      onPointerDown={(e) => (drag.current = e.clientX)}
      onPointerUp={(e) => {
        if (drag.current !== null && Math.abs(e.clientX - drag.current) > 70) go(e.clientX < drag.current ? 1 : -1);
        drag.current = null;
      }}
      className="relative isolate h-[720px] overflow-hidden bg-navy-deep text-white outline-none border-b-4 border-gold-light select-none sm:h-[min(calc(100svh-116px),780px)] sm:min-h-[620px]"
    >
      {/* slide 0: welcome */}
      <Slide first>
        <div data-bg className="absolute inset-0 -z-10 bg-navy-deep" />
        <div data-content className="max-w-xl">
          <p data-anim className="eyebrow text-gold-light">Rawalpindi · CSS &amp; PMS Academy</p>
          <h1 data-title className="mt-5 font-display text-[2.7rem] leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[4.4rem]">
            Prepare like an aspirant. Think like an <em className="text-gold-light">officer.</em>
          </h1>
          <p data-anim className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
            Mentored by Dr. Sassi Malik Sher — CSS 2017 précis &amp; composition topper — with red-pen evaluation of every script.
          </p>
          <div data-anim className="mt-8 flex flex-wrap gap-3">
            <Button href="#contact" variant="light">Attend a free orientation</Button>
            <a href="#programmes" className="inline-flex h-12 items-center rounded-full px-6 text-sm font-medium text-white ring-1 ring-white/30 transition-colors hover:bg-white/10">
              Explore programmes
            </a>
          </div>
        </div>
        <div data-media className="hidden text-ink lg:block">
          <IntakeCard />
        </div>
      </Slide>

      {slides.map((s, n) => {
        const video = s.img.w > s.img.h;
        return (
          <Slide key={s.title}>
            <div data-bg className="absolute inset-0 -z-10 bg-navy-deep" />
            <div data-content className="max-w-xl">
              <p data-anim className="eyebrow text-gold-light">{s.kicker}</p>
              <h2 data-title className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{s.title}</h2>
              <p data-anim className="mt-5 text-lg leading-relaxed text-white/70">{s.body}</p>
              <a data-anim href={s.href} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-navy-deep transition-colors hover:bg-gold-soft">
                {video ? "Watch on YouTube" : "View on Instagram"} <ArrowUpRight className="size-4" />
              </a>
            </div>
            <a
              data-media
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              className={cn("group relative block overflow-hidden rounded-3xl ring-1 ring-white/15", video ? "aspect-video w-full max-w-xl" : "h-56 sm:h-[min(60svh,480px)]")}
              style={video ? undefined : { aspectRatio: `${s.img.w} / ${s.img.h}` }}
            >
              <Image src={s.img.src} alt={s.img.alt || s.title} fill sizes="(min-width: 1024px) 40vw, 80vw" className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-105" priority={n === 0} />
              {video && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-white/95 text-navy-deep shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1 size-6 fill-current" />
                  </span>
                </span>
              )}
            </a>
          </Slide>
        );
      })}

      {/* controls */}
      <div className="absolute inset-x-0 bottom-6 z-10">
        <div className="container-page flex items-center justify-between gap-6">
          <div className="flex flex-1 gap-2" role="tablist" aria-label="Choose slide">
            {Array.from({ length: count }, (_, n) => (
              <button key={n} role="tab" aria-selected={n === index} aria-label={`Slide ${n + 1}`} onClick={() => setIndex(n)} className="group h-6 max-w-24 flex-1 py-2.5">
                <span className="block h-1 overflow-hidden rounded-full bg-white/20 transition-colors group-hover:bg-white/35">
                  <span data-bar className="block h-full origin-left scale-x-0 bg-gold-light" />
                </span>
              </button>
            ))}
          </div>
          <span className="hidden font-display text-lg text-white/60 tabular-nums sm:block">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <Arrow onClick={() => go(-1)} label="Previous slide"><ChevronLeft className="size-5" /></Arrow>
            <Arrow onClick={() => go(1)} label="Next slide"><ChevronRight className="size-5" /></Arrow>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slide({ first, children }: { first?: boolean; children: React.ReactNode }) {
  return (
    <div data-slide className={cn("absolute inset-0", !first && "invisible opacity-0")}>
      <div className="container-page grid h-full content-center items-center gap-8 pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 [&>*]:min-w-0">{children}</div>
    </div>
  );
}

function Arrow({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="grid size-11 place-items-center rounded-full ring-1 ring-white/30 transition-colors hover:bg-white hover:text-navy-deep">
      {children}
    </button>
  );
}
