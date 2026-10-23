"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/site";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Demo header: only Home exists, so the other tabs are shown for the pitch
 * but intentionally do nothing when clicked. The header stays pinned to the top at all times.
 */
export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // while the mobile menu is open: lock page scroll and let Escape close it
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={cn(
          "relative mx-auto flex max-w-[76rem] items-center justify-between overflow-hidden rounded-2xl px-3 py-2 sm:px-5 sm:py-2.5 transition-all duration-500 ease-out-soft",
          scrolled || open ? "bg-white/80 shadow-[0_8px_30px_-12px_rgba(15,27,45,0.18)] ring-1 ring-line backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <Logo />

        <ul className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
          {nav.map((label) => {
            const active = label === "Home";
            return (
              <li key={label}>
                <button
                  type="button"
                  onMouseEnter={() => setHovered(label)}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative rounded-full px-4 py-2 text-sm transition-colors duration-200", active ? "font-medium text-ink" : "text-ink-soft hover:text-ink")}
                >
                  {hovered === label && (
                    <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-subtle" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <span className="relative">{label}</span>
                  {active && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold" />}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href="#contact" className="h-10 px-5">Book a free seminar</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="grid size-11 place-items-center rounded-xl text-ink ring-1 ring-line transition-colors hover:bg-subtle lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left bg-navy/70 transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0")}
        />
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 bg-ink/25 backdrop-blur-[2px] lg:hidden"
          />
        )}
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className="mx-auto mt-2 max-w-[76rem] origin-top rounded-2xl bg-white p-3 shadow-xl ring-1 ring-line lg:hidden"
          >
            {nav.map((label, i) => (
              <motion.button
                type="button"
                key={label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3, ease }}
                onClick={() => setOpen(false)}
                className={cn("flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base transition-colors hover:bg-subtle", label === "Home" ? "font-medium text-ink" : "text-ink-soft")}
              >
                {label}
                {label === "Home" && <span className="size-1.5 rounded-full bg-gold" />}
              </motion.button>
            ))}
            <div onClick={() => setOpen(false)}>
              <Button href="#contact" className="mt-2 w-full justify-center">Book a free seminar</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
