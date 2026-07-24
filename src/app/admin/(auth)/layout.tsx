"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlatformAdminShell } from "@/components/aesthetics/admin/platform-admin-shell";

type AdminUser = { id: string; email: string; name: string; role: string };

export default function PlatformAdminAuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null | undefined>(undefined);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setAdmin(null);
      return;
    }
    fetch("/api/admin/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.admin) {
          router.replace("/admin/login");
          setAdmin(null);
        } else {
          setAdmin(d.admin);
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;
  if (admin === undefined) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--aes-ivory)]">
        <div className="aes-skeleton h-10 w-48 rounded-lg" />
        <p className="text-sm text-[var(--aes-charcoal-muted)]">Loading Only Aesthetic admin…</p>
      </div>
    );
  }
  if (!admin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--aes-ivory)]">
        <p className="text-sm text-[var(--aes-charcoal-muted)]">Redirecting to sign in…</p>
      </div>
    );
  }

  return <PlatformAdminShell admin={admin}>{children}</PlatformAdminShell>;
}
