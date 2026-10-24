import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with admissions on WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex h-12 items-center gap-2 rounded-full bg-[#1f7a52] px-3.5 text-white shadow-md transition-all duration-300 ease-out-soft hover:px-5"
    >
      <MessageCircle className="size-5" />
      <span className="max-w-0 overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out-soft group-hover:max-w-40">
        Admissions desk
      </span>
    </a>
  );
}
