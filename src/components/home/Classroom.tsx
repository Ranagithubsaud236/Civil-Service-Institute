import Image from "next/image";
import { photos } from "@/data/photos";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHeading } from "./SectionHeading";

type Photo = (typeof photos)[keyof typeof photos];

/** HD photo bento. Each image drifts inside its frame for depth; captions sit on a soft gradient. */
export function Classroom() {
  return (
    <section id="classroom" className="container-page py-24 lg:py-32">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Inside CSI"
          title="Long reading hours, honest debate, serious practice."
          intro="Small batches in Rawalpindi and live classes for aspirants across Pakistan."
        />
        <Reveal delay={0.15}>
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="group inline-flex shrink-0 items-center gap-4 rounded-2xl bg-white p-4 pr-6 ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_16px_40px_-20px_rgba(15,27,45,0.3)]">
            <span className="font-display text-4xl tracking-tight text-navy">{site.instagram.followers}</span>
            <span className="text-sm leading-snug text-ink-soft">
              aspirants follow CSI
              <br />
              <span className="text-ink-mute group-hover:text-navy">{site.instagram.handle}</span>
            </span>
          </a>
        </Reveal>
      </div>

      <div className="mt-14 grid auto-rows-[220px] gap-4 sm:auto-rows-[260px] md:grid-cols-12">
        <Tile photo={photos.writing} caption="Weekly written practice" className="md:col-span-6 md:row-span-2" />
        <Tile photo={photos.graduates} caption="The goal: allocation" className="md:col-span-6" delay={0.08} />
        <Tile photo={photos.pair} caption="Study circles" className="md:col-span-3" delay={0.14} />
        <Tile photo={photos.library} caption="Quiet reading hours" className="md:col-span-3" delay={0.2} />
      </div>
    </section>
  );
}

function Tile({ photo, caption, className, delay = 0 }: { photo: Photo; caption: string; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={cn("group relative overflow-hidden rounded-3xl bg-subtle", className)}>
      {/* taller than the frame so the drift never shows an edge */}
      <Parallax offset={-40} className="absolute -inset-y-12 inset-x-0">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-105"
        />
      </Parallax>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/70 to-transparent p-5 pt-16">
        <p className="text-sm font-medium text-white">{caption}</p>
      </div>
    </Reveal>
  );
}
