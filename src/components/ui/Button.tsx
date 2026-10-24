import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  secondary: "bg-surface text-ink ring-1 ring-line hover:ring-ink/25",
  light: "bg-white text-navy-deep hover:bg-gold-soft",
  // blue at rest, crest gold on hover
  apply: "bg-navy text-white hover:bg-gold-light hover:text-navy-deep",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  arrow?: boolean;
  className?: string;
};

/** Pill button. Only in-page anchors are used in the demo, so a plain <a> is enough. */
export function Button({ href, children, variant = "primary", arrow = true, className }: Props) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-all duration-300 ease-out-soft active:scale-[0.98]",
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
