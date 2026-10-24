import { getBbcNews } from "@/lib/bbc";
import { news as csiNews } from "@/data/media";
import { site } from "@/data/site";

type Item = { text: string; href: string; external?: boolean };

/**
 * Big scrolling headline band under the hero: CSI's own announcements first, then the latest
 * BBC World headlines. Pure CSS loop (the list is doubled); hovering pauses it.
 */
export async function NewsBand() {
  const world = await getBbcNews("world", 4);
  const items: Item[] = [
    { text: "Admissions open · CSS 2027 & PMS Punjab", href: "#contact" },
    ...csiNews.slice(0, 3).map((n) => ({ text: n.title, href: n.href, external: true })),
    { text: `WhatsApp ${site.phone}`, href: `https://wa.me/${site.whatsapp}`, external: true },
    ...world.map((s) => ({ text: `World: ${s.title}`, href: s.link, external: true })),
  ];

  return (
    <section id="headlines" aria-label="Latest headlines" className="group overflow-hidden bg-navy-deep py-5 text-white sm:py-7">
      <div className="flex w-max animate-[ticker_80s_linear_infinite] items-center group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <li key={i} className="flex items-center">
                {i % 2 === 0 ? <StarBadge /> : <Squiggle />}
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="px-7 text-xl font-bold tracking-tight whitespace-nowrap uppercase transition-colors hover:text-gold-light sm:px-9 sm:text-[1.85rem]"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

/** Gold disc with a four-pointed star. */
function StarBadge() {
  return (
    <svg viewBox="0 0 60 60" className="size-11 shrink-0 sm:size-14" aria-hidden>
      <circle cx="30" cy="30" r="30" fill="var(--color-gold-light)" />
      <path d="M30 14c1.6 9.4 6.6 14.4 16 16-9.4 1.6-14.4 6.6-16 16-1.6-9.4-6.6-14.4-16-16 9.4-1.6 14.4-6.6 16-16Z" fill="var(--color-navy-deep)" />
    </svg>
  );
}

/** Hand-drawn squiggle that ends in an arrow. */
function Squiggle() {
  return (
    <svg viewBox="0 0 80 40" className="h-8 w-16 shrink-0 sm:h-10 sm:w-20" fill="none" stroke="var(--color-gold-light)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 22c8 0 9-14 15-14s2 26 9 26 4-12 12-12h38" />
      <path d="M68 13l9 9-9 9" />
    </svg>
  );
}
