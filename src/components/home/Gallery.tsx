"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { channel, ig, posts, reel, thumb, videos, youtubeUrl, type Img } from "@/data/media";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "./SectionHeading";

type Item = { key: string; tab: Tab; title: string; img: Img; videoId?: string; href: string };
type Tab = "Campus & books" | "Classes" | "Lectures";

const ease = [0.22, 1, 0.36, 1] as const;

const items: Item[] = [
  { key: "desk", tab: "Campus & books", title: "The CSI front desk", img: posts.frontDesk, href: ig("DcQkCDbDHte") },
  { key: "press", tab: "Campus & books", title: "Press Review Plus", img: posts.pressReview, href: ig("DewF_7RiUSz") },
  { key: "pubs", tab: "Campus & books", title: "CSI Publications", img: posts.publications, href: ig("DcRFr8xjHSG") },
  { key: "bundle", tab: "Campus & books", title: "The 5-book bundle", img: posts.bundle, href: ig("DeuD3U9CA9Y") },
  { key: "enrol", tab: "Classes", title: "Enrolment open", img: posts.reelEnrol, href: reel("Derq43OCT3l") },
  { key: "welcome", tab: "Classes", title: "Welcome to CSI", img: posts.reelWelcome, href: reel("DepMO93iw3Z") },
  { key: "event", tab: "Classes", title: "Dr. Sassi Malik Sher at an event", img: posts.reelEvent, href: reel("DerxFuAisps") },
  { key: "wa", tab: "Classes", title: "Join on WhatsApp", img: posts.reelWhatsapp, href: reel("DejS_eji8cH") },
  ...videos.map((v) => ({ key: v.id, tab: "Lectures" as const, title: v.title, img: { ...thumb(v.id), alt: v.title }, videoId: v.id, href: youtubeUrl(v.id) })),
];
const tabs: ("All" | Tab)[] = ["All", "Campus & books", "Classes", "Lectures"];

/** Column count by width: 2 on phones, 3 on tablets, 6 on desktop (18 photos fill even rows). */
function useColumns() {
  return useSyncExternalStore(
    (cb) => {
      const qs = [matchMedia("(min-width: 768px)"), matchMedia("(min-width: 1024px)")];
      qs.forEach((q) => q.addEventListener("change", cb));
      return () => qs.forEach((q) => q.removeEventListener("change", cb));
    },
    () => (matchMedia("(min-width: 1024px)").matches ? 6 : matchMedia("(min-width: 768px)").matches ? 3 : 2),
    () => 6,
  );
}


/**
 * Gallery of real CSI photos and lectures in equal columns. On scroll the columns rise from below
 * in an arch (centre first, outer ones later), close in towards the centre and settle level.
 * The lightbox plays videos in place.
 */
export function Gallery() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const list = items.filter((x) => tab === "All" || x.tab === tab);
  const cols = useColumns();
  const center = (cols - 1) / 2;
  const columns = Array.from({ length: cols }, (_, c) => list.map((x, n) => ({ x, n })).filter((_, n) => n % cols === c));
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col) => {
          const d = Number(col.dataset.col); // signed distance from the centre column
          const far = Math.abs(d);
          const tiles = col.querySelectorAll("[data-tile]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: grid.current, start: "top bottom", end: "top 35%", scrub: 1 } });
          tl.fromTo(col, { y: 240 + far * far * 70, x: d * 60, opacity: 0.25 }, { y: 0, x: 0, opacity: 1, ease: "none" }, 0);
          // tiles inside a column start spread apart and close up as they arrive
          tl.fromTo(tiles, { y: (i: number) => i * 60, scale: 0.88 }, { y: 0, scale: 1, ease: "none" }, 0);
        });
      });
    },
    { scope: grid, dependencies: [cols, tab], revertOnUpdate: true },
  );

  return (
    <section id="gallery" className="overflow-hidden bg-subtle py-24 lg:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Gallery" title="Life, lectures and launches at CSI." intro={`Photos from CSI’s Instagram and free lectures from its YouTube channel — ${channel.subscribers} subscribers and counting.`} />
          <LayoutGroup id="gallery-tabs">
            <div className="flex flex-wrap gap-1 rounded-full bg-white p-1 ring-1 ring-line">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cn("relative rounded-full px-4 py-2 text-sm transition-colors", tab === t ? "text-white" : "text-ink-soft hover:text-ink")}>
                  {tab === t && <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </div>

      <div ref={grid} className="container-page mt-14 flex items-start gap-3 sm:gap-4">
        {columns.map((col, c) => {
          const d = c - center;
          return (
            <div key={`${cols}-${c}`} data-col={d} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
              {col.map(({ x, n }) => (
                <button
                  key={x.key}
                  data-tile
                  onClick={() => setOpen(n)}
                  className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-white text-left ring-1 ring-line"
                >
                  <Image src={x.img.src} alt={x.img.alt || x.title} fill sizes="(min-width: 1024px) 200px, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 hidden bg-navy-deep px-3 py-2 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
                    {x.title}
                  </span>
                  {x.videoId && (
                    <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white text-navy-deep sm:size-8">
                      <Play className="ml-0.5 size-3.5 fill-current" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <AnimatePresence>{open !== null && <Lightbox list={list} index={open} onChange={setOpen} />}</AnimatePresence>
    </section>
  );
}

function Lightbox({ list, index, onChange }: { list: Item[]; index: number; onChange: (n: number | null) => void }) {
  const x = list[index];
  const step = (d: number) => onChange((index + d + list.length) % list.length);

  // keyboard control and scroll lock while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") onChange((index + 1) % list.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + list.length) % list.length);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, list.length, onChange]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={x.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onChange(null)}
      className="fixed inset-0 z-[60] flex flex-col bg-navy-deep p-4 text-white sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60 tabular-nums">
          {index + 1} / {list.length}
        </span>
        <button onClick={() => onChange(null)} aria-label="Close" className="grid size-11 place-items-center rounded-full bg-navy transition-colors hover:bg-white hover:text-navy-deep">
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div key={x.key} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease }} className="flex h-full w-full items-center justify-center">
            {x.videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${x.videoId}?autoplay=1&rel=0`}
                title={x.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full max-w-5xl rounded-2xl bg-ink"
              />
            ) : (
              <Image src={x.img.src} alt={x.img.alt} width={x.img.w} height={x.img.h} sizes="640px" style={{ width: "auto", height: "auto" }} className="max-h-full max-w-full rounded-2xl object-contain" />
            )}
          </motion.div>
        </AnimatePresence>
        <NavButton side="left" onClick={() => step(-1)} />
        <NavButton side="right" onClick={() => step(1)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-xl">{x.title}</p>
        <a href={x.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gold-light hover:underline">
          {x.videoId ? "Open on YouTube" : "Open on Instagram"} <ArrowUpRight className="size-4" />
        </a>
      </div>
    </motion.div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button onClick={onClick} aria-label={side === "left" ? "Previous" : "Next"} className={cn("absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-navy transition-colors hover:bg-white hover:text-navy-deep", side === "left" ? "left-0" : "right-0")}>
      <Icon className="size-6" />
    </button>
  );
}
