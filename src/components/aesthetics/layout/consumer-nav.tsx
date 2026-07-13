"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Compass, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/aesthetics", label: "Home" },
  { href: "/aesthetics/shop", label: "Shop" },
  { href: "/aesthetics/collections", label: "Collections" },
  { href: "/aesthetics/discover", label: "Discover" },
];

type ConsumerNavProps = {
  cartCount?: number;
};

export function ConsumerNav({ cartCount = 0 }: ConsumerNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-[200] px-4 pt-4 sm:px-6">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-500 sm:px-6",
          scrolled
            ? "border-[var(--aes-border)] bg-white/85 shadow-lg shadow-[rgba(30,58,138,0.08)] backdrop-blur-xl"
            : "border-transparent bg-white/50 backdrop-blur-md"
        )}
      >
        <Link href="/aesthetics" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--aes-gradient-brand)] text-sm font-bold text-white shadow-md">
            Æ
          </span>
          <span className="aes-display hidden text-xl font-bold tracking-tight text-[var(--aes-ink)] sm:block">
            Aesthetics
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== "/aesthetics" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-[var(--aes-ink)] text-white shadow-md"
                    : "text-[var(--aes-ink-muted)] hover:bg-white hover:text-[var(--aes-ink)]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          {[
            { href: "/aesthetics/search", icon: Search, label: "Search" },
            { href: "/aesthetics/wishlist", icon: Heart, label: "Wishlist", hideMobile: true },
          ].map(({ href, icon: Icon, label, hideMobile }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-[var(--aes-ink-muted)] transition hover:bg-white hover:text-[var(--aes-ink)] hover:shadow-sm",
                hideMobile && "hidden sm:flex"
              )}
              aria-label={label}
            >
              <Icon className="h-[18px] w-[18px]" />
            </Link>
          ))}
          <Link
            href="/aesthetics/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[var(--aes-ink-muted)] transition hover:bg-white hover:text-[var(--aes-ink)] hover:shadow-sm"
            aria-label="Cart"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--aes-coral)] px-1 text-[9px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--aes-ink-muted)] md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-auto mt-2 max-w-7xl rounded-2xl border border-[var(--aes-border)] bg-white/95 p-3 shadow-xl backdrop-blur-xl md:hidden">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold text-[var(--aes-ink)]"
            >
              {href.includes("discover") ? (
                <Compass className="h-5 w-5 text-[var(--aes-lavender)]" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-[var(--aes-cobalt-bright)]" />
              )}
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
