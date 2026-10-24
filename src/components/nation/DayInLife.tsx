"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { BadgeCheck, Building2, CloudRainWind, FileSignature, Gavel, School, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/cn";

const moments = [
  { time: "07:00", title: "Morning briefing", body: "Overnight reports from police and rescue services — what happened, and what needs action today.", icon: BadgeCheck },
  { time: "09:30", title: "Open court", body: "A khuli kutchery: citizens bring land, water and pension complaints straight to the officer.", icon: Gavel },
  { time: "11:00", title: "Price control", body: "Unannounced market inspections to keep essential food prices fair.", icon: ShoppingBasket },
  { time: "13:30", title: "Schools & clinics", body: "Checking teacher attendance and medicine stocks in a rural tehsil.", icon: School },
  { time: "16:00", title: "Development review", body: "Roads, water schemes and flood walls — every department reports progress.", icon: Building2 },
  { time: "19:00", title: "Emergency room", body: "Heavy rain upstream: coordinating relief camps, machinery and evacuation routes.", icon: CloudRainWind },
  { time: "22:00", title: "Files & tomorrow", body: "Signing orders, answering the province and planning the next morning.", icon: FileSignature },
];

// sky colours across the day: dawn → noon → afternoon → sunset → night
const stops = [0, 0.25, 0.5, 0.72, 0.88, 1];
const skyTop = ["#f2c48d", "#cfe3e6", "#e9dcbc", "#d9874f", "#16324a", "#011a33"];
const skyBottom = ["#fbe7c6", "#f5f6f8", "#f6ebd2", "#f0c08a", "#023b6b", "#022b52"];

/** Scroll vertically, travel horizontally through a district officer's day as the sky turns from dawn to night. */
export function DayInLife() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  const x = useTransform(() => -p.get() * distance.get());
  const groundX = useTransform(() => -p.get() * distance.get() * 0.35);
  const top = useTransform(p, stops, skyTop);
  const bottom = useTransform(p, stops, skyBottom);
  const background = useTransform(() => `linear-gradient(to bottom, ${top.get()}, ${bottom.get()})`);
  // sun climbs and sets across the first three quarters; then the moon takes over
  const sunX = useTransform(p, [0, 0.8], ["8%", "88%"]);
  const sunY = useTransform(p, [0, 0.4, 0.8], ["70%", "8%", "72%"]);
  const sunOpacity = useTransform(p, [0.7, 0.82], [1, 0]);
  const moonOpacity = useTransform(p, [0.8, 0.92], [0, 1]);
  const [night, setNight] = useState(false);
  useMotionValueEvent(p, "change", (v) => setNight(v > 0.8));

  // horizontal travel = how much wider the track is than the screen
  useEffect(() => {
    const measure = () => track.current && distance.set(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <section ref={section} id="day" data-theme={night ? "dark" : "light"} className="relative h-[420vh]">
      <motion.div style={{ background }} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* sun and moon */}
        <motion.div style={{ left: sunX, top: sunY, opacity: sunOpacity }} className="absolute size-24 -translate-1/2 rounded-full bg-[radial-gradient(circle,#ffe3a1_0%,#f6c96b_45%,transparent_70%)] sm:size-32" />
        <motion.div style={{ opacity: moonOpacity }} className="absolute top-[14%] right-[12%] size-16 rounded-full bg-[#f5f6f8] shadow-[0_0_60px_12px_rgba(245,246,248,0.25)] sm:size-20">
          <span className="absolute top-2 left-4 size-4 rounded-full bg-[#d6dee8]" />
          <span className="absolute top-8 left-9 size-2.5 rounded-full bg-[#d6dee8]" />
        </motion.div>

        <div className={cn("container-page relative pt-28 transition-colors duration-700", night ? "text-ivory" : "text-ink")}>
          <p className={cn("eyebrow transition-colors duration-700", night ? "text-gold-light" : "text-gold")}>A day in the life</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">Fifteen hours as a Deputy Commissioner.</h2>
        </div>

        {/* distant hills and town move slower than the cards — depth while travelling sideways */}
        <motion.svg style={{ x: groundX }} viewBox="0 0 3000 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-[22vh] w-[300vw]" aria-hidden>
          <path d="M0 120 C 300 60 520 110 800 80 S 1300 40 1600 90 S 2200 50 2500 85 S 2850 70 3000 90 V200 H0 Z" className={cn("transition-colors duration-700", night ? "fill-navy-800" : "fill-[#c7b48a]")} />
          {Array.from({ length: 40 }, (_, k) => {
            const bx = 60 + k * 74, h = 30 + ((k * 37) % 50);
            return <rect key={k} x={bx} y={200 - h - 20} width={34 + ((k * 13) % 20)} height={h + 20} className={cn("transition-colors duration-700", night ? "fill-navy-900" : "fill-[#a8946a]")} />;
          })}
          {night && Array.from({ length: 40 }, (_, k) => <rect key={`w${k}`} x={70 + k * 74} y={200 - 30 - ((k * 37) % 50) / 2} width={5} height={5} className="fill-[#ffe3a1]" />)}
        </motion.svg>

        <motion.div ref={track} style={{ x }} className="absolute bottom-[14vh] left-0 flex gap-5 px-5 sm:gap-8 sm:px-8 lg:px-[max(2rem,calc((100vw-76rem)/2+2rem))]">
          {moments.map((m) => (
            <article
              key={m.time}
              className={cn(
                "w-[78vw] shrink-0 rounded-[26px] p-7 ring-1 backdrop-blur-md transition-colors duration-700 sm:w-[380px] sm:p-8",
                night ? "bg-navy-950/60 text-ivory ring-ivory/10" : "bg-paper/75 text-ink ring-ink/10",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-5xl tracking-tight tabular-nums">{m.time}</span>
                <m.icon className={cn("size-6 transition-colors duration-700", night ? "text-gold-light" : "text-gold")} />
              </div>
              <h3 className="mt-6 font-display text-2xl tracking-tight">{m.title}</h3>
              <p className={cn("mt-2 leading-relaxed transition-colors duration-700", night ? "text-ivory/65" : "text-ink-soft")}>{m.body}</p>
            </article>
          ))}
        </motion.div>

        {/* time-of-day rail */}
        <div className="absolute inset-x-0 bottom-5">
          <div className="container-page">
            <div className={cn("h-px transition-colors duration-700", night ? "bg-ivory/15" : "bg-ink/15")}>
              <motion.div style={{ scaleX: p }} className={cn("h-full origin-left", night ? "bg-gold-light" : "bg-gold")} />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
