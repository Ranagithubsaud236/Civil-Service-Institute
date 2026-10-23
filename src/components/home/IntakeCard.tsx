"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { CalendarDays, Clock3, MonitorSmartphone } from "lucide-react";
import { batches } from "@/data/people";
import { site } from "@/data/site";
import { Crest } from "@/components/ui/Logo";

const next = batches[0];
const filled = next.total - next.left;
// "MON 03 NOV" -> "03 Nov"
const [, day, month] = next.date.split(" ");
const startDate = `${day} ${month[0]}${month.slice(1).toLowerCase()}`;

function remaining() {
  const diff = Math.max(0, new Date(site.examDate).getTime() - Date.now());
  return { Days: Math.floor(diff / 864e5), Hours: Math.floor((diff / 36e5) % 24), Mins: Math.floor((diff / 6e4) % 60), Secs: Math.floor((diff / 1e3) % 60) };
}

/** Hero visual: the next intake, live seat count and exam countdown, with a gentle pointer tilt. */
export function IntakeCard() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div className="relative [perspective:1200px] sm:mb-16" onPointerMove={onMove} onPointerLeave={() => (mx.set(0), my.set(0))}>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-40px_rgba(15,27,45,0.35)] ring-1 ring-line sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crest size={36} />
            <span className="text-sm text-ink-mute">Next intake</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative size-1.5 rounded-full bg-gold" />
            </span>
            {next.status}
          </span>
        </div>

        <h3 className="mt-6 font-display text-3xl tracking-tight text-ink">{next.name}</h3>
        <p className="mt-1 text-sm text-ink-mute">{next.note}</p>

        <dl className="mt-6 grid grid-cols-3 gap-2 text-[13px] sm:gap-3 sm:text-sm">
          <Meta icon={CalendarDays} label="Starts" value={startDate} />
          <Meta icon={Clock3} label="Timing" value={next.time} />
          <Meta icon={MonitorSmartphone} label="Mode" value={next.mode} />
        </dl>

        <div className="mt-7">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-ink-soft">Seats reserved</span>
            <span className="tabular-nums text-ink">
              <span className="font-medium">{filled}</span>
              <span className="text-ink-mute"> / {next.total}</span>
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-subtle">
            <motion.div
              className="h-full rounded-full bg-navy"
              initial={{ width: 0 }}
              animate={{ width: `${(filled / next.total) * 100}%` }}
              transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-mute">Only {next.left} seats left in this batch</p>
        </div>

        <div className="mt-7 border-t border-line pt-6">
          <p className="text-sm text-ink-soft">Countdown to CSS 2027 written exam</p>
          <Countdown />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-20 left-6 hidden max-w-[16rem] rounded-2xl bg-white p-4 shadow-[0_20px_40px_-20px_rgba(15,27,45,0.3)] ring-1 ring-line sm:block lg:-left-8"
      >
        <p className="font-display text-2xl text-ink">
          28 <span className="text-ink-mute">→</span> <span className="text-navy">61</span>
        </p>
        <p className="mt-1 text-xs leading-snug text-ink-mute">Hamza Iqbal&apos;s essay score after the Essay &amp; Précis Clinic · FSP, CSS 2025</p>
      </motion.div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-subtle/70 p-2.5 sm:p-3">
      <Icon className="size-4 text-ink-mute" />
      <dt className="mt-2 text-xs text-ink-mute">{label}</dt>
      <dd className="mt-0.5 font-medium whitespace-nowrap text-ink">{value}</dd>
    </div>
  );
}

function Countdown() {
  const [t, setT] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    // computed client-side only, so server and client HTML match
    const tick = () => setT(remaining());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {(["Days", "Hours", "Mins", "Secs"] as const).map((k) => (
        <div key={k} className="rounded-xl ring-1 ring-line py-2.5 text-center">
          <div className="relative h-8 overflow-hidden font-display text-[1.7rem] leading-8 tabular-nums text-ink">
            {t ? (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={t[k]}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0"
                >
                  {String(t[k]).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="absolute inset-x-0 text-ink-mute">--</span>
            )}
          </div>
          <div className="text-[11px] text-ink-mute">{k}</div>
        </div>
      ))}
    </div>
  );
}
