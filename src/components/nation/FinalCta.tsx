"use client";

import { useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { programmes } from "@/data/programmes";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { Contours } from "./Contours";

const ease = [0.22, 1, 0.36, 1] as const;

/** Final call to action with a demo enquiry form — nothing is sent, it simulates a request. */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  // the closing scene opens out of a circle rising from the bottom of the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 15%"] });
  const clipPath = useTransform(scrollYProgress, (v) => (reduce ? "none" : `circle(${(12 + v * 140).toFixed(1)}% at 50% 100%)`));
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName(String(new FormData(e.currentTarget).get("name") ?? "").split(" ")[0]);
    setState("sending");
    setTimeout(() => setState("done"), 1100);
  };

  return (
    <motion.section ref={ref} id="contact" data-theme="dark" style={{ clipPath }} className="relative isolate overflow-hidden bg-forest-900 py-24 text-ivory lg:py-36">
      <div className="absolute inset-0 -z-10 text-brass-light/15">{inView && <Contours cx={720} cy={980} count={14} start={80} step={52} className="absolute inset-0 size-full" />}</div>
      <Parallax offset={{ base: 30, lg: 90 }} aria-hidden className="pointer-events-none absolute -top-6 left-1/2 -z-10 -translate-x-1/2 select-none font-urdu text-[10rem] leading-none text-ivory/[0.04] sm:text-[16rem]">
        <span lang="ur">کل</span>
      </Parallax>

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow text-brass-light">Free orientation · Sunday, 11:00 AM</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.2rem]">
              Shape a better <em className="text-brass-light">tomorrow.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ivory/65">
              Reserve a seat at the next orientation seminar. Our mentors will help you choose your path, your optionals and the batch that fits your life.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-[28px] bg-paper p-7 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {state === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="grid min-h-[22rem] place-items-center text-center">
                  <div>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }} className="mx-auto grid size-14 place-items-center rounded-full bg-brass-soft text-brass">
                      <CheckCircle2 className="size-7" />
                    </motion.span>
                    <h3 className="mt-6 font-display text-3xl tracking-tight">Thank you{name ? `, ${name}` : ""}.</h3>
                    <p className="mx-auto mt-3 max-w-xs text-ink-soft">Your seat request is received. Our admissions desk will call you within one working day.</p>
                    <button onClick={() => setState("idle")} className="mt-8 text-sm font-medium text-forest-800 underline-offset-4 hover:underline">Send another request</button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                  <Field label="Full name" name="name" placeholder="e.g. Ayesha Khan" autoComplete="name" />
                  <Field label="Phone / WhatsApp" name="phone" type="tel" placeholder="03xx xxxxxxx" autoComplete="tel" />
                  <div>
                    <label htmlFor="programme" className="text-sm font-medium">Programme of interest</label>
                    <div className="relative mt-2">
                      <select id="programme" name="programme" className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-ivory pr-10 pl-4 text-[15px] ring-1 ring-transparent transition-all duration-200 outline-none hover:ring-line focus:bg-white focus:ring-forest-700">
                        {programmes.map((p) => (
                          <option key={p.slug}>{p.title}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-mute" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="sweep flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest-800 text-sm font-medium text-ivory transition-all duration-300 ease-out-soft hover:bg-forest-900 active:scale-[0.99] disabled:opacity-80"
                  >
                    {state === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      "Reserve my seat"
                    )}
                  </button>
                  <p className="text-center text-xs text-ink-mute">Three-day trial with full refund on every batch.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </motion.section>
  );
}

function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        required
        className="mt-2 h-12 w-full rounded-xl bg-ivory px-4 text-[15px] ring-1 ring-transparent transition-all duration-200 outline-none placeholder:text-ink-mute/70 hover:ring-line focus:bg-white focus:ring-forest-700"
        {...rest}
      />
    </div>
  );
}
