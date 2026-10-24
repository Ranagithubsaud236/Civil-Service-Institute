import { BookOpen, ChevronUp, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { publicationsWhatsapp } from "@/data/media";
import { Logo } from "@/components/ui/Logo";
import { InstagramGlyph, WhatsAppGlyph, YouTubeGlyph } from "@/components/ui/BrandIcons";

const quickLinks = [
  { label: "Home", href: "#top" },
  { label: "Programmes", href: "#programmes" },
  { label: "Faculty", href: "#faculty" },
  { label: "Stars of CSI", href: "#stars" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
  { label: "Apply Now", href: "#contact" },
];

const follow = [
  { label: "Instagram", href: site.instagram.url, Icon: InstagramGlyph },
  { label: "YouTube", href: site.youtube.url, Icon: YouTubeGlyph },
  { label: "WhatsApp", href: `https://wa.me/${site.whatsapp}`, Icon: WhatsAppGlyph },
];

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;
const row = "flex items-center gap-3 text-white/85 transition-colors hover:text-white";
const icon = "size-[18px] shrink-0 text-gold-light";

/** Two-tier footer: four columns on deep blue, then a lighter bar with legal links and back-to-top. */
export function Footer() {
  return (
    <footer className="text-white">
      <div className="bg-navy-deep">
        <div className="container-page grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr] lg:py-20">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-[15px] leading-[1.7] text-white/80">
              Civil Services Institute prepares aspirants for CSS, PMS and other competitive examinations, mentored by Dr. Sassi Malik Sher — classes in Rawalpindi and live online across Pakistan.
            </p>
          </div>

          <FooterCol title="Quick Links">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={`group ${row}`}>
                  <span className="size-2.5 shrink-0 rounded-full border-2 border-gold-light transition-colors group-hover:bg-gold-light" />
                  {l.label}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Follow Us">
            {follow.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={row}>
                  <Icon className={icon} />
                  {label}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Contact Us">
            <li>
              <a href={tel(site.phone)} className={row}>
                <Phone className={icon} /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className={row}>
                <WhatsAppGlyph className={icon} /> WhatsApp admissions
              </a>
            </li>
            <li>
              <a href={tel(publicationsWhatsapp)} className={row}>
                <BookOpen className={icon} /> Books: {publicationsWhatsapp}
              </a>
            </li>
            <li>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className={row}>
                <InstagramGlyph className={icon} /> {site.instagram.handle}
              </a>
            </li>
            <li className="flex items-center gap-3 text-white/85">
              <MapPin className={icon} /> {site.address} · Online
            </li>
          </FooterCol>
        </div>
      </div>

      <div className="bg-navy">
        <div className="container-page relative flex flex-col items-center gap-3 pt-6 pb-24 text-center sm:pb-6">
          <nav aria-label="Legal" className="flex items-center gap-4 text-[15px] text-white/90">
            {/* pages to be added; visual only in the demo */}
            <button type="button" className="transition-colors hover:text-gold-light">Privacy Policy</button>
            <span aria-hidden className="size-1.5 bg-gold-light" />
            <button type="button" className="transition-colors hover:text-gold-light">Terms and Conditions</button>
          </nav>
          <p className="text-sm text-white/75">
            All Rights Reserved © {site.established + 2} {site.name}, Rawalpindi · Not affiliated with FPSC or PPSC
          </p>
          <a
            href="#top"
            aria-label="Back to top"
            className="absolute top-1/2 right-28 hidden size-12 -translate-y-1/2 place-items-center rounded-lg bg-navy-deep text-white transition-colors hover:bg-gold-light hover:text-navy-deep sm:grid"
          >
            <ChevronUp className="size-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gold-light">{title}</h3>
      <ul className="space-y-3.5 text-[15px]">{children}</ul>
    </div>
  );
}
