"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Compass,
  Grid3X3,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
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

  return (
    <header className="sticky top-0 z-[200] border-b border-[var(--aes-border)] bg-[var(--aes-ivory)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/aesthetics" className="aes-display shrink-0 text-2xl font-semibold italic tracking-tight text-[var(--aes-charcoal)]">
          Aesthetics
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                pathname === href || (href !== "/aesthetics" && pathname.startsWith(href))
                  ? "bg-[rgba(27,79,156,0.08)] text-[var(--aes-royal)]"
                  : "text-[var(--aes-charcoal-muted)] hover:text-[var(--aes-charcoal)]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/aesthetics/search"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--aes-charcoal-muted)] transition hover:bg-[rgba(27,79,156,0.04)] hover:text-[var(--aes-charcoal)]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/aesthetics/wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-[var(--aes-charcoal-muted)] transition hover:bg-[rgba(27,79,156,0.04)] sm:flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/aesthetics/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[var(--aes-charcoal-muted)] transition hover:bg-[rgba(27,79,156,0.04)]"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="aes-mono absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--aes-royal)] px-1 text-[9px] text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--aes-charcoal-muted)] md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--aes-border)] px-4 py-4 md:hidden">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[var(--aes-charcoal)]"
            >
              {href.includes("discover") ? <Compass className="h-5 w-5 text-[var(--aes-royal)]" /> : <Grid3X3 className="h-5 w-5 text-[var(--aes-dusty)]" />}
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
