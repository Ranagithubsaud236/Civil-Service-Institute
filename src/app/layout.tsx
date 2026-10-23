import type { Metadata } from "next";
import { Geist, Newsreader, Noto_Nastaliq_Urdu } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { ExtensionGuard } from "@/components/layout/ExtensionGuard";
import "./globals.css";

const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
// decorative Urdu words only, so it is not preloaded
const nastaliq = Noto_Nastaliq_Urdu({ variable: "--font-nastaliq", subsets: ["arabic"], weight: ["400"], preload: false });

export const metadata: Metadata = {
  title: "Civil Services Institute | From Aspirant to Nation Builder",
  description:
    "Prepare for Pakistan's civil services — CSS and PMS career paths, examination stages, preparation journeys and the impact of public service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: extensions also add attributes to <html>/<body> themselves
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${nastaliq.variable}`} suppressHydrationWarning>
      <head>
        <ExtensionGuard />
      </head>
      <body className="min-h-screen overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
