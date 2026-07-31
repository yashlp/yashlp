"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { useAddToBagFly } from "@/components/aesthetics/motion/add-to-bag-fly";
import { bagPulse } from "@/lib/aesthetics/motion";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/aesthetics/shop", label: "Shop" },
  { href: "/aesthetics/about", label: "About us" },
  { href: "/aesthetics/contact", label: "Contact us" },
  { href: "/aesthetics/wishlist", label: "Favourites" },
];

type ConsumerNavProps = {
  cartCount?: number;
};

export function ConsumerNav({ cartCount: cartCountProp }: ConsumerNavProps) {
  const pathname = usePathname();
  const { customer } = useCustomer();
  const { cartCount: liveCount } = useCart();
  const cartCount = cartCountProp ?? liveCount;
  const { pulseBag } = useAddToBagFly();
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
    if (!open) {
      document.body.style.removeProperty("overflow");
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
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
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-3 sm:grid-cols-3 sm:gap-2 sm:px-6 sm:py-4">
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="aes-touch flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl text-xs font-medium uppercase tracking-[0.15em] text-[var(--aes-ink-muted)]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>

          <div className="flex min-w-0 justify-center overflow-hidden px-1">
            <BrandLogo variant="nav" />
          </div>

          <div className="flex items-center justify-end gap-0.5 sm:gap-2">
            <Link
              href="/aesthetics/wishlist"
              className="aes-touch flex min-h-11 min-w-11 items-center justify-center text-[var(--aes-ink-muted)]"
              aria-label="Favourites"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/aesthetics/cart"
              data-aes-bag-target
              className="aes-touch relative flex min-h-11 min-w-11 items-center justify-center text-[var(--aes-ink-muted)]"
              aria-label="Shopping bag"
            >
              <motion.span
                key={pulseBag}
                variants={bagPulse}
                initial="rest"
                animate={pulseBag > 0 ? "pulse" : "rest"}
                className="inline-flex"
              >
                <ShoppingBag className="h-5 w-5" />
              </motion.span>
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--aes-pink)] px-1 text-[9px] font-bold text-white sm:right-0 sm:top-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[300]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <nav
            className="absolute left-0 top-0 flex h-full w-[min(100%,20rem)] flex-col overflow-y-auto bg-[var(--aes-bg-base)] p-5 shadow-2xl sm:w-72"
            style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <BrandLogo variant="nav" href="/aesthetics" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--aes-ink-muted)]"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-0.5 pb-10">
              <Link
                href="/aesthetics"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-[var(--aes-ink)] active:bg-black/5"
              >
                Home
              </Link>
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3.5 text-sm font-medium uppercase tracking-[0.15em] transition-colors active:bg-black/5",
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
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-[var(--aes-ink-muted)] hover:text-[var(--aes-pink)] active:bg-black/5"
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
