import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { site, socials } from "@/data/site";
import { CursorInteraction } from "@/components/layout/CursorInteraction";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { INTRO_KEY } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import "@/styles/globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Thanvanth AT",
    "Game Developer",
    "AI Engineer",
    "Creative Technologist",
    "Unreal Engine 5",
    "Computer Vision",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Game Developer & AI Engineer",
  description: site.positioning,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: socials.map((s) => s.href),
  knowsAbout: ["Game Development", "Unreal Engine", "Artificial Intelligence", "Computer Vision", "Software Engineering"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body className="grain">
        <a
          href="#main"
          className="label sr-only z-[130] bg-bone px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <script
          // Skip the intro loader before first paint on repeat visits or reduced motion
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("${INTRO_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="skip"}catch(e){}`,
          }}
        />
        <noscript
          // Without JavaScript: drop the intro and wipe, and show content that would otherwise animate in
          dangerouslySetInnerHTML={{
            __html:
              '<style>.intro-loader,.page-wipe{display:none!important}main [style*="opacity:0"]{opacity:1!important}main [style*="translateY(105%)"]{transform:none!important}</style>',
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionProvider>
          <Loader />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CursorInteraction />
        </MotionProvider>
      </body>
    </html>
  );
}
