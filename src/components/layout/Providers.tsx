"use client";

import { MotionConfig } from "motion/react";

/** Honours the OS "reduce motion" setting for every motion component. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
