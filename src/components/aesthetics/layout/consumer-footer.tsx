"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { footerReveal } from "@/lib/aesthetics/motion";
import { useAesReducedMotion } from "@/components/aesthetics/motion/use-reduced-motion";

export function ConsumerFooter() {
  const reduced = useAesReducedMotion();

  return (
    <div className="aes-footer-approach">
      <div className="aes-footer-divider" aria-hidden />
      <motion.footer
        className="bg-[var(--aes-footer-bg,var(--aes-bg-dark))] text-[var(--aes-footer-ink,#fff)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduced ? undefined : footerReveal}
      >
        <div className="border-b border-white/10 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-7xl text-center">
            <BrandLogo variant="footer" href="/aesthetics" />
            <p className="mx-auto mt-6 max-w-md text-[11px] tracking-wide text-white/50">
              Details matter · Small-batch makers · Maker-vetted · Mood-first edits · Ships with care
            </p>
            <form
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-full border-0 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-[var(--aes-ink)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 text-left sm:px-6">
          <nav
            className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2 text-sm text-white/55"
            aria-label="Shop"
          >
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">Shop</span>
            <Link href="/aesthetics/shop" className="inline-flex min-h-11 items-center hover:text-white">
              All products
            </Link>
            <Link href="/aesthetics/collections" className="inline-flex min-h-11 items-center hover:text-white">
              Collections
            </Link>
            <Link href="/aesthetics/about" className="inline-flex min-h-11 items-center hover:text-white">
              About us
            </Link>
            <Link href="/aesthetics/wishlist" className="inline-flex min-h-11 items-center hover:text-white">
              Favourites
            </Link>
            <Link href="/aesthetics/account" className="inline-flex min-h-11 items-center hover:text-white">
              My account
            </Link>
          </nav>

          <nav
            className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2 text-sm text-white/55"
            aria-label="Help"
          >
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">Help</span>
            <Link href="/aesthetics/faq" className="inline-flex min-h-11 items-center hover:text-white">
              FAQ
            </Link>
            <Link href="/aesthetics/shipping" className="inline-flex min-h-11 items-center hover:text-white">
              Shipping &amp; Returns
            </Link>
            <Link href="/aesthetics/privacy" className="inline-flex min-h-11 items-center hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/aesthetics/terms" className="inline-flex min-h-11 items-center hover:text-white">
              Terms
            </Link>
            <a href="mailto:hello@onlyaesthetics.app" className="inline-flex min-h-11 items-center hover:text-white">
              hello@onlyaesthetics.app
            </a>
          </nav>
        </div>

        <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/35">
          © {new Date().getFullYear()} Only Aesthetics ·{" "}
          <Link href="/aesthetics/privacy" className="hover:text-white/70">
            Privacy
          </Link>
          {" · "}
          <Link href="/aesthetics/shipping" className="hover:text-white/70">
            Shipping &amp; Returns
          </Link>
        </div>
      </motion.footer>
    </div>
  );
}
