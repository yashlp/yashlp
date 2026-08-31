import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Orbitron } from "next/font/google";
import { MetalsFrame } from "@/components/metals/metals-frame";
import { company } from "@/lib/metals/company";
import "./metals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jk-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jk-mono",
  display: "swap",
});

const logo = Orbitron({
  subsets: ["latin"],
  variable: "--font-jk-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Jagetiya Metals | Alloy Steel Cut to Size | Vadodara",
    default: "Jagetiya Metals | Alloy Steel Cut to Size | Vadodara",
    template: "%s | Jagetiya Metals",
  },
  description:
    "Alloy steel, cut to spec. Quotes in seconds, not days. EN-8, EN-19 (4140), EN-24, 20MnCr5, EN-31, WPS (D3), mild steel, stainless, brass, copper, and aluminium from Makarpura GIDC, Vadodara.",
  applicationName: "Jagetiya Metals",
  openGraph: {
    title: "Jagetiya Metals — Metal at the speed of software",
    description:
      "Round, square, hex, and flat bar cut to size from Vadodara. Instant quotes against live stock.",
    siteName: "Jagetiya Metals",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#070707",
};

export default function MetalsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    legalName: company.legalName,
    url: "https://jagetiyametals.com",
    description: company.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressLine,
      addressLocality: company.city,
      addressRegion: company.region,
      postalCode: company.postalCode,
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: company.email,
      telephone: company.phonePrimaryTel,
    },
  };

  return (
    <div className={`metals-root ${serif.variable} ${mono.variable} ${logo.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MetalsFrame>{children}</MetalsFrame>
    </div>
  );
}
