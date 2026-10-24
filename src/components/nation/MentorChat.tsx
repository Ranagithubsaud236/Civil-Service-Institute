"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { Crest } from "@/components/ui/Logo";
import { Heading } from "./Heading";

const qa = [
  { q: "How many hours should I study each day?", a: "Consistency beats marathons. Six to eight focused hours, six days a week, with one full mock paper every Saturday will carry you further than twelve-hour days that burn you out by March." },
  { q: "Which optional subjects should I choose?", a: "Start from your strengths, not from rumours about 'scoring' subjects. Pick papers that overlap with the compulsories and that you can write 3,000 words on without notes. We'll check your plan against the FPSC rules." },
  { q: "Can I prepare while working full-time?", a: "Yes — many of our successful candidates did. Early mornings for reading, evenings for writing practice, and weekends for mock papers. The Executive Evening batch is designed around exactly that week." },
  { q: "How do I improve my English essay?", a: "Write, get marked, rewrite. A clear thesis, an honest outline and evidence in every paragraph matter more than vocabulary. Fifteen marked essays will change your score more than fifty books on style." },
];

type Msg = { from: "you" | "mentor"; text: string };

/** "Ask a mentor" — a scripted chat: pick a question, watch the reply being typed. */
export function MentorChat() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "mentor", text: "Assalam-o-Alaikum! I've mentored CSS aspirants for years. What would you like to know?" }]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<number[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const ask = (i: number) => {
    if (typing) return;
    setAsked((a) => [...a, i]);
    setMsgs((m) => [...m, { from: "you", text: qa[i].q }]);
    setTyping(true);
    const answer = qa[i].a;
    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { from: "mentor", text: "" }]);
        // type the reply out a few characters at a time
        let shown = 0;
        const step = () => {
          shown = Math.min(answer.length, shown + 3);
          setMsgs((m) => [...m.slice(0, -1), { from: "mentor", text: answer.slice(0, shown) }]);
          if (shown < answer.length) timers.current.push(window.setTimeout(step, 18));
        };
        step();
      }, 1100),
    );
  };

  return (
    <section id="mentor" data-theme="light" className="bg-paper py-24 lg:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Heading eyebrow="Ask a mentor" title="Questions every aspirant asks — answered in seconds." intro="Tap a question to hear how our mentors usually answer it. At the academy, you can ask them yourself." />

        <div className="overflow-hidden rounded-[28px] bg-ivory ring-1 ring-line shadow-[0_30px_60px_-34px_rgba(14,28,46,0.4)]">
          <div className="flex items-center gap-3 border-b border-line bg-paper px-5 py-4">
            <Crest size={36} />
            <div className="leading-tight">
              <p className="font-medium">CSI Mentor Desk</p>
              <p className="flex items-center gap-1.5 text-xs text-ink-mute">
                <span className="size-1.5 rounded-full bg-[#1f7a52]" /> Online
              </p>
            </div>
          </div>

          <div ref={scroller} className="h-[22rem] space-y-3 overflow-y-auto px-5 py-5" aria-live="polite">
            <AnimatePresence initial={false}>
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }} className={cn("flex", m.from === "you" ? "justify-end" : "justify-start")}>
                  <p className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed", m.from === "you" ? "rounded-br-md bg-navy-800 text-ivory" : "rounded-bl-md bg-paper text-ink ring-1 ring-line")}>
                    {m.text}
                    {m.from === "mentor" && i === msgs.length - 1 && m.text.length < (qa.find((x) => x.a.startsWith(m.text))?.a.length ?? 0) && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-ink/50 align-middle" />}
                  </p>
                </motion.div>
              ))}
              {typing && (
                <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                  <span className="flex gap-1 rounded-2xl rounded-bl-md bg-paper px-4 py-4 ring-1 ring-line">
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} className="size-1.5 rounded-full bg-ink-mute" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.12 }} />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-line bg-paper p-4">
            <div className="flex flex-wrap gap-2">
              {qa.map((x, i) => (
                <button
                  key={x.q}
                  onClick={() => ask(i)}
                  disabled={typing || asked.includes(i)}
                  className="rounded-full bg-ivory px-3.5 py-2 text-left text-xs text-ink ring-1 ring-line transition-all duration-200 hover:ring-navy-700 disabled:cursor-default disabled:opacity-40"
                >
                  {x.q}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-full bg-ivory px-4 py-2.5 text-sm text-ink-mute ring-1 ring-line">
              <span className="flex-1">Choose a question above…</span>
              <SendHorizontal className="size-4" />
            </div>
          </div>
        </div>
        <p className="-mt-6 text-center text-xs text-ink-mute lg:col-start-2">A scripted demo — real mentors answer in person and on WhatsApp.</p>
      </div>
    </section>
  );
}
