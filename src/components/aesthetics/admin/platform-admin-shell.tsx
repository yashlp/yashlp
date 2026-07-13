"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Package,
  Shield,
  Store,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "@/design-system/theme.css";

const NAV = [
  { href: "/platform-admin", label: "Overview", icon: LayoutDashboard },
  { href: "/platform-admin/sellers", label: "Sellers", icon: Store },
  { href: "/platform-admin/products", label: "Products", icon: Package },
  { href: "/platform-admin/orders", label: "Orders", icon: CreditCard },
  { href: "/platform-admin/users", label: "Users", icon: Users },
  { href: "/platform-admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/platform-admin/support", label: "Support", icon: Shield },
];

export function PlatformAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="aesthetics-root flex min-h-dvh bg-[var(--aes-ivory)]">
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
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
