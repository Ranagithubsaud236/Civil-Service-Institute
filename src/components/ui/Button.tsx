import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const variants = {
  brass: "bg-brass-light text-forest-950 hover:bg-[#e0c896] shadow-[0_10px_30px_-12px_rgba(214,187,133,0.7)]",
  forest: "bg-forest-800 text-ivory hover:bg-forest-900",
  outlineLight: "text-ivory ring-1 ring-ivory/30 hover:ring-ivory/70 hover:bg-ivory/5",
  outlineDark: "text-ink ring-1 ring-ink/20 hover:ring-ink/50 hover:bg-ink/[0.03]",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  arrow?: boolean;
  className?: string;
};

/** Pill button with a gold light sweep on hover. Only in-page anchors are used in the demo. */
export function Button({ href, children, variant = "brass", arrow = true, className }: Props) {
  return (
    <a
      href={href}
      className={cn(
        "sweep group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-all duration-300 ease-out-soft active:scale-[0.98]",
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <span className="relative size-4 overflow-hidden">
          <ArrowRight className="absolute inset-0 size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-5" />
          <ArrowRight className="absolute inset-0 size-4 -translate-x-5 transition-transform duration-300 ease-out-soft group-hover:translate-x-0" />
        </span>
      )}
    </a>
  );
}
