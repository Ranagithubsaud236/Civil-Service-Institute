import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { news } from "@/data/media";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

type Item = (typeof news)[number];

/** Latest news & events from CSI's Instagram: a headline ticker, one featured story, then cards. */
export function News() {
  const [featured, ...rest] = news;
  return (
    <section id="news" className="py-24 lg:py-32">
      {/* headline ticker; the list is doubled so the loop is seamless */}
      <div className="group mb-16 flex overflow-hidden border-y border-line bg-white py-3">
        <span className="z-10 shrink-0 bg-white pr-4 pl-5 text-xs font-medium tracking-[0.14em] text-gold uppercase sm:pl-8">Latest</span>
        <ul className="flex shrink-0 animate-[ticker_40s_linear_infinite] gap-10 pr-10 text-sm whitespace-nowrap text-ink-soft group-hover:[animation-play-state:paused]">
          {[...news, ...news].map((n, i) => (
            <li key={i} aria-hidden={i >= news.length} className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-gold" />
              <span className="text-ink-mute">{n.date}</span> {n.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page">
        <SectionHeading eyebrow="News & events" title="What’s happening at CSI." intro="New editions, offers and admissions — straight from CSI’s own channels." />

        <Reveal className="mt-14">
          <Card item={featured} featured />
        </Reveal>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {rest.map((n, i) => (
            <Reveal key={n.title} delay={(i % 2) * 0.08} className="h-full">
              <Card item={n} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ item, featured }: { item: Item; featured?: boolean }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full overflow-hidden rounded-3xl bg-white ring-1 ring-line transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(15,27,45,0.25)] hover:ring-ink/15",
        featured ? "flex-col sm:min-h-[420px] sm:flex-row" : "flex-row",
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden bg-subtle", featured ? "aspect-[4/5] sm:aspect-auto sm:w-[38%]" : "w-32 sm:w-44")}>
        <Image src={item.img.src} alt={item.img.alt} fill sizes={featured ? "(min-width: 640px) 40vw, 100vw" : "176px"} className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105" />
      </div>
      <div className={cn("flex flex-1 flex-col", featured ? "p-7 sm:p-12" : "p-5 sm:p-6")}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 font-medium text-gold">{item.tag}</span>
          <span className="text-ink-mute">{item.date}</span>
        </div>
        <h3 className={cn("mt-3 font-display tracking-tight text-ink text-balance", featured ? "text-3xl md:text-5xl" : "text-xl")}>{item.title}</h3>
        <p className={cn("mt-2 leading-relaxed text-ink-soft", featured ? "text-lg md:mt-4" : "line-clamp-2 text-sm")}>{item.body}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-navy">
          View on Instagram <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}
