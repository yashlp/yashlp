"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/aesthetics/shop", label: "Shop" },
  { href: "/aesthetics/collections", label: "Collections" },
  { href: "/aesthetics/about", label: "About us" },
  { href: "/aesthetics/wishlist", label: "Favourites" },
];

type ConsumerNavProps = {
  cartCount?: number;
};

export function ConsumerNav({ cartCount = 0 }: ConsumerNavProps) {
  const pathname = usePathname();
  const { customer } = useCustomer();
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const accountHref = customer ? "/aesthetics/account" : "/aesthetics/account/login";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[200] w-full transition-all duration-300",
          scrolled || open ? "bg-[var(--aes-bg-base)]/95 shadow-sm backdrop-blur-md" : "bg-transparent"
        )}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-2 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[var(--aes-ink-muted)]"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>

          <div className="flex justify-center">
            <BrandLogo variant="nav" />
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              href="/aesthetics/wishlist"
              className="hidden text-[var(--aes-ink-muted)] hover:text-[var(--aes-pink)] sm:block"
              aria-label="Favourites"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/aesthetics/cart"
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[var(--aes-ink-muted)]"
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
      </header>

      {open && (
        <div className="fixed inset-0 z-[190]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <nav className="absolute left-0 top-0 h-full w-[min(100%,18rem)] overflow-y-auto bg-[var(--aes-bg-base)]/97 p-6 shadow-2xl backdrop-blur-md sm:w-72">
            <div className="mb-8 pt-14">
              <BrandLogo variant="nav" href="/aesthetics" />
            </div>
            <div className="flex flex-col gap-1">
              <Link href="/aesthetics" className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-[var(--aes-ink)]">
                Home
              </Link>
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "py-3 text-sm font-medium uppercase tracking-[0.15em] transition-colors",
                    pathname === href || pathname.startsWith(`${href}/`)
                      ? "text-[var(--aes-pink)]"
                      : "text-[var(--aes-ink-muted)] hover:text-[var(--aes-pink)]"
                  )}
                >
                  {label}
                </Link>
              ))}
              <Link
                href={accountHref}
                className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-[var(--aes-ink-muted)] hover:text-[var(--aes-pink)]"
              >
                {customer ? "My account" : "Sign in"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
