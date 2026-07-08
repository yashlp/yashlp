"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { SiteBanners, type PublicSiteConfig } from "@/components/site-banners";

type UserInfo = { id: string; name: string; phone: string; reputation: number; role?: string } | null;

const navItems = [
  { href: "/", label: "Map", shortLabel: "Map", icon: Home },
  { href: "/insights", label: "City Insights", shortLabel: "Stats", icon: BarChart3 },
  { href: "/reports", label: "Reports", shortLabel: "Reports", icon: FileText },
  { href: "/compare", label: "Compare", shortLabel: "Compare", icon: GitCompare },
  { href: "/ask", label: "Ask AI", shortLabel: "Ask", icon: MessageCircle },
];

const MOBILE_NAV = navItems.slice(0, 4);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo>(null);
  const [siteConfig, setSiteConfig] = useState<PublicSiteConfig | null>(null);
  const prevPath = useRef(pathname);
  const isLegalPage =
    pathname === "/terms" || pathname === "/privacy" || pathname === "/content-policy";
  const isAdminPage = pathname.startsWith("/admin");
  const isMapPage = pathname === "/";

  const refreshUser = () => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  };

  useEffect(() => {
    refreshUser();
    fetch("/api/site-config")
      .then((r) => r.json())
      .then(setSiteConfig)
      .catch(() => setSiteConfig({ demoMode: false, announcement: null, maintenanceMode: false }));

    const onAuth = () => refreshUser();
    window.addEventListener("civiclens-auth", onAuth);
    window.addEventListener("focus", onAuth);
    return () => {
      window.removeEventListener("civiclens-auth", onAuth);
      window.removeEventListener("focus", onAuth);
    };
  }, []);

  useEffect(() => {
    const cameFromLogin = prevPath.current === "/login" && pathname !== "/login";
    prevPath.current = pathname;
    if (cameFromLogin || pathname === "/profile") {
      refreshUser();
    }
  }, [pathname]);

  const shell = (
    <div className={cn("flex min-h-dvh flex-col", isMapPage && "h-dvh overflow-hidden")}>
      {!isAdminPage && <SiteBanners config={siteConfig} isAdmin={user?.role === "admin"} />}
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
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="hidden min-h-11 items-center rounded-xl px-2.5 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50 md:flex"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex min-h-11 items-center gap-2 rounded-xl px-3 py-1.5 text-sm hover:bg-orange-50"
                >
                <User className="h-4 w-4 text-orange-600" />
                <span className="hidden sm:inline text-stone-800">{user.name}</span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                  {user.reputation}
                </span>
              </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
            <Link
              href="/report"
              className="hidden min-h-11 items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-700 md:flex"
            >
              <Plus className="h-4 w-4" />
              Report
            </Link>
          </div>
        </div>
      </header>

      <main
        className={cn(
          "flex-1",
          isMapPage ? "relative min-h-0 overflow-hidden" : "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0"
        )}
      >
        {siteConfig?.maintenanceMode && !isAdminPage ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <p className="text-lg font-semibold text-stone-800">We&apos;ll be back shortly</p>
            <p className="mt-2 max-w-md text-sm text-stone-500">
              CivicLens is in maintenance mode. Check again in a little while.
            </p>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="hidden border-t border-orange-100 bg-white py-3 text-center text-xs text-stone-400 md:block">
        <Link href="/terms" className="hover:text-orange-600">
          Terms
        </Link>
        {" · "}
        <Link href="/privacy" className="hover:text-orange-600">
          Privacy
        </Link>
        {" · "}
        <Link href="/content-policy" className="hover:text-orange-600">
          Content Guidelines
        </Link>
        {" · "}
        <Link href="/try" className="hover:text-orange-600">
          Try demo hub
        </Link>
        {" · "}
        CivicLens — Community intelligence worldwide
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-orange-100 bg-white/98 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] md:hidden">
        <div className="flex items-stretch justify-around">
          {MOBILE_NAV.map(({ href, shortLabel, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-14 min-w-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium sm:text-xs",
                pathname === href ? "text-orange-600" : "text-stone-400"
              )}
            >
              <Icon className="h-5 w-5" />
              {shortLabel}
            </Link>
          ))}
          <Link
            href="/report"
            className="flex min-h-14 min-w-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-semibold text-orange-600 sm:text-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-white shadow-md">
              <Plus className="h-4 w-4" />
            </div>
            Report
          </Link>
        </div>
      </nav>
    </div>
  );

  if (isLegalPage) return shell;
  return <TermsGate>{shell}</TermsGate>;
}
