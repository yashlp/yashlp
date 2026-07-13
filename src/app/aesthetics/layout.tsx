import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "@/design-system/theme.css";
import { CartProvider } from "@/components/aesthetics/providers/cart-provider";

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const mono = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: { default: "Aesthetics", template: "%s · Aesthetics" },
  description:
    "A luxury wellness marketplace. Unwind, restore, and reconnect with curated objects for mindful living.",
  applicationName: "Aesthetics",
  openGraph: {
    title: "Aesthetics — Luxury Wellness Marketplace",
    description:
      "A luxury wellness marketplace. Unwind, restore, and reconnect with curated objects for mindful living.",
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
