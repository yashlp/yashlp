import type { Metadata } from "next";
import "./metals.css";

export const metadata: Metadata = {
  title: {
    absolute: "Jagetiya Metals — Steel Bars Cut to Size | Vadodara, Gujarat",
  },
  description:
    "Alloy and carbon steel bars — round, square, hex, and flat. EN-24, EN-19, MS, WPS, and more. Search live stock and prices in seconds.",
  openGraph: {
    title: "Jagetiya Metals — Steel at the Speed of Search",
    description:
      "Alloy and carbon steel bars cut to size. Find exact stock and live prices in seconds from Vadodara, Gujarat.",
    type: "website",
  },
};

export default function MetalsLayout({ children }: { children: React.ReactNode }) {
  return <div className="metals-site">{children}</div>;
}
