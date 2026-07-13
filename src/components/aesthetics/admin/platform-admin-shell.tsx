"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_MOBILE_TABS, ADMIN_NAV_SECTIONS } from "@/lib/commerce/admin-nav";

type Props = {
  admin: { name: string; email: string; role: string };
  children: React.ReactNode;
};

export function PlatformAdminShell({ admin, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.add("only-aesthetics-admin");
    return () => document.body.classList.remove("only-aesthetics-admin");
  }, []);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const sidebar = (
    <>
      <div className="border-b border-white/10 px-5 py-5">
        <p className="aes-display text-base font-semibold tracking-wide sm:text-lg">
          <span className="text-white/70">only </span>
          <span className="text-[var(--aes-royal)]">A E S T H E T I C S</span>
        </p>
        <p className="aes-mono mt-1 text-[10px] uppercase tracking-wider text-white/50">D2C Admin Portal</p>
        <p className="mt-2 text-[11px] text-white/35">Separate from CivicLens</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV_SECTIONS.map((section) => (
          <div key={section.id} className="mb-5">
            <p className="aes-mono mb-2 border-b border-white/10 px-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--aes-royal)]">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, description }) => (
                <li key={href}>
                  <Link
                    href={href}
                    title={description}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive(href)
                        ? "bg-[var(--aes-royal)] text-white shadow-sm"
                        : "text-white/70 hover:bg-white/8 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-medium text-white/90">{admin.name}</p>
        <p className="aes-mono truncate text-[10px] text-white/45">{admin.role}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="only-aesthetics-admin flex min-h-dvh flex-col bg-[var(--aes-ivory)] text-[var(--aes-charcoal)]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--aes-border)] bg-[var(--aes-charcoal)] px-4 py-3 text-white md:hidden">
        <div>
          <p className="text-sm font-semibold">
            <span className="text-white/60">only </span>
            <span className="text-[var(--aes-royal)]">AESTHETICS</span>
          </p>
          <p className="aes-mono text-[9px] uppercase tracking-wider text-white/40">Admin</p>
        </div>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg p-2 text-white hover:bg-white/10"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar — always visible from md breakpoint */}
        <aside className="hidden w-72 shrink-0 flex-col border-r border-[var(--aes-border)] bg-[var(--aes-charcoal)] text-white md:flex">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 flex w-[min(100%,20rem)] flex-col bg-[var(--aes-charcoal)] text-white shadow-2xl md:hidden">
              {sidebar}
            </aside>
          </>
        )}

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 pb-24 md:p-8 md:pb-8 lg:p-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[var(--aes-border)] bg-white md:hidden">
        {ADMIN_MOBILE_TABS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium",
              isActive(href) ? "text-[var(--aes-royal)]" : "text-[var(--aes-charcoal-muted)]"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium text-[var(--aes-charcoal-muted)]"
        >
          <Menu className="h-5 w-5" />
          More
        </button>
      </nav>
    </div>
  );
}
