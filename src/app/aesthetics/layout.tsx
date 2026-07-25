import type { Metadata, Viewport } from "next";
import "@/design-system/theme.css";
import { CartProvider } from "@/components/aesthetics/providers/cart-provider";
import { StorefrontProviders } from "@/components/aesthetics/providers/storefront-providers";
import { BrandLoader } from "@/components/aesthetics/layout/brand-loader";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://onlyaesthetic.in"),
  // absolute: ignore any parent CivicLens title template
  title: {
    absolute: "Only Aesthetic",
    default: "Only Aesthetic",
    template: "%s · Only Aesthetic",
  },
  description:
    "Because Details Matter. Curated design objects from independent makers — shipped across India.",
  applicationName: "Only Aesthetic",
  icons: {
    icon: [
      { url: "/brand/only-aesthetic-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/only-aesthetic-logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/only-aesthetic-favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Only Aesthetic — Because Details Matter",
    description:
      "Curated home, wellness, and lifestyle objects from independent makers. India only.",
    siteName: "Only Aesthetic",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/brand/only-aesthetic-logo.png", width: 1024, height: 1024, alt: "Only Aesthetic" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#fdfcfb",
};

export default function AestheticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aesthetics-root aes-site-bg min-h-dvh">
      <BrandLoader />
      <CartProvider>
        <StorefrontProviders>{children}</StorefrontProviders>
      </CartProvider>
    </div>
  );
}
