/** Full-colour icons in the crest's blue and gold, drawn to sit beside the real YouTube logo. */

type IconProps = { className?: string };

const BLUE = "#0b4f8c";
const DEEP = "#083d6e";
const GOLD = "#c9963f";

/** Admission form on a clipboard, with a gold tick. */
export function AdmissionsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="8" y="7" width="32" height="38" rx="5" fill={BLUE} />
      <rect x="12" y="13" width="24" height="28" rx="2.5" fill="#fff" />
      <rect x="17" y="4" width="14" height="7" rx="3" fill={GOLD} />
      <rect x="16" y="19" width="16" height="2.6" rx="1.3" fill="#c8d6e5" />
      <rect x="16" y="25" width="11" height="2.6" rx="1.3" fill="#c8d6e5" />
      <circle cx="30" cy="34" r="7" fill={GOLD} />
      <path d="m26.8 34 2.2 2.2 4.3-4.4" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Graduation cap with a gold tassel. */
export function ProgrammesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M12 23v9c0 3.6 5.4 6.5 12 6.5s12-2.9 12-6.5v-9l-12 6Z" fill={DEEP} />
      <path d="M24 8 2 19l22 11 22-11Z" fill={BLUE} />
      <path d="M24 15.5 8.5 20.6" fill="none" stroke="#3d78b5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M40 22v11" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M37 33h6l-1 7h-4Z" fill={GOLD} />
      <circle cx="24" cy="19" r="2.2" fill={GOLD} />
    </svg>
  );
}

/** A stack of three books, the top one gold. */
export function PublicationsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="6" y="34" width="36" height="9" rx="2" fill={DEEP} />
      <rect x="9" y="36.5" width="30" height="1.8" rx=".9" fill="#ffffff55" />
      <rect x="9" y="24" width="32" height="9" rx="2" fill={BLUE} transform="rotate(-3 25 28.5)" />
      <rect x="12" y="26.4" width="26" height="1.8" rx=".9" fill="#ffffff55" transform="rotate(-3 25 28.5)" />
      <rect x="10" y="12" width="28" height="11" rx="2" fill={GOLD} transform="rotate(4 24 17.5)" />
      <rect x="14" y="15.6" width="12" height="2.4" rx="1.2" fill="#fff" transform="rotate(4 24 17.5)" />
      <path d="M32 11.6v9.6l2.2-1.8 2.2 1.8v-9.4Z" fill={DEEP} transform="rotate(4 24 17.5)" />
    </svg>
  );
}
