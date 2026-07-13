"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Users,
  Warehouse,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
      { href: "/admin/purchases", label: "Purchases", icon: ShoppingCart },
      { href: "/admin/suppliers", label: "Suppliers", icon: Users },
      { href: "/admin/orders", label: "Orders", icon: Package },
      { href: "/admin/shipping", label: "Shipping", icon: Truck },
      { href: "/admin/payments", label: "Payments", icon: Wallet },
      { href: "/admin/returns", label: "Returns & Refunds", icon: RotateCcw },
    ],
  },
  {
    label: "Catalog & Brand",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/collections", label: "Collections", icon: FolderOpen },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/content", label: "Content", icon: FileText },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
    ],
  },
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

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-dvh bg-[var(--aes-ivory)]">
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-[var(--aes-border)] bg-[var(--aes-charcoal)] text-white lg:block">
        <div className="p-6">
          <p className="aes-display text-lg font-semibold tracking-wide">
            <span className="text-white/70">only </span>
            <span className="text-[var(--aes-royal)]">A E S T H E T I C S</span>
          </p>
          <p className="aes-mono mt-1 text-[10px] uppercase tracking-wider text-white/50">D2C Admin</p>
        </div>
        <nav className="px-3 pb-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="aes-mono mb-2 px-4 text-[9px] uppercase tracking-widest text-white/30">{section.label}</p>
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "mb-0.5 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                    isActive(href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
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
      <main className="flex-1 overflow-x-hidden p-6 lg:p-10">{children}</main>
    </div>
  );
}
