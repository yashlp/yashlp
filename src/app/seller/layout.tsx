import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SellerShell } from "@/components/aesthetics/seller/seller-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Seller Dashboard", template: "%s · Seller · Aesthetics" },
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.variable}>
      <SellerShell>{children}</SellerShell>
    </div>
  );
}
