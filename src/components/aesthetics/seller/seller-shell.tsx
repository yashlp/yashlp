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
    <div className="aesthetics-root aes-gallery-room aes-gallery-room--editorial flex min-h-dvh">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] lg:block">
        <div className="p-6">
          <Link href="/aesthetics" className="aes-gallery-title text-xl">
            Only Aesthetic
          </Link>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gallery-blue,#2c5aa0)]">
            Maker studio
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--gallery-muted,#6f6a63)]">
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
                  ? "bg-[rgba(44,90,160,0.1)] text-[var(--gallery-blue,#2c5aa0)]"
                  : "text-[var(--gallery-muted,#6f6a63)] hover:bg-[var(--gallery-bg,#f7f4ee)] hover:text-[var(--gallery-ink,#1e1e1c)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] px-6 lg:hidden">
          <p className="text-sm font-semibold tracking-wide">Maker studio</p>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
