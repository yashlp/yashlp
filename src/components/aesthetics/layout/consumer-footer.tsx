"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/aesthetics/layout/brand-logo";
import { footerReveal } from "@/lib/aesthetics/motion";
import { useAesReducedMotion } from "@/components/aesthetics/motion/use-reduced-motion";

const SHOP_LINKS = [
  { href: "/aesthetics/shop", label: "All products" },
  { href: "/aesthetics/collections", label: "Collections" },
  { href: "/aesthetics/about", label: "About us" },
  { href: "/aesthetics/wishlist", label: "My Space" },
  { href: "/aesthetics/account", label: "My account" },
  { href: "/aesthetics/become-a-maker", label: "Become a Maker" },
  { href: "/aesthetics/careers", label: "Careers" },
];

const HELP_LINKS = [
  { href: "/aesthetics/shipping", label: "Shipping Policy" },
  { href: "/aesthetics/returns", label: "Return Policy" },
  { href: "/aesthetics/refund", label: "Refund Policy" },
  { href: "/aesthetics/privacy", label: "Privacy Policy" },
  { href: "/aesthetics/terms", label: "Terms" },
  { href: "/aesthetics/faq", label: "FAQs" },
  { href: "/aesthetics/track-order", label: "Track Order" },
];

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

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
          <div>
            <p className="text-sm text-white/50">
              A curated design marketplace — calm, intentional, gallery-like.
            </p>
            <p className="mt-4 text-xs text-white/40">
              Secure payments · Easy returns · Tracked shipping nationwide
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70">Shop</p>
            <ul className="space-y-2 text-sm text-white/55">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70">Help</p>
            <ul className="space-y-2 text-sm text-white/55">
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="mailto:hello@onlyaesthetics.app" className="hover:text-white">
                  hello@onlyaesthetics.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-white/35">
          © {new Date().getFullYear()} Only Aesthetics
        </div>
      </motion.footer>
    </div>
  );
}
