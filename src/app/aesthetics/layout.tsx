import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "@/design-system/theme.css";
import { CartProvider } from "@/components/aesthetics/providers/cart-provider";

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const display = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

const serif = DM_Sans({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const mono = DM_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: { default: "Aesthetics", template: "%s · Aesthetics" },
  description:
    "Curated design objects for joyful living. Shop editorial collections from independent makers.",
  applicationName: "Aesthetics",
  openGraph: {
    title: "Aesthetics — Curated Design Marketplace",
    description:
      "Objects as beautiful as they are meaningful. Shop curated wellness & design from independent makers.",
    siteName: "Aesthetics",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AestheticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`aesthetics-root aes-mesh-bg min-h-dvh ${body.variable} ${display.variable} ${serif.variable} ${mono.variable}`}
    >
      <CartProvider>{children}</CartProvider>
    </div>
  );
}
