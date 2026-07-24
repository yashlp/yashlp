import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./admin.css";
import "@/design-system/theme.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Only Aesthetic Admin", template: "%s · Only Aesthetic Admin" },
  description: "Direct-to-consumer operations portal for Only Aesthetic — inventory, orders, purchases, and analytics.",
  applicationName: "Only Aesthetic",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function PlatformAdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`aesthetics-root only-aesthetics-admin ${inter.variable} min-h-dvh bg-[var(--aes-ivory)]`}>
      {children}
    </div>
  );
}
