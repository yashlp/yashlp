import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { RootShell } from "@/components/root-shell";
import { isCommercePlatformPath } from "@/lib/commerce-platform-routes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yashlp.vercel.app";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Only Aesthetic",
    template: "%s · Only Aesthetic",
  },
  description: "Only Aesthetic — premium direct-to-consumer beauty & lifestyle.",
  applicationName: "Only Aesthetic",
  robots: { index: true, follow: true },
};

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (isCommercePlatformPath(pathname)) {
    return aestheticsMetadata;
  }
  return civicMetadata;
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
