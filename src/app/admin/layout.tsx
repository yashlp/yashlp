import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./admin.css";
import "@/design-system/theme.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Only Aesthetics Admin", template: "%s · Only Aesthetics Admin" },
  description: "Direct-to-consumer operations portal for Only Aesthetics — inventory, orders, purchases, and analytics.",
  applicationName: "Only Aesthetics",
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
