"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";

export type Entry = { title: string; summary: string; date: string; href: string; tag: string; img?: { src: string; alt: string } };

const ease = [0.22, 1, 0.36, 1] as const;

/** Headline ticker plus a tabbed board: one featured story and a grid of cards per tab. */
export function NewsBoard({ feeds }: { feeds: Record<string, Entry[]> }) {
  const tabs = Object.keys(feeds).filter((t) => feeds[t].length);
  const [tab, setTab] = useState(tabs[0]);
  const list = feeds[tab] ?? [];
  const [featured, ...rest] = list;
  const ticker = feeds[tabs[0]] ?? [];

  return (
    <section id="news" className="py-24 lg:py-32">
      {ticker.length > 0 && (
        <div className="group mb-16 flex items-center overflow-hidden border-y border-line bg-white">
          <span className="z-10 flex shrink-0 items-center gap-2 self-stretch bg-navy py-3 pr-5 pl-5 text-xs font-medium tracking-[0.14em] text-white uppercase sm:pl-8">
            <span className="size-2 animate-pulse rounded-full bg-red-400" /> Latest
          </span>
          {/* the list is doubled so the loop is seamless; hovering pauses it */}
          <div className="flex min-w-0 overflow-hidden">
            <ul className="flex shrink-0 animate-[ticker_60s_linear_infinite] gap-10 py-3 pr-10 pl-6 text-sm whitespace-nowrap text-ink-soft group-hover:[animation-play-state:paused]">
              {[...ticker, ...ticker].map((n, i) => (
                <li key={i} aria-hidden={i >= ticker.length} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-gold" />
                  <a href={n.href} target="_blank" rel="noopener noreferrer" tabIndex={i >= ticker.length ? -1 : undefined} className="hover:text-navy hover:underline">
                    {n.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Latest news" title="Today’s current affairs, and what’s new at CSI." intro="Headlines from BBC News, refreshed every hour — the raw material for your current affairs and essay papers." />
          <LayoutGroup id="news-tabs">
            <div className="flex flex-wrap gap-1 rounded-full bg-white p-1 ring-1 ring-line">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cn("relative rounded-full px-4 py-2 text-sm transition-colors", tab === t ? "text-white" : "text-ink-soft hover:text-ink")}>
                  {tab === t && <motion.span layoutId="news-pill" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
            {featured && <Card item={featured} featured />}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {rest.slice(0, 6).map((n) => (
                <Card key={n.href + n.title} item={n} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {tab !== "CSI updates" && (
          <p className="mt-8 text-sm text-ink-mute">
            Headlines and images ©{" "}
            <a href="https://www.bbc.com/news" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-navy hover:underline">BBC News</a>
            . Each story opens on the BBC website.
          </p>
        )}
      </div>
    </section>
  );
}

function Card({ item, featured }: { item: Entry; featured?: boolean }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full overflow-hidden rounded-3xl bg-white ring-1 ring-line transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:ring-ink/15",
        featured ? "mt-14 flex-col sm:min-h-[420px] sm:flex-row" : "flex-row",
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden bg-subtle", featured ? "aspect-video sm:aspect-auto sm:w-1/2" : "w-32 sm:w-44")}>
        {item.img ? (
          <Image src={item.img.src} alt={item.img.alt} fill sizes={featured ? "(min-width: 640px) 50vw, 100vw" : "176px"} className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105" />
        ) : (
          <span className="grid h-full place-items-center text-ink-mute"><Newspaper className="size-8" /></span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col", featured ? "p-7 sm:p-12" : "p-5 sm:p-6")}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 font-medium text-gold">{item.tag}</span>
          <span className="text-ink-mute">{item.date}</span>
        </div>
        <h3 className={cn("mt-3 font-display tracking-tight text-ink text-balance", featured ? "text-3xl md:text-[2.6rem] md:leading-[1.1]" : "line-clamp-3 text-xl")}>{item.title}</h3>
        <p className={cn("mt-2 leading-relaxed text-ink-soft", featured ? "text-lg md:mt-4" : "line-clamp-2 text-sm")}>{item.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-navy">
          Read more <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}
