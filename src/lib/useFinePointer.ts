"use client";

import { useSyncExternalStore } from "react";

const query = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * True on mouse/trackpad devices that allow motion. Cursor-driven effects (magnetic buttons,
 * tilt, pointer parallax) use it so touch screens get the simpler, swipe-first experience.
 */
export function useFinePointer() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
