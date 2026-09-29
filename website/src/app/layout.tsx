import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { AnnouncementBar, SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ChatProvider, ChatWidget } from "@/components/site/chat";
import { JsonLd } from "@/components/site/json-ld";
import { MotionProvider } from "@/components/site/motion";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["700"], variable: "--font-inter-tight" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Scikit | Web Design & Software Development Melbourne",
  description: site.description,
  applicationName: site.name,
  // Each page sets its own canonical, Open Graph and Twitter tags via pageMeta() in src/lib/seo.ts.
};

const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  logo: `${site.url}/logos/icon-dark.svg`,
  areaServed: { "@type": "Country", name: "Australia" },
  ...(site.email && { email: site.email }),
  ...(site.phone && { telephone: site.phone }),
  address: {
    "@type": "PostalAddress",
    ...(site.street && { streetAddress: site.street }),
    addressLocality: site.suburb,
    addressRegion: site.state,
    ...(site.postcode && { postalCode: site.postcode }),
    addressCountry: "AU",
  },
  ...(site.social.length > 0 && { sameAs: site.social.map((s) => s.href) }),
  founder: [
    { "@type": "Person", name: "Hassan Sheikh", jobTitle: "Co-founder, Hosting & security", image: `${site.url}/team/hassan-sheikh.webp` },
    { "@type": "Person", name: "Ali Lishan", jobTitle: "Co-founder, Web design & development", image: `${site.url}/team/ali-lishan.webp` },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${interTight.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <JsonLd data={organization} />
        <MotionProvider>
        <ChatProvider>
          <ScrollToTop />
          <a
            href="#main"
            className="sr-only z-[60] rounded-full bg-charcoal px-4 py-2 text-offwhite focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <ChatWidget />
        </ChatProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
