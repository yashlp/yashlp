import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PlatformAdminShell } from "@/components/aesthetics/admin/platform-admin-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Platform Admin", template: "%s · Admin · Aesthetics" },
};

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.variable}>
      <PlatformAdminShell>{children}</PlatformAdminShell>
    </div>
  );
}
