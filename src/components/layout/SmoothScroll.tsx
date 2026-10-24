"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth, inertial page scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger animations stay
 * in sync. Skipped for users who prefer reduced motion. Pauses while a menu or lightbox locks the body.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -96 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // menus and the gallery lightbox set body overflow:hidden; mirror that onto Lenis
    const lock = new MutationObserver(() => (document.body.style.overflow === "hidden" ? lenis.stop() : lenis.start()));
    lock.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      lock.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
