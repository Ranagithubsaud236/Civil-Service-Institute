import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { site } from "@/data/site";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with admissions on WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-3.5 text-white transition-all duration-300 ease-out-soft hover:px-5"
    >
      <WhatsAppIcon className="-mx-1 size-9" />
      <span className="max-w-0 overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out-soft group-hover:max-w-40">
        Admissions desk
      </span>
    </a>
  );
}
