import type { Metadata, Viewport } from "next";
import { DM_Mono, Instrument_Serif, Plus_Jakarta_Sans, Syne } from "next/font/google";
import "@/design-system/theme.css";
import { CartProvider } from "@/components/aesthetics/providers/cart-provider";

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Aesthetics", template: "%s · Aesthetics" },
  description:
    "A curated art & design marketplace. Discover beautiful objects from independent makers — shop editorially or immerse in Discover mode.",
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
