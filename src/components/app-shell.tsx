"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  GitCompare,
  Home,
  LogIn,
  MapPin,
  MessageCircle,
  Plus,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TermsGate } from "@/components/terms-gate";

type UserInfo = { id: string; name: string; phone: string; reputation: number } | null;

const navItems = [
  { href: "/", label: "Map", icon: Home },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/ask", label: "Ask AI", icon: MessageCircle },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo>(null);
  const isTermsPage = pathname === "/terms";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const shell = (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              Civic<span className="text-orange-600">Lens</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-orange-50 text-orange-700"
                    : "text-stone-500 hover:bg-orange-50/50 hover:text-stone-900"
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
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm hover:bg-orange-50"
              >
                <User className="h-4 w-4 text-orange-600" />
                <span className="hidden sm:inline text-stone-800">{user.name}</span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                  {user.reputation}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
            <Link
              href="/report"
              className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Report</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="hidden border-t border-orange-100 bg-white py-3 text-center text-xs text-stone-400 md:block">
        <Link href="/terms" className="hover:text-orange-600">
          Terms & Conditions
        </Link>
        {" · "}
        CivicLens — Community intelligence worldwide
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-orange-100 bg-white/98 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium",
                pathname === href ? "text-orange-600" : "text-stone-400"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          <Link
            href="/report"
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-semibold text-orange-600"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
              <Plus className="h-4 w-4" />
            </div>
            Report
          </Link>
        </div>
      </nav>
    </div>
  );

  if (isTermsPage) return shell;
  return <TermsGate>{shell}</TermsGate>;
}
