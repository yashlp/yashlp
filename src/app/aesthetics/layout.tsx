import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, Inter } from "next/font/google";
import "@/design-system/theme.css";
import { CartProvider } from "@/components/aesthetics/providers/cart-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export const metadata: Metadata = {
  title: { default: "Aesthetics", template: "%s · Aesthetics" },
  description:
    "A curated marketplace for beautiful products from independent brands. Premium shopping, AI-powered personalization.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AestheticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`aesthetics-root ${inter.variable} ${cormorant.variable} ${dmMono.variable} min-h-dvh`}>
      <CartProvider>{children}</CartProvider>
    </div>
  );
}
