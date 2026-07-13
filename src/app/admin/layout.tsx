import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/design-system/theme.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Platform Admin", template: "%s · Admin · Aesthetics" },
  applicationName: "Aesthetics",
};

export default function PlatformAdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={`aesthetics-root ${inter.variable} min-h-dvh`}>{children}</div>;
}
