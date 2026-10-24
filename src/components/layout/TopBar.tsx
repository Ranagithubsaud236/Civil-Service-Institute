import { MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { SocialLinks } from "@/components/ui/BrandIcons";

/** The thin contact strip above the header, as on most academy websites. Scrolls away. */
export function TopBar() {
  return (
    <div className="bg-navy-deep text-[13px] text-white/80">
      <div className="container-page flex h-11 items-center justify-between gap-4">
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
            <span className="size-1.5 rounded-full bg-gold-light" />
            Admissions open · CSS 2027 &amp; PMS Punjab
          </span>
          <span className="hidden h-4 w-px bg-white/15 lg:block" />
          <SocialLinks size="sm" />
        </div>
      </div>
    </div>
  );
}
