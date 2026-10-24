import { getBbcNews } from "@/lib/bbc";
import { getDawnNews } from "@/lib/dawn";
import { news as csiNews } from "@/data/media";
import { NewsBoard, type Entry } from "./NewsBoard";

/** Latest news: Pakistan from Dawn, world/Asia/business from BBC News (all hourly), plus CSI's own updates. */
export async function News() {
  const [pakistan, world, asia, business] = await Promise.all([getDawnNews(), getBbcNews("world"), getBbcNews("asia"), getBbcNews("business")]);
  const entries = (stories: typeof world, source: string): Entry[] =>
    stories.map((s) => ({ title: s.title, summary: s.summary, date: s.date, href: s.link, img: s.img ? { src: s.img, alt: s.title } : undefined, tag: source }));
  const bbc = (stories: typeof world) => entries(stories, "BBC News");

  return (
    <NewsBoard
      feeds={{
        Pakistan: entries(pakistan, "Dawn"),
        World: bbc(world),
        Asia: bbc(asia),
        Business: bbc(business),
        "CSI updates": csiNews.map((n) => ({ title: n.title, summary: n.body, date: n.date, href: n.href, img: n.img, tag: n.tag })),
      }}
    />
  );
}
