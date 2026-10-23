"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { MoveHorizontal } from "lucide-react";

/** Shared ground and hills so both scenes line up exactly. */
function Land({ after }: { after?: boolean }) {
  return (
    <>
      <path d="M0 250 C 140 200 260 230 400 205 S 650 190 800 220 V450 H0 Z" fill={after ? "#7fa36b" : "#c8b48a"} />
      <path d="M0 300 C 200 280 420 300 800 285 V450 H0 Z" fill={after ? "#5f8a52" : "#b59c6c"} />
    </>
  );
}

function Before() {
  return (
    <svg viewBox="0 0 800 450" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="800" height="450" fill="#e3d3ad" />
      <circle cx="640" cy="90" r="40" fill="#f0dfb5" />
      <Land />
      {/* dirt road with potholes */}
      <path d="M330 450 L390 300 L430 300 L520 450 Z" fill="#a88b5c" />
      <ellipse cx="420" cy="380" rx="22" ry="6" fill="#8a6f45" />
      <ellipse cx="455" cy="420" rx="16" ry="5" fill="#8a6f45" />
      {/* damaged school */}
      <rect x="110" y="215" width="170" height="95" fill="#b8a98d" />
      <path d="M100 218 L195 175 L230 190 L210 200 L290 218 Z" fill="#8f7e63" />
      <rect x="130" y="240" width="30" height="26" fill="#6e6250" />
      <path d="M130 240 L160 266 M160 240 L130 266" stroke="#4d4436" strokeWidth="2" />
      <rect x="230" y="240" width="30" height="26" fill="#6e6250" />
      <rect x="182" y="262" width="26" height="48" fill="#5b5142" />
      <path d="M250 215 L262 240 L255 262" stroke="#4d4436" strokeWidth="2" fill="none" />
      {/* leaning pole, dead wires */}
      <path d="M600 310 L585 180" stroke="#6b5a40" strokeWidth="6" />
      <path d="M585 190 Q 650 230 700 215" stroke="#6b5a40" strokeWidth="1.5" fill="none" />
      {/* bare tree */}
      <path d="M690 310 L690 250 M690 265 L670 235 M690 255 L712 228 M690 280 L705 262" stroke="#7a6446" strokeWidth="5" strokeLinecap="round" />
      <text x="24" y="40" className="fill-[#4d4436] font-sans text-[18px] font-semibold tracking-[0.2em]">BEFORE</text>
    </svg>
  );
}

function After() {
  return (
    <svg viewBox="0 0 800 450" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e2bb" />
          <stop offset="100%" stopColor="#f8efe0" />
        </linearGradient>
        <radialGradient id="lamp">
          <stop offset="0%" stopColor="#ffe9b0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffe9b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="url(#dawn)" />
      <circle cx="640" cy="90" r="40" fill="#f6c96b" />
      <Land after />
      {/* paved road with lane markings */}
      <path d="M330 450 L390 300 L430 300 L520 450 Z" fill="#4a4f52" />
      <path d="M410 305 L412 330 M414 350 L417 380 M420 400 L424 440" stroke="#f6f0e3" strokeWidth="3" />
      {/* rebuilt school */}
      <rect x="110" y="215" width="170" height="95" fill="#f1e6cf" />
      <path d="M100 218 L195 172 L290 218 Z" fill="#0a382b" />
      <rect x="130" y="240" width="30" height="26" fill="#9cc3d9" />
      <rect x="230" y="240" width="30" height="26" fill="#9cc3d9" />
      <rect x="182" y="262" width="26" height="48" fill="#0f4a39" />
      <text x="195" y="232" textAnchor="middle" className="fill-[#0a382b] font-sans text-[11px] font-semibold">SCHOOL</text>
      {/* clinic */}
      <rect x="540" y="235" width="110" height="75" fill="#fbf8f1" />
      <rect x="535" y="228" width="120" height="10" fill="#a07a3c" />
      <path d="M595 252 V278 M582 265 H608" stroke="#1f7a5c" strokeWidth="6" />
      <rect x="560" y="285" width="22" height="25" fill="#9cc3d9" />
      {/* water tank */}
      <rect x="300" y="170" width="44" height="34" rx="4" fill="#d5b678" />
      <path d="M306 204 L300 300 M338 204 L344 300" stroke="#a07a3c" strokeWidth="4" />
      {/* solar street lights */}
      {[360, 470].map((x) => (
        <g key={x}>
          <circle cx={x} cy="238" r="38" fill="url(#lamp)" />
          <path d={`M${x} 330 V238`} stroke="#3d4346" strokeWidth="4" />
          <rect x={x - 14} y="226" width="28" height="8" fill="#2f5d7a" />
          <circle cx={x} cy="240" r="5" fill="#fff4cf" />
        </g>
      ))}
      {/* trees */}
      {[690, 735, 60].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 315 V270`} stroke="#6b4f2e" strokeWidth="6" />
          <circle cx={x} cy={255 - i * 4} r={30 - i * 4} fill="#3f7a4a" />
          <circle cx={x - 12} cy={268 - i * 4} r={18} fill="#4d8c56" />
        </g>
      ))}
      <text x="776" y="40" textAnchor="end" className="fill-[#0a382b] font-sans text-[18px] font-semibold tracking-[0.2em]">AFTER</text>
    </svg>
  );
}

/** Drag to compare a community before and after better public services. */
export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const pos = useMotionValue(50);
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(pos, (v) => `${v}%`);
  const [value, setValue] = useState(50);
  const dragging = useRef(false);

  useMotionValueEvent(pos, "change", (v) => setValue(Math.round(v)));

  // a gentle one-time sweep hints that the divider can be dragged
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(pos, [50, 28, 72, 50], { duration: 2.4, ease: "easeInOut", delay: 0.4 });
    return () => c.stop();
  }, [inView, reduce, pos]);

  const setFrom = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div>
      <div
        ref={ref}
        data-cursor="Drag"
        className="relative aspect-[4/3] cursor-ew-resize touch-pan-y overflow-hidden rounded-[26px] ring-1 ring-line select-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brass sm:aspect-[16/9]"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFrom(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFrom(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
      >
        <After />
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <Before />
        </motion.div>
        <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 -translate-x-1/2">
          <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-ivory shadow-[0_0_12px_rgba(0,0,0,0.25)]" />
          <div className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory text-forest-800 shadow-lg ring-1 ring-line">
            <MoveHorizontal className="size-5" />
          </div>
        </motion.div>
        {/* keyboard and screen-reader control for the same divider */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => pos.set(+e.target.value)}
          aria-label="Compare before and after"
          className="absolute inset-x-0 bottom-0 h-full w-full cursor-ew-resize opacity-0"
          style={{ pointerEvents: "none" }}
        />
      </div>
      <p className="mt-3 text-xs text-ink-mute">Illustration for the demo — replace with real, verified photography of a community project.</p>
    </div>
  );
}
