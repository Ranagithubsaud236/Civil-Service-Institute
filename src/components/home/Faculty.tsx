import { faculty } from "@/data/people";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHeading } from "./SectionHeading";

const initials = (name: string) =>
  name.replace(/^(Dr\.|Prof\.|Amb\.)\s*(\(R\)\s*)?/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");

/** Monogram portraits until the client provides faculty photos. */
export function Faculty() {
  return (
    <section id="faculty" className="container-page py-24 lg:py-32">
      <SectionHeading
        eyebrow="Mentorship council"
        title="Taught by people who have sat in the chair."
        intro="Serving and retired officers, and evaluators trained on FPSC examiner reports."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {faculty.map((m, i) => (
          <Parallax key={m.name} offset={{ base: 14, sm: i % 2 ? 45 : 15, lg: i % 3 === 1 ? 50 : 15 }} className="h-full">
          <Reveal className="h-full" delay={(i % 3) * 0.08}>
            <article tabIndex={0} className="group h-full rounded-3xl bg-white p-7 ring-1 ring-line transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(15,27,45,0.25)] hover:ring-ink/15 focus-visible:ring-ink/15">
              <div className="flex items-start justify-between">
                <span className="grid size-16 place-items-center rounded-2xl bg-subtle font-display text-2xl text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                  {initials(m.name)}
                </span>
                <span className="rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide text-ink-soft ring-1 ring-line">{m.group}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl tracking-tight text-ink">{m.name}</h3>
              <p className="mt-1 text-sm text-ink-mute">{m.title}</p>
              <p className="mt-4 text-sm font-medium text-gold">{m.subject}</p>

              {/* grid-rows trick animates to the bio's natural height */}
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out-soft group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] pointer-coarse:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="pt-3 text-sm leading-relaxed text-ink-soft opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">{m.bio}</p>
                </div>
              </div>
            </article>
          </Reveal>
          </Parallax>
        ))}
      </div>
    </section>
  );
}
