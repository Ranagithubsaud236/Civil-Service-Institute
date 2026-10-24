import type { Metadata } from "next";
import { Caveat, Geist, Newsreader } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { CursorRing } from "@/components/layout/CursorRing";
import { ExtensionGuard } from "@/components/layout/ExtensionGuard";
import "./globals.css";

const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
// examiner's red-pen handwriting in the essay review
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Civil Services Institute Rawalpindi | CSS & PMS Academy",
  description:
    "Civil Services Institute Rawalpindi — a dedicated academy for CSS, PMS and federal competitive examinations, mentored by civil servants and veteran FPSC-pattern evaluators.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: extensions also add attributes to <html>/<body> themselves
    <html lang="en" data-scroll-behavior="smooth" className={`${newsreader.variable} ${geist.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <ExtensionGuard />
      </head>
      <body className="min-h-screen overflow-x-clip" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
          <CursorRing />
        </Providers>
      </body>
    </html>
  );
}
