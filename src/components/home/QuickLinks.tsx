"use client";

import { useRef } from "react";
import { ArrowUpRight, BookOpen, GraduationCap, NotebookPen } from "lucide-react";
import { YouTubeIcon } from "@/components/ui/BrandIcons";
import { channel, ig } from "@/data/media";
import { site } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";

const links = [
  { icon: GraduationCap, title: "Admissions", body: "CSS 2027 & PMS Punjab batches", href: "#contact" },
  { icon: NotebookPen, title: "Programmes", body: "Foundation, evening, clinics", href: "#programmes" },
  { icon: YouTubeIcon, title: "Free lectures", body: `${channel.subscribers} subscribers on YouTube`, href: site.youtube.url, external: true },
  { icon: BookOpen, title: "Publications", body: "Press Review Plus & 5-book bundle", href: ig("DeuD3U9CA9Y"), external: true },
];

/** Four shortcuts directly under the banner; they rise in one after another. */
export function QuickLinks() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.from("[data-quick]", { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.1, delay: 0.4 });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Quick links" className="border-b border-line bg-white">
      <div className="container-page grid sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <a
            key={l.title}
            data-quick
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noopener noreferrer" : undefined}
            className="group relative flex items-center gap-4 border-line py-6 transition-colors not-last:border-b sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:not-last:border-r lg:first:pl-0"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-subtle text-navy transition-all duration-300 group-hover:-rotate-6 group-hover:bg-navy group-hover:text-white">
              <l.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-xl tracking-tight text-ink">{l.title}</span>
              <span className="block truncate text-sm text-ink-mute">{l.body}</span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-ink-mute transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy" />
            <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 sm:inset-x-6 lg:first:left-0" />
          </a>
        ))}
      </div>
    </section>
  );
}
