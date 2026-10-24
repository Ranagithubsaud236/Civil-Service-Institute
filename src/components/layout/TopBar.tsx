import { CirclePlay, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";

/** The thin contact strip above the header, as on most academy websites. Scrolls away. */
export function TopBar() {
  return (
    <div className="bg-navy-deep text-[13px] text-white/75">
      <div className="container-page flex h-10 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
            <Phone className="size-3.5 text-gold-light" /> {site.phone}
          </a>
          <span className="hidden items-center gap-1.5 md:flex">
            <MapPin className="size-3.5 text-gold-light" /> {site.address} · Online across Pakistan
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 lg:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-gold-light" />
            Admissions open · CSS 2027 &amp; PMS Punjab
          </span>
          <span className="hidden h-4 w-px bg-white/15 lg:block" />
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-white">
            <InstagramIcon />
          </a>
          <a href={site.youtube.url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-white">
            <CirclePlay className="size-4" />
          </a>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white transition-colors hover:bg-white/20">
            <MessageCircle className="size-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
