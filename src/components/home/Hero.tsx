"use client";

import { Button } from "@/components/ui/Button";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { IntakeCard } from "./IntakeCard";

const groups = ["PAS", "PSP", "FSP", "IRS", "PMS"];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="grid-fade absolute inset-0 -z-10" />
      <div className="absolute -top-40 right-[-10%] -z-10 size-[560px] rounded-full bg-[radial-gradient(circle,rgba(11,58,104,0.10),transparent_65%)]" />
      <div className="absolute top-[20%] left-[-12%] -z-10 size-[360px] rounded-full bg-[radial-gradient(circle,rgba(169,124,47,0.08),transparent_65%)]" />

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20 [&>*]:min-w-0">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-[13px] text-ink-soft ring-1 ring-line">
              <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium text-gold">New</span>
              Admissions open for CSS 2027 &amp; PMS Punjab
            </span>
          </Reveal>

          <h1 className="mt-7 font-display text-[2.9rem] leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.6rem]">
            <LineReveal
              delay={0.1}
              lines={[
                "Prepare like an aspirant.",
                <>
                  Think like an <em className="text-navy">officer.</em>
                </>,
              ]}
            />
          </h1>

          <Reveal delay={0.35}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
              Rawalpindi&apos;s dedicated academy for CSS, PMS and federal competitive examinations — mentored by serving and retired civil servants, assessed line by line by veteran FPSC-pattern evaluators.
            </p>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="#contact">Attend a free orientation</Button>
              <Button href="#programmes" variant="secondary" arrow={false}>Explore programmes</Button>
            </div>
          </Reveal>

          <Reveal delay={0.55}>
            <div className="mt-12 flex items-center gap-4 border-t border-line pt-6">
              <div className="flex -space-x-2">
                {groups.map((g) => (
                  <span key={g} className="grid size-9 place-items-center rounded-full bg-white text-[10px] font-semibold tracking-wide text-navy ring-2 ring-canvas [box-shadow:0_0_0_1px_var(--color-line)]">
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-snug text-ink-mute">
                Mentors from <span className="text-ink">five occupational groups</span>
                <br className="hidden sm:block" /> teach every batch.
              </p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal delay={0.3} y={30}>
            <IntakeCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
