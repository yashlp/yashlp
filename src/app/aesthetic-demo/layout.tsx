import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./aesthetic-demo.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Curio Reel Shop — Demo",
  description:
    "Interactive demo: scroll aesthetic products in reel form. Swipe right to cart, left to pass. AI learns your taste.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function AestheticDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${dmMono.variable} min-h-dvh bg-[#fffef7]`}>
      {children}
    </div>
  );
}
