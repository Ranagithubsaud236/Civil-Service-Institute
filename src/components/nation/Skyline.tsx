"use client";

import { motion, type MotionValue } from "motion/react";

const ease = [0.65, 0, 0.35, 1] as const;

/** Stylised Islamabad skyline: Margalla Hills, Parliament, Pakistan Monument and Faisal Mosque. */
const landmarks = [
  // Pakistan Monument — petal blades
  "M268 300 Q 276 238 312 214 Q 300 252 304 300 Z",
  "M300 300 Q 312 226 352 202 Q 338 250 342 300 Z",
  "M338 300 Q 352 236 392 220 Q 376 258 378 300 Z",
  "M248 300 Q 250 262 274 246 Q 268 270 272 300 Z",
  // Parliament House — long colonnaded block with a raised centre
  "M470 300 V262 H520 V250 H610 V262 H662 V300 Z",
  // Faisal Mosque — concave tent and four minarets
  "M900 300 Q 962 282 982 176 Q 1002 282 1064 300 Z",
  "M860 300 V168 L864 150 L868 168 V300 Z",
  "M896 300 V178 L900 160 L904 178 V300 Z",
  "M1060 300 V178 L1064 160 L1068 178 V300 Z",
  "M1096 300 V168 L1100 150 L1104 168 V300 Z",
  // Centaurus-style towers
  "M1220 300 V196 L1236 186 V300 Z",
  "M1244 300 V176 L1262 164 V300 Z",
  "M1270 300 V200 L1286 190 V300 Z",
];

const columns = Array.from({ length: 13 }, (_, i) => 480 + i * 14);

type Props = { hillsY: MotionValue<number>; cityY: MotionValue<number>; hillsX?: MotionValue<number>; cityX?: MotionValue<number> };

/** Hills and landmarks sit on separate layers so scroll and cursor move them at different speeds. */
export function Skyline({ hillsY, cityY, hillsX, cityX }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34vh] min-h-56" aria-hidden>
      <motion.svg style={{ y: hillsY, x: hillsX }} viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="absolute inset-y-0 -inset-x-10 h-full w-[calc(100%+5rem)]">
        {/* Margalla Hills, far and near */}
        <motion.path
          d="M0 200 C 120 162 250 140 380 168 S 610 110 770 144 S 1030 104 1170 134 S 1370 112 1440 140 L1440 320 L0 320 Z"
          className="fill-navy-800/70 stroke-gold-light/30"
          strokeWidth={1}
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{ pathLength: { duration: 2.2, delay: 0.9, ease }, fillOpacity: { duration: 1.2, delay: 2.2 } }}
        />
        <motion.path
          d="M0 246 C 200 220 380 232 560 224 S 900 210 1100 228 S 1340 216 1440 226 V320 H0 Z"
          className="fill-navy-900"
          initial={{ fillOpacity: 0 }}
          animate={{ fillOpacity: 1 }}
          transition={{ duration: 1.2, delay: 2.4 }}
        />
      </motion.svg>

      <motion.svg style={{ y: cityY, x: cityX }} viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="absolute inset-y-0 -inset-x-10 h-full w-[calc(100%+5rem)]">
        {landmarks.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            className="fill-navy-950 stroke-gold-light/60"
            strokeWidth={1.2}
            strokeLinejoin="round"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{ pathLength: { duration: 1.6, delay: 1.4 + i * 0.06, ease }, fillOpacity: { duration: 1, delay: 2.6 + i * 0.04 } }}
          />
        ))}
        {columns.map((x, i) => (
          <motion.line key={x} x1={x} x2={x} y1={268} y2={300} className="stroke-gold-light/35" strokeWidth={1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 + i * 0.03 }} />
        ))}
        <rect x="0" y="298" width="1440" height="22" className="fill-navy-950" />
      </motion.svg>
    </div>
  );
}
