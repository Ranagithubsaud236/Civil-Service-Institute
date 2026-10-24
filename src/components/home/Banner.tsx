"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { youtubeUrl } from "@/data/media";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Real frames from CSI's YouTube lectures (1280×720, no thumbnail text), so each one can fill
 * the full width the way official academy sites show event photos.
 */
const slides = [
  { src: "/csi/hero/mentor-desk.jpg", alt: "Dr. Sassi Malik Sher at her desk", title: "Learn from an officer who topped the paper", sub: "Dr. Sassi Malik Sher · CSS 2017 précis & composition topper", href: "#faculty" },
  { src: "/csi/hero/live-class.jpg", alt: "Dr. Sassi Malik Sher teaching a live online class", title: "Live classes, across Pakistan", sub: "Lectures from Rawalpindi, streamed and recorded for every student", href: "#programmes" },
  { src: "/csi/hero/professionals.jpg", alt: "Dr. Sassi Malik Sher on balancing work and study", title: "Preparing alongside a job?", sub: "Evening batches built for working professionals", href: "#programmes" },
  { src: "/csi/hero/evening.jpg", alt: "Dr. Sassi Malik Sher outdoors in the evening", title: "Free lectures, every week", sub: "60.7K aspirants learn with CSI on YouTube", href: youtubeUrl("kBZQSa1qzpA") },
];

const DURATION = 6;

/**
 * Full-bleed photo carousel: crossfade with a slow zoom, caption rises at the bottom centre,
 * arrows at the edges and dots underneath. Autoplay pauses on hover.
 */
export function Banner() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const prev = useRef<number | null>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const drag = useRef<number | null>(null);
  const go = (d: number) => setIndex((i) => (i + d + slides.length) % slides.length);

  useGSAP(
    () => {
      // a manual jump must stop the previous timer, or it would fire and skip a slide
      timer.current?.kill();
      const els = gsap.utils.toArray<HTMLElement>("[data-slide]", root.current);
      const cur = els[index];
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      const old = prev.current;
      prev.current = index;
      if (old !== null && old !== index) {
        gsap.set(els[old], { zIndex: 0 });
        gsap.set(cur, { zIndex: 1 });
        gsap.fromTo(cur, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.9, ease: "power2.inOut", onComplete: () => gsap.set(els[old], { autoAlpha: 0 }) });
      } else {
        gsap.set(cur, { autoAlpha: 1, zIndex: 1 });
      }

      if (!reduce) {
        gsap.fromTo(cur.querySelector("img"), { scale: 1.12 }, { scale: 1, duration: DURATION + 1, ease: "none" });
        gsap.fromTo(cur.querySelectorAll("[data-caption] > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, delay: 0.3, ease: "power3.out" });
      }

      timer.current = gsap.delayedCall(DURATION, () => setIndex((i) => (i + 1) % slides.length));
    },
    { scope: root, dependencies: [index] },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-roledescription="carousel"
      aria-label="CSI highlights"
      onMouseEnter={() => timer.current?.pause()}
      onMouseLeave={() => timer.current?.resume()}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
      className="bg-white"
    >
      <div
        className="relative h-[min(calc(100svh-150px),720px)] min-h-[420px] overflow-hidden bg-navy-deep select-none"
        onPointerDown={(e) => (drag.current = e.clientX)}
        onPointerUp={(e) => {
          if (drag.current !== null && Math.abs(e.clientX - drag.current) > 60) go(e.clientX < drag.current ? 1 : -1);
          drag.current = null;
        }}
      >
        {slides.map((s, n) => (
          <div key={s.src} data-slide aria-hidden={n !== index} className={cn("absolute inset-0", n !== 0 && "invisible opacity-0")}>
            <Image src={s.src} alt={s.alt} fill sizes="100vw" priority={n === 0} className="pointer-events-none object-cover object-[50%_30%]" />
            {/* flat tint so white captions stay readable on bright photos */}
            <div className="absolute inset-0 bg-black/25" />
            <div data-caption className="absolute inset-x-0 bottom-10 px-16 text-center text-white sm:bottom-14">
              <h2 className="font-display text-3xl tracking-tight text-balance [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl">{s.title}</h2>
              <p className="mt-3 text-sm text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] sm:text-lg">{s.sub}</p>
              <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" tabIndex={n === index ? 0 : -1} className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-navy transition-colors hover:bg-gold-soft">
                Learn more
              </a>
            </div>
          </div>
        ))}

        <EdgeArrow side="left" onClick={() => go(-1)} />
        <EdgeArrow side="right" onClick={() => go(1)} />
      </div>

      <div className="flex justify-center gap-2.5 py-4" role="tablist" aria-label="Choose slide">
        {slides.map((s, n) => (
          <button
            key={s.src}
            role="tab"
            aria-selected={n === index}
            aria-label={s.title}
            onClick={() => setIndex(n)}
            className={cn("size-2.5 rounded-full transition-colors duration-300", n === index ? "bg-gold-light" : "bg-navy hover:bg-navy-deep")}
          />
        ))}
      </div>
    </section>
  );
}

function EdgeArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={cn("absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center text-white transition-opacity hover:opacity-75", side === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4")}
    >
      <Icon className="size-9 [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.5))]" strokeWidth={2.5} />
    </button>
  );
}
