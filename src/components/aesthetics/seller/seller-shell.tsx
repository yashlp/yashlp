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
  { href: "/seller/upload", label: "Studio upload", icon: Upload },
  { href: "/seller/orders", label: "Orders", icon: Tag },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/messages", label: "Messages", icon: MessageSquare },
  { href: "/seller/ai-tools", label: "AI Tools", icon: Sparkles },
];

export function SellerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="aesthetics-root aes-site-bg flex min-h-dvh">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--aes-border)] bg-white/70 backdrop-blur-md lg:block">
        <div className="p-6">
          <Link href="/aesthetics" className="aes-display text-xl font-semibold italic text-[var(--aes-ink)]">
            Only Aesthetics
          </Link>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--aes-pink)]">
            Maker studio
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--aes-ink-muted)]">
            Portrait · brand story · products · reviews
          </p>
        </div>
        <nav className="px-3 pb-6">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-300",
                pathname === href
                  ? "bg-[rgba(255,42,95,0.1)] text-[var(--aes-pink)]"
                  : "text-[var(--aes-ink-muted)] hover:bg-white/80 hover:text-[var(--aes-ink)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[var(--aes-border)] bg-white/70 px-6 backdrop-blur-md lg:hidden">
          <p className="text-sm font-semibold tracking-wide text-[var(--aes-ink)]">Maker studio</p>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
