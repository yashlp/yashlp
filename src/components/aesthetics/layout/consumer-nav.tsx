"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/aesthetics/shop", label: "Shop" },
  { href: "/aesthetics/collections", label: "Collections" },
  { href: "/aesthetics/account/login", label: "Account" },
];

type ConsumerNavProps = {
  cartCount?: number;
};

export function ConsumerNav({ cartCount = 0 }: ConsumerNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-[200] w-full transition-all duration-300",
        scrolled ? "bg-[var(--aes-cream)]/95 shadow-sm backdrop-blur-md" : "bg-[var(--aes-cream)]"
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-2 px-4 py-4 sm:px-6">
        {/* Left — menu */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--aes-ink)]"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>

        {/* Center — logo */}
        <Link
          href="/aesthetics"
          className="aes-display text-center text-2xl tracking-tight text-[var(--aes-ink)] sm:text-3xl"
        >
          Aesthetics
        </Link>

        {/* Right — cart */}
        <div className="flex items-center justify-end">
          <Link
            href="/aesthetics/cart"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--aes-ink)]"
            aria-label="Cart"
          >
            <span className="hidden sm:inline">Cart</span>
            <span className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--aes-pink)] px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </span>
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--aes-border)] bg-[var(--aes-cream)] px-4 py-6 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              href="/aesthetics"
              className="py-3 text-sm font-bold uppercase tracking-widest text-[var(--aes-ink)]"
            >
              Home
            </Link>
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "py-3 text-sm font-bold uppercase tracking-widest transition-colors",
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? "text-[var(--aes-pink)]"
                    : "text-[var(--aes-ink)] hover:text-[var(--aes-pink)]"
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/aesthetics/search"
              className="py-3 text-sm font-bold uppercase tracking-widest text-[var(--aes-ink)] hover:text-[var(--aes-pink)]"
            >
              Search
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
