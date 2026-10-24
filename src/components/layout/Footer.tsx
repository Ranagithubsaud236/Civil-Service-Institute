import { AtSign, Globe, MapPin, Phone } from "lucide-react";
import { nav, site } from "@/data/site";
import { programmes } from "@/data/programmes";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/65">
      <div className="container-page pt-20 pb-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1.2fr_1.4fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              Preparing aspirants for CSS, PMS and federal competitive examinations through mentorship by civil servants and rigorous FPSC-pattern evaluation.
            </p>
          </div>

          <FooterCol title="Institute">
            {nav.map((label) => (
              <FooterItem key={label}>{label}</FooterItem>
            ))}
          </FooterCol>

          <FooterCol title="Programmes">
            {programmes.slice(0, 5).map((p) => (
              <FooterItem key={p.slug}>{p.title}</FooterItem>
            ))}
          </FooterCol>

          <FooterCol title="Contact" className="col-span-2 lg:col-span-1">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-white/40" />{site.address}</li>
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-white/40" />{site.phone}</li>
            <li className="flex gap-3"><AtSign className="mt-0.5 size-4 shrink-0 text-white/40" /><a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">{site.instagram.handle}</a></li>
            <li className="flex gap-3"><Globe className="mt-0.5 size-4 shrink-0 text-white/40" />{site.hours}</li>
          </FooterCol>
        </div>


        <div className="mt-12 flex flex-col justify-between gap-2 border-t lg:mt-16 border-white/10 pt-8 text-xs text-white/45 md:flex-row">
          <span>© {site.established + 2} {site.name}, Rawalpindi</span>
          <span>Not affiliated with FPSC or PPSC</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-5 text-sm font-medium text-white">{title}</h3>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}

/** Footer links are visual only in the demo. */
function FooterItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <button type="button" className="text-left transition-colors duration-200 hover:text-white">{children}</button>
    </li>
  );
}
