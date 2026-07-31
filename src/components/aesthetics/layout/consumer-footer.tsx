"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { footerReveal } from "@/lib/aesthetics/motion";
import { useAesReducedMotion } from "@/components/aesthetics/motion/use-reduced-motion";
import { useBrandSettings } from "@/components/aesthetics/hooks/use-brand-settings";

export function ConsumerFooter() {
  const reduced = useAesReducedMotion();
  const brand = useBrandSettings();

  return (
    <div className="aes-footer-approach">
      <div className="aes-footer-divider" aria-hidden />
      <motion.footer
        className="bg-[var(--aes-footer-bg,var(--aes-bg-dark))] text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduced ? undefined : footerReveal}
      >
        <div className="aes-footer-content border-b border-white/20 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-7xl text-center">
            <BrandLogo variant="footer" href="/aesthetics" />
            <p className="mx-auto mt-6 max-w-md text-[11px] tracking-wide text-white">
              Details matter · Small-batch makers · Maker-vetted · Ships with care
            </p>
            <form
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
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

        <div className="aes-footer-content mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 text-left text-white sm:px-6">
          <nav aria-label="Shop">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white">Shop</p>
            <ul className="space-y-1 text-sm text-white">
              <li>
                <Link href="/aesthetics/shop" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/aesthetics/about" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/aesthetics/wishlist" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  Favourites
                </Link>
              </li>
              <li>
                <Link href="/aesthetics/account" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  My account
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Help">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white">Help</p>
            <ul className="space-y-1 text-sm text-white">
              <li>
                <Link href="/aesthetics/contact" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/aesthetics/faq" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/aesthetics/shipping" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/aesthetics/privacy" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/aesthetics/terms" className="inline-flex min-h-11 items-center text-white hover:opacity-85">
                  Terms
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${brand.supportEmail}`}
                  className="inline-flex min-h-11 items-center text-white hover:opacity-85"
                >
                  {brand.supportEmail}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="aes-footer-content border-t border-white/20 px-4 py-6 text-center text-xs text-white">
          © {new Date().getFullYear()} {brand.siteName} ·{" "}
          <Link href="/aesthetics/privacy" className="text-white hover:opacity-85">
            Privacy
          </Link>
          {" · "}
          <Link href="/aesthetics/shipping" className="text-white hover:opacity-85">
            Shipping &amp; Returns
          </Link>
        </div>
      </motion.footer>
    </div>
  );
}
