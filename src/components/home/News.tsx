import { getBbcNews } from "@/lib/bbc";
import { news as csiNews } from "@/data/media";
import { NewsBoard, type Entry } from "./NewsBoard";

/** Latest news: BBC News feeds (refreshed hourly, for current affairs) plus CSI's own updates. */
export async function News() {
  const [world, asia, business] = await Promise.all([getBbcNews("world"), getBbcNews("asia"), getBbcNews("business")]);
  const bbc = (stories: typeof world): Entry[] =>
    stories.map((s) => ({ title: s.title, summary: s.summary, date: s.date, href: s.link, img: s.img ? { src: s.img, alt: s.title } : undefined, tag: "BBC News" }));

  return (
    <NewsBoard
      feeds={{
        World: bbc(world),
        Asia: bbc(asia),
        Business: bbc(business),
        "CSI updates": csiNews.map((n) => ({ title: n.title, summary: n.body, date: n.date, href: n.href, img: n.img, tag: n.tag })),
      }}
    />
  );
}
