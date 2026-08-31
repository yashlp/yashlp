import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { RootShell } from "@/components/root-shell";
import { isAestheticsOnlyDeploy } from "@/lib/commerce/aesthetics-surface";
import { isCommercePlatformPath } from "@/lib/commerce-platform-routes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

function siteLooksLikeOnlyAesthetic() {
  if (process.env.PRODUCT_SURFACE === "aesthetics") return true;
  if (isAestheticsOnlyDeploy()) return true;
  const hints = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  return hints.some((h) => !!h && /onlyaesthetic/i.test(h));
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (siteLooksLikeOnlyAesthetic() ? "https://onlyaesthetic.in" : "https://yashlp.vercel.app");

const civicMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CivicLens — Community Intelligence",
    template: "%s · CivicLens",
  },
  description:
    "Report neighbourhood issues, confirm community pins, and see health scores for your city. CivicLens helps communities understand and improve the places around them.",
  openGraph: {
    title: "CivicLens — Community Intelligence",
    description:
      "Report neighbourhood issues, confirm community pins, and see health scores for your city.",
    url: siteUrl,
    siteName: "CivicLens",
    type: "website",
    images: [{ url: "/brand/civiclens-logo.png", width: 634, height: 632, alt: "CivicLens" }],
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/brand/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const aestheticsMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://onlyaesthetic.in"),
  title: {
    default: "Only Aesthetic",
    template: "%s · Only Aesthetic",
  },
  description:
    "Because Details Matter. Curated design objects from independent makers — shipped across India.",
  applicationName: "Only Aesthetic",
  openGraph: {
    title: "Only Aesthetic — Because Details Matter",
    description:
      "Curated home, wellness, and lifestyle objects from independent makers. India only.",
    siteName: "Only Aesthetic",
    type: "website",
    locale: "en_IN",
    images: [
      { url: "/brand/only-aesthetic-logo.png", width: 1024, height: 1024, alt: "Only Aesthetic" },
    ],
  },
  icons: {
    icon: [
      { url: "/brand/only-aesthetic-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/only-aesthetic-logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/only-aesthetic-favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true },
};

// Build-time default for the Only Aesthetic Vercel project — avoids CivicLens tab titles
const buildDefaultMetadata = siteLooksLikeOnlyAesthetic() ? aestheticsMetadata : civicMetadata;

export async function generateMetadata(): Promise<Metadata> {
  if (siteLooksLikeOnlyAesthetic()) {
    return aestheticsMetadata;
  }
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname.startsWith("/metals")) {
    return {
      title: {
        default: "Jagetiya Metals | Alloy Steel Cut to Size | Vadodara",
        template: "%s | Jagetiya Metals",
      },
      description:
        "Alloy steel, cut to spec. Quotes in seconds, not days. EN-8, EN-19, EN-24, 20MnCr5, EN-31, WPS (D3), mild steel, stainless, and non-ferrous from Vadodara.",
    };
  }
  if (isCommercePlatformPath(pathname) || pathname.startsWith("/aesthetics")) {
    return aestheticsMetadata;
  }
  return buildDefaultMetadata;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
