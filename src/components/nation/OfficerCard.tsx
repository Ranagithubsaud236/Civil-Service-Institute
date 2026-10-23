"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ChevronDown, RotateCw } from "lucide-react";
import { groups } from "@/data/nation";
import { useFinePointer } from "@/lib/useFinePointer";
import { Crest } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Heading } from "./Heading";

const initials = (n: string) => n.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CSI";

/** A 7 × 7 pattern derived from the name — every visitor gets a different "seal". */
function seal(name: string) {
  let h = 2166136261;
  for (const c of name || "csi") h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Array.from({ length: 49 }, (_, i) => ((h >>> (i % 31)) ^ (i * 2654435761)) & 1);
}

/** "Picture yourself in service" — a playful aspirant pass with a holographic sheen and a 3D flip. */
export function OfficerCard() {
  const [name, setName] = useState("");
  const [group, setGroup] = useState(groups[0]);
  const [flipped, setFlipped] = useState(false);
  const fine = useFinePointer();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 160, damping: 18 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 160, damping: 18 });
  const flip = useSpring(0, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(() => rotY.get() + flip.get());
  const sheen = useTransform(() => `radial-gradient(circle at ${mx.get() * 100}% ${my.get() * 100}%, rgba(255,240,205,0.55), transparent 45%), linear-gradient(${110 + mx.get() * 60}deg, rgba(120,220,190,0.18), rgba(214,182,120,0.25), rgba(190,150,255,0.16), rgba(120,220,190,0.18))`);

  const display = name.trim() || "Your Name";
  const cells = seal(name);
  const toggle = () => {
    setFlipped((f) => !f);
    flip.set(flipped ? 0 : 180);
  };

  return (
    <section id="officer" data-theme="light" className="overflow-hidden bg-ivory-200 py-24 lg:py-32">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Heading eyebrow="Picture yourself in service" title="Write your name on the future." intro="Type your name and choose a group — your aspirant pass updates as you go. Click the card to turn it over." />
          <Reveal delay={0.1}>
            <div className="mt-10 grid max-w-md gap-5">
              <div>
                <label htmlFor="pass-name" className="text-sm font-medium">Your name</label>
                <input
                  id="pass-name"
                  value={name}
                  maxLength={28}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="mt-2 h-12 w-full rounded-xl bg-paper px-4 text-[15px] ring-1 ring-line transition-all duration-200 outline-none focus:ring-forest-700"
                />
              </div>
              <div>
                <label htmlFor="pass-group" className="text-sm font-medium">Dream service group</label>
                <div className="relative mt-2">
                  <select id="pass-group" value={group} onChange={(e) => setGroup(e.target.value)} className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-paper pr-10 pl-4 text-[15px] ring-1 ring-line transition-all duration-200 outline-none focus:ring-forest-700">
                    {groups.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-mute" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="flex justify-center [perspective:1400px]">
          <motion.button
            type="button"
            data-cursor="Flip"
            onClick={toggle}
            aria-label="Flip the aspirant pass"
            onPointerMove={
              fine
                ? (e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    mx.set((e.clientX - r.left) / r.width);
                    my.set((e.clientY - r.top) / r.height);
                  }
                : undefined
            }
            onPointerLeave={() => (mx.set(0.5), my.set(0.5))}
            style={{ rotateX: rotX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-[1.3] w-full max-w-[440px] text-left sm:aspect-[1.586]"
          >
            {/* front */}
            <div className="absolute inset-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-forest-700 via-forest-900 to-forest-950 p-6 text-ivory shadow-[0_40px_80px_-30px_rgba(3,21,15,0.7)] ring-1 ring-brass-light/30 [backface-visibility:hidden] sm:p-7">
              <motion.div style={{ background: sheen }} className="pointer-events-none absolute inset-0 mix-blend-screen" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Crest size={38} />
                  <div className="leading-tight">
                    <p className="text-[10px] tracking-[0.25em] text-brass-light uppercase">Civil Services Institute</p>
                    <p className="font-display text-sm text-ivory/80">Aspirant pass · CSS 2027</p>
                  </div>
                </div>
                <span className="hidden rounded-full bg-ivory/10 px-2.5 py-1 text-[10px] tracking-wider text-ivory/70 ring-1 ring-ivory/15 sm:inline">FUTURE OFFICER</span>
              </div>

              <div className="relative mt-5 flex items-end gap-5 sm:mt-7">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-ivory/10 font-display text-2xl text-brass-light ring-1 ring-brass-light/30 sm:size-24 sm:text-3xl">{initials(display)}</span>
                <div className="min-w-0 flex-1">
                  <motion.p key={display} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="truncate font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                    {display}
                  </motion.p>
                  <motion.p key={group} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="mt-1 truncate text-sm text-brass-light">
                    {group}
                  </motion.p>
                </div>
                <div className="grid shrink-0 grid-cols-7 gap-[2px] rounded-md bg-ivory/90 p-1.5" aria-hidden>
                  {cells.map((c, k) => (
                    <span key={k} className={`size-[5px] sm:size-[6px] ${c ? "bg-forest-950" : "bg-transparent"}`} />
                  ))}
                </div>
              </div>
              <p className="absolute bottom-4 left-6 text-[9px] tracking-wider text-ivory/35 uppercase sm:left-7">Not an official document</p>
            </div>

            {/* back */}
            <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[22px] bg-paper p-6 text-ink ring-1 ring-line [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-7">
              <p lang="ur" className="font-urdu text-2xl leading-loose text-forest-800">کام، کام اور صرف کام</p>
              <p className="font-display text-lg leading-snug text-ink-soft">&ldquo;Work, work and only work.&rdquo; — Quaid-e-Azam Muhammad Ali Jinnah</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-hand text-3xl leading-none text-forest-800">{display}</p>
                  <p className="mt-1 border-t border-ink/20 pt-1 text-[10px] tracking-wider text-ink-mute uppercase">Signature of the aspirant</p>
                </div>
                <Crest size={34} />
              </div>
            </div>
          </motion.button>
        </Reveal>
        <p className="-mt-8 flex items-center justify-center gap-2 text-xs text-ink-mute lg:col-start-2">
          <RotateCw className="size-3.5" /> Click the card to flip it
        </p>
      </div>
    </section>
  );
}
