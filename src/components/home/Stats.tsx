import { stats } from "@/data/site";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

export function Stats() {
  return (
    <section className="container-page">
      <div className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-line px-1 py-9 not-last:border-b sm:px-8 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:not-last:border-r lg:first:pl-0">
            <p className="font-display text-5xl tracking-tight text-ink">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-sm font-medium text-ink">{s.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-mute">{s.note}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
