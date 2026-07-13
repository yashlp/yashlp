"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
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
  const isHome = pathname === "/aesthetics";
  const lightNav = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-[200] w-full transition-all duration-500",
        scrolled
          ? "border-b border-[var(--aes-border)] bg-[var(--aes-sand)]/95 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <Link href="/aesthetics" className="group flex items-center gap-3">
          <span
            className={cn(
              "aes-display text-2xl font-medium tracking-wide transition-colors",
              lightNav ? "text-[var(--aes-sand)]" : "text-[var(--aes-ink)]"
            )}
          >
            Aesthetics
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== "/aesthetics" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-xs font-medium uppercase tracking-[0.2em] transition-colors",
                  active
                    ? lightNav
                      ? "text-[var(--aes-gold-soft)]"
                      : "text-[var(--aes-forest)]"
                    : lightNav
                      ? "text-[var(--aes-sand)]/70 hover:text-[var(--aes-sand)]"
                      : "text-[var(--aes-ink-muted)] hover:text-[var(--aes-ink)]"
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
                "flex h-10 w-10 items-center justify-center transition-colors",
                lightNav
                  ? "text-[var(--aes-sand)]/70 hover:text-[var(--aes-sand)]"
                  : "text-[var(--aes-ink-muted)] hover:text-[var(--aes-ink)]",
                hideMobile && "hidden sm:flex"
              )}
              aria-label={label}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
          ))}
          <Link
            href="/aesthetics/cart"
            className={cn(
              "relative flex h-10 w-10 items-center justify-center transition-colors",
              lightNav
                ? "text-[var(--aes-sand)]/70 hover:text-[var(--aes-sand)]"
                : "text-[var(--aes-ink-muted)] hover:text-[var(--aes-ink)]"
            )}
            aria-label="Cart"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center bg-[var(--aes-gold)] px-1 text-[8px] font-medium text-[var(--aes-forest-deep)]">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
              "flex h-10 w-10 items-center justify-center md:hidden",
              lightNav ? "text-[var(--aes-sand)]" : "text-[var(--aes-ink)]"
            )}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--aes-border)] bg-[var(--aes-sand)] px-6 py-4 md:hidden">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--aes-ink)]"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
