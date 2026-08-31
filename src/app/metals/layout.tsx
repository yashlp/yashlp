import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Jagetiya Metals | Special & Alloy Steel Stockists",
  },
  description:
    "Engineering steel, tool steel, stainless steel and non-ferrous metal stock in Vadodara, Gujarat.",
};

export default function MetalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
