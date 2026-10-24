import { cacheLife } from "next/cache";
import { decode, formatDate, tag, type Story } from "./bbc";

const FEED = "https://www.dawn.com/feeds/pakistan";

/** First paragraph of Dawn's HTML description, as plain text, trimmed to a sentence or two. */
function summary(html: string) {
  const first = decode(html).match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? decode(html);
  const text = first.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text.length > 220 ? `${text.slice(0, 217).replace(/\s+\S*$/, "")}…` : text;
}

/**
 * Latest Pakistan stories from Dawn's RSS feed, refreshed hourly. Returns an empty list when the
 * feed can't be reached, so the page still renders.
 */
export async function getDawnNews(limit = 9): Promise<Story[]> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(FEED, { headers: { "User-Agent": "Mozilla/5.0 (CSI-website)" } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item[\s\S]*?<\/item>/g)].slice(0, limit).map(([item]) => ({
      title: decode(tag(item, "title")),
      summary: summary(tag(item, "description")),
      link: decode(tag(item, "link")),
      date: formatDate(tag(item, "pubDate")),
      img: item.match(/<media:content[^>]*url="([^"]+)"/)?.[1],
    }));
  } catch {
    return [];
  }
}
