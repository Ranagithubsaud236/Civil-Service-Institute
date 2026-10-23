"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/site";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

/** Reads `data-theme` from the section currently behind the header. */
function themeUnderHeader(): "dark" | "light" {
  const el = document.elementsFromPoint(window.innerWidth / 2, 44).find((n) => !n.closest("header"));
  return el?.closest<HTMLElement>("[data-theme]")?.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Demo header: only Home exists, so the other tabs are shown for the pitch
 * but intentionally do nothing when clicked. The header stays pinned and
 * switches between light and dark glass to match the section beneath it.
 */
export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  // the page opens on the dark hero; afterwards the theme follows the section under the header
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    setTheme(themeUnderHeader());
  });

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

  const dark = theme === "dark" && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={cn(
          "relative mx-auto flex max-w-[76rem] items-center justify-between overflow-hidden rounded-2xl px-3 py-2 transition-all duration-500 ease-out-soft sm:px-5 sm:py-2.5",
          !scrolled && !open && "bg-transparent",
          (scrolled || open) && (dark ? "bg-forest-950/70 ring-1 ring-ivory/10 backdrop-blur-xl" : "bg-paper/85 shadow-[0_8px_30px_-12px_rgba(19,33,26,0.2)] ring-1 ring-line backdrop-blur-xl"),
        )}
      >
        <Logo light={dark} />

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((label) => {
            const active = label === "Home";
            return (
              <li key={label}>
                <button
                  type="button"
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative px-3.5 py-2 text-sm transition-colors duration-300",
                    dark ? (active ? "text-ivory" : "text-ivory/65 hover:text-ivory") : active ? "font-medium text-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {label}
                  {/* underline grows from the centre on hover; always drawn for the active tab */}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 bottom-1 h-px origin-center transition-transform duration-300 ease-out-soft",
                      dark ? "bg-brass-light" : "bg-brass",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href="#begin" variant={dark ? "brass" : "forest"} className="h-10 px-5">Begin your journey</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn("grid size-11 place-items-center rounded-xl ring-1 transition-colors lg:hidden", dark ? "text-ivory ring-ivory/20 hover:bg-ivory/10" : "text-ink ring-line hover:bg-ivory-200")}
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
          className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left transition-opacity duration-300", dark ? "bg-brass-light/80" : "bg-brass", scrolled ? "opacity-100" : "opacity-0")}
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
            className="fixed inset-0 -z-10 bg-forest-950/40 backdrop-blur-[2px] lg:hidden"
          />
        )}
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className="mx-auto mt-2 max-w-[76rem] origin-top rounded-2xl bg-paper p-3 shadow-xl ring-1 ring-line lg:hidden"
          >
            {nav.map((label, i) => (
              <motion.button
                type="button"
                key={label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3, ease }}
                onClick={() => setOpen(false)}
                className={cn("flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base transition-colors hover:bg-ivory-200", label === "Home" ? "font-medium text-ink" : "text-ink-soft")}
              >
                {label}
                {label === "Home" && <span className="size-1.5 rounded-full bg-brass" />}
              </motion.button>
            ))}
            <div onClick={() => setOpen(false)}>
              <Button href="#begin" variant="forest" className="mt-2 w-full justify-center">Begin your journey</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
