"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  GitCompare,
  Home,
  LogIn,
  MapPin,
  MessageCircle,
  Plus,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserInfo = { id: string; name: string; email: string; reputation: number } | null;

const navItems = [
  { href: "/", label: "Map", icon: Home },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/ask", label: "Ask AI", icon: MessageCircle },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Place<span className="text-teal-600">Pulse</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-teal-50 text-teal-700"
                    : "text-muted hover:bg-slate-50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-teal-600" />
                <span className="hidden sm:inline">{user.name}</span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                  {user.reputation} rep
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
            <Link
              href="/report"
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Report</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
                pathname === href ? "text-teal-600" : "text-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          <Link
            href="/report"
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-teal-600"
          >
            <Plus className="h-5 w-5" />
            Report
          </Link>
        </div>
      </nav>
    </div>
  );
}
