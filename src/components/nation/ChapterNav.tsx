"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

const chapters = [
  { id: "top", label: "Opening" },
  { id: "about", label: "Service" },
  { id: "map", label: "The nation" },
  { id: "provinces", label: "Provinces" },
  { id: "history", label: "History" },
  { id: "paths", label: "Your path" },
  { id: "constellation", label: "Where to serve" },
  { id: "quiz", label: "Find your fit" },
  { id: "day", label: "A day in the life" },
  { id: "begin", label: "The journey" },
  { id: "shelf", label: "Optionals" },
  { id: "redpen", label: "Red pen" },
  { id: "torch", label: "Qualities" },
  { id: "impact", label: "Impact" },
  { id: "mentor", label: "Ask a mentor" },
  { id: "contact", label: "Begin" },
];

/**
 * Side rail of chapters (wide screens only). The current chapter stretches into a gold bar and
 * shows its name; hovering reveals the others. Uses blend mode so it reads on light and dark sections.
 */
export function ChapterNav() {
  const [active, setActive] = useState("top");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    // the chapter crossing the middle of the screen is the current one
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Chapters"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 mix-blend-difference xl:block"
    >
      <ul className="flex flex-col items-end gap-2.5">
        {chapters.map((c) => {
          const on = c.id === active;
          return (
            <li key={c.id}>
              <button onClick={() => go(c.id)} aria-current={on} aria-label={c.label} className="group flex items-center gap-3 py-0.5">
                <AnimatePresence>
                  {(hover || on) && (
                    <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: on ? 1 : 0.6, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }} className="text-[11px] whitespace-nowrap text-white">
                      {c.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className={cn("block h-[2px] rounded-full bg-white transition-all duration-300 ease-out-soft", on ? "w-8" : "w-3 opacity-50 group-hover:w-5 group-hover:opacity-90")} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
