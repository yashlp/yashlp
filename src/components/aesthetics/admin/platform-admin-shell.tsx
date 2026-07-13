"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  Store,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: CreditCard },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
  { href: "/admin/support", label: "Support", icon: Shield },
];

type Props = {
  admin: { name: string; email: string; role: string };
  children: React.ReactNode;
};

export function PlatformAdminShell({ admin, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh bg-[var(--aes-ivory)]">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--aes-border)] bg-[var(--aes-charcoal)] text-white lg:block">
        <div className="p-6">
          <p className="aes-display text-xl font-semibold italic">Aesthetics</p>
          <p className="aes-mono mt-1 text-[10px] uppercase tracking-wider text-white/50">Platform Admin</p>
        </div>
        <nav className="px-3 pb-6">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                pathname === href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm text-white/80">{admin.name}</p>
          <p className="aes-mono truncate text-[10px] text-white/40">{admin.role}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex items-center gap-2 text-xs text-white/60 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
