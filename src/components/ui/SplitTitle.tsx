"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = { as?: "h2" | "h3"; className?: string; children: React.ReactNode };

/** A heading whose words rise out of masked lines when it scrolls into view (GSAP SplitText). */
export function SplitTitle({ as: Tag = "h2", className, children }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      SplitText.create(ref.current!, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 110,
            duration: 1,
            stagger: 0.045,
            ease: "power4.out",
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          }),
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
