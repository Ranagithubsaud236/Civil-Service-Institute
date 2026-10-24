import { BadgeCheck, CirclePlay, Plus } from "lucide-react";
import { facultySlots, leadFaculty } from "@/data/people";
import { site } from "@/data/site";
import { channel } from "@/data/media";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

/** One verified mentor, then open seats for the rest of the panel (no invented names). */
export function Faculty() {
  const m = leadFaculty;
  return (
    <section id="faculty" className="container-page py-24 lg:py-32">
      <SectionHeading
        eyebrow="Faculty"
        title="Taught by an officer who topped the paper."
        intro="Every name on this board is a real, serving civil servant. More of the panel will be announced as CSI confirms it."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <article className="relative h-full overflow-hidden rounded-3xl bg-navy-deep p-8 text-white sm:p-10">
            <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(217,184,119,0.22),transparent_70%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <span className="grid size-20 place-items-center rounded-2xl bg-white/10 font-display text-3xl text-gold-light ring-1 ring-white/15">SM</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
                <BadgeCheck className="size-3.5 text-gold-light" /> Verified from public profiles
              </span>
            </div>

            <h3 className="relative mt-8 font-display text-4xl tracking-tight">{m.name}</h3>
            <p className="relative mt-1.5 text-white/60">{m.role}</p>

            <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
              {m.facts.map((f, i) => (
                <Reveal key={f} delay={0.1 + i * 0.07}>
                  <div className="flex h-full gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm leading-snug text-white/85 ring-1 ring-white/10">
                    <span className="mt-0.5 font-display text-gold-light">0{i + 1}</span>
                    {f}
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="relative mt-8 max-w-xl leading-relaxed text-white/65">{m.bio}</p>
            <a href={site.youtube.url} target="_blank" rel="noopener noreferrer" className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-light underline-offset-4 hover:underline">
              <CirclePlay className="size-4" /> Watch the free lectures · {channel.subscribers} subscribers
            </a>
          </article>
        </Reveal>

        <div className="grid gap-5">
          {facultySlots.map((subject, i) => (
            <div key={subject}>
              <Reveal delay={0.1 + i * 0.08}>
                <article className="group flex items-center gap-5 rounded-3xl border-2 border-dashed border-line p-6 transition-colors duration-300 hover:border-navy/30 hover:bg-white">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-subtle text-ink-mute transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                    <Plus className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gold">{subject}</p>
                    <p className="mt-1 font-display text-xl tracking-tight text-ink">Faculty seat open</p>
                    <p className="mt-0.5 text-sm text-ink-mute">Name and photo to be confirmed by CSI</p>
                  </div>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
