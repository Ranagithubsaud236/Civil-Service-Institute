"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { IntroProvider } from "./Intro";
import { Cursor } from "./Cursor";

/** Honours the OS "reduce motion" setting and adds Lenis smooth scrolling when motion is allowed. */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // anchors: in-page links glide to their section, offset for the pinned header
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -88 } });
    return () => lenis.destroy();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <IntroProvider>{children}</IntroProvider>
      <Cursor />
    </MotionConfig>
  );
}
