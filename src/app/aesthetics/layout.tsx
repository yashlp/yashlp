import type { Metadata, Viewport } from "next";
import "@/design-system/theme.css";
import { CartProvider } from "@/components/aesthetics/providers/cart-provider";
import { StorefrontProviders } from "@/components/aesthetics/providers/storefront-providers";
import { BrandLoader } from "@/components/aesthetics/layout/brand-loader";

export const metadata: Metadata = {
  title: { default: "Only Aesthetics", template: "%s · Only Aesthetics" },
  description:
    "Because Details Matter. A curated design marketplace for independent makers and wellness objects.",
  applicationName: "Only Aesthetics",
  openGraph: {
    title: "Only Aesthetics — Because Details Matter",
    description:
      "A curated design marketplace. Independent makers, mood-matched edits, editorial curation.",
    siteName: "Only Aesthetics",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff5e1" },
    { media: "(prefers-color-scheme: dark)", color: "#141b28" },
  ],
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
