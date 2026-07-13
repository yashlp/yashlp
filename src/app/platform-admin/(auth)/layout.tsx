"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlatformAdminShell } from "@/components/aesthetics/admin/platform-admin-shell";

type AdminUser = { id: string; email: string; name: string; role: string };

export default function PlatformAdminAuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null | undefined>(undefined);
  const isLogin = pathname === "/platform-admin/login";

  useEffect(() => {
    if (isLogin) {
      setAdmin(null);
      return;
    }
    fetch("/api/platform-admin/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.admin) {
          router.replace("/platform-admin/login");
          setAdmin(null);
        } else {
          setAdmin(d.admin);
        }
      })
      .catch(() => router.replace("/platform-admin/login"));
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;
  if (admin === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--aes-ivory)]">
        <div className="aes-skeleton h-8 w-32 rounded-lg" />
      </div>
    );
  }
  if (!admin) return null;

  return <PlatformAdminShell admin={admin}>{children}</PlatformAdminShell>;
}
