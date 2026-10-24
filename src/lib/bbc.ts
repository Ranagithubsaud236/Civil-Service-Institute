import { cacheLife } from "next/cache";

export type Story = { title: string; summary: string; link: string; date: string; img?: string };

const feeds = {
  world: "https://feeds.bbci.co.uk/news/world/rss.xml",
  asia: "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
  business: "https://feeds.bbci.co.uk/news/business/rss.xml",
};
export type Feed = keyof typeof feeds;

const tag = (xml: string, name: string) =>
  xml.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))?.[1].trim() ?? "";

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const formatDate = (d: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" }).format(new Date(d)) + " PKT";

/**
 * Latest stories from a BBC News RSS feed, refreshed hourly. Returns an empty list when the
 * feed can't be reached, so the page still renders.
 */
export async function getBbcNews(feed: Feed, limit = 9): Promise<Story[]> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(feeds[feed], { headers: { "User-Agent": "CSI-website/1.0" } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit).map(([, item]) => {
      const thumb = item.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1];
      return {
        title: decode(tag(item, "title")),
        summary: decode(tag(item, "description")),
        link: decode(tag(item, "link")).split("?")[0],
        date: formatDate(tag(item, "pubDate")),
        // the feed links 240px thumbnails; the same image is served at 976px
        img: thumb?.replace("/standard/240/", "/standard/976/"),
      };
    });
  } catch {
    return [];
  }
}
