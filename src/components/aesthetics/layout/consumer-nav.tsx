"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-[200] w-full transition-all duration-300",
        scrolled ? "bg-white/95 shadow-md backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--aes-ink)] md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/aesthetics" className="aes-display text-3xl tracking-wide text-[var(--aes-ink)] sm:text-4xl">
          Aesthetics
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest transition-colors",
                  active ? "text-[var(--aes-pink)]" : "text-[var(--aes-ink)] hover:text-[var(--aes-pink)]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/aesthetics/search"
            className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 sm:flex"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/aesthetics/wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 sm:flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/aesthetics/account/login"
            className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 sm:flex"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/aesthetics/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--aes-ink)] bg-[var(--aes-ink)] text-white"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--aes-pink)] px-1 text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--aes-border)] bg-white px-4 py-4 md:hidden">
          <Link href="/aesthetics" onClick={() => setOpen(false)} className="block py-3 font-bold uppercase tracking-wider">
            Home
          </Link>
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 font-bold uppercase tracking-wider text-[var(--aes-ink)]"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
