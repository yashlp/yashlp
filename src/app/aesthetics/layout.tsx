import type { Metadata, Viewport } from "next";
import "@/design-system/theme.css";
import { CartProvider } from "@/components/aesthetics/providers/cart-provider";
import { StorefrontProviders } from "@/components/aesthetics/providers/storefront-providers";
import { BrandLoader } from "@/components/aesthetics/layout/brand-loader";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://onlyaesthetic.in"),
  title: { default: "Only Aesthetic", template: "%s · Only Aesthetic" },
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
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#fff5e1",
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
