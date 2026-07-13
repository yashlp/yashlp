"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Package,
  Sparkles,
  Tag,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "@/design-system/theme.css";

const NAV = [
  { href: "/seller", label: "Overview", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/upload", label: "Upload", icon: Upload },
  { href: "/seller/orders", label: "Orders", icon: Tag },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/messages", label: "Messages", icon: MessageSquare },
  { href: "/seller/ai-tools", label: "AI Tools", icon: Sparkles },
];

export function SellerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="aesthetics-root flex min-h-dvh bg-[var(--aes-ivory)]">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--aes-border)] bg-[var(--aes-white)] lg:block">
        <div className="p-6">
          <Link href="/aesthetics" className="aes-display text-xl font-semibold italic text-[var(--aes-charcoal)]">
            Aesthetics
          </Link>
          <p className="aes-mono mt-1 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Seller</p>
        </div>
        <nav className="px-3 pb-6">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                pathname === href
                  ? "bg-[rgba(27,79,156,0.08)] text-[var(--aes-royal)]"
                  : "text-[var(--aes-charcoal-muted)] hover:bg-[var(--aes-ivory)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[var(--aes-border)] bg-[var(--aes-white)] px-6 lg:hidden">
          <p className="aes-display font-semibold italic">Seller</p>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
