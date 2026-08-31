import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { MetalsChrome } from "@/components/metals/site-chrome";
import "./metals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: {
    default: "Alloy Steel Cut to Size | Vadodara",
    template: "%s | Jagetiya Metals",
  },
  description:
    "EN-8, EN-19 (4140), EN-24, WPS D3, stainless, brass, copper, and aluminium. Round, square, hex, and flat bar cut to size from Makarpura GIDC, Vadodara.",
  applicationName: "Jagetiya Metals",
};

export default function MetalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`jk-root ${inter.variable} ${instrument.variable} ${jetbrains.variable} ${orbitron.variable}`}
    >
      <MetalsChrome>{children}</MetalsChrome>
    </div>
  );
}
