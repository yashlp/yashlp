import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yashlp.vercel.app";

export const metadata: Metadata = {
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
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
