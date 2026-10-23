"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown, Loader2, MapPin, Phone } from "lucide-react";
import { programmes } from "@/data/programmes";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";

const ease = [0.22, 1, 0.36, 1] as const;

/** Demo enquiry form: nothing is sent, it simulates a short request and shows a confirmation. */
export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName(String(new FormData(e.currentTarget).get("name") ?? "").split(" ")[0]);
    setState("sending");
    setTimeout(() => setState("done"), 1100);
  };

  return (
    <section id="contact" className="container-page pb-24 lg:pb-32">
      <Reveal>
        <div className="grid overflow-hidden rounded-[32px] bg-navy-deep lg:grid-cols-[1fr_1.1fr]">
          <div className="relative p-8 text-white sm:p-12 lg:p-14">
            <Parallax offset={-70} className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(217,184,119,0.18),transparent_70%)]" />
            <Parallax offset={90} className="pointer-events-none absolute -right-20 -bottom-28 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_70%)]" />
            <p className="eyebrow relative text-gold-light">Free orientation · Sunday, 11:00 AM</p>
            <h2 className="relative mt-5 font-display text-4xl leading-[1.08] tracking-tight text-balance md:text-5xl">Start your preparation with a conversation.</h2>
            <p className="relative mt-5 max-w-md leading-relaxed text-white/60">
              Reserve a seat at our next orientation seminar or request a call from the admissions desk. We will help you choose the right batch and optionals.
            </p>
            <ul className="relative mt-10 space-y-4 text-sm text-white/75">
              <li className="flex items-center gap-3"><MapPin className="size-4 text-white/40" />{site.address}</li>
              <li className="flex items-center gap-3"><Phone className="size-4 text-white/40" />{site.phone}</li>
            </ul>
          </div>

          <div className="m-2 rounded-[26px] bg-white p-7 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {state === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="grid h-full min-h-[22rem] place-items-center text-center">
                  <div>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }} className="mx-auto grid size-14 place-items-center rounded-full bg-gold-soft text-gold">
                      <CheckCircle2 className="size-7" />
                    </motion.span>
                    <h3 className="mt-6 font-display text-3xl tracking-tight text-ink">Thank you{name ? `, ${name}` : ""}.</h3>
                    <p className="mx-auto mt-3 max-w-xs text-ink-soft">Your seat request is received. Our admissions desk will call you within one working day.</p>
                    <button onClick={() => setState("idle")} className="mt-8 text-sm font-medium text-navy underline-offset-4 hover:underline">Send another request</button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-5">
                  <Field label="Full name" name="name" placeholder="e.g. Ayesha Khan" autoComplete="name" />
                  <Field label="Phone / WhatsApp" name="phone" type="tel" placeholder="03xx xxxxxxx" autoComplete="tel" />
                  <div>
                    <label htmlFor="programme" className="text-sm font-medium text-ink">Programme of interest</label>
                    <div className="relative mt-2">
                      <select id="programme" name="programme" className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-subtle pr-10 pl-4 text-[15px] text-ink ring-1 ring-transparent transition-all duration-200 outline-none hover:ring-line focus:bg-white focus:ring-navy">
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
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-navy text-sm font-medium text-white transition-all duration-300 ease-out-soft hover:bg-navy-deep active:scale-[0.99] disabled:opacity-80"
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
        </div>
      </Reveal>
    </section>
  );
}

function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">{label}</label>
      <input
        id={name}
        name={name}
        required
        className="mt-2 h-12 w-full rounded-xl bg-subtle px-4 text-[15px] text-ink ring-1 ring-transparent transition-all duration-200 outline-none placeholder:text-ink-mute/70 hover:ring-line focus:bg-white focus:ring-navy"
        {...rest}
      />
    </div>
  );
}
