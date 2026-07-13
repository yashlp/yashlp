"use client";

import Link from "next/link";

export function ConsumerFooter() {
  return (
    <footer className="bg-[var(--aes-ink)] text-white">
      <div className="border-b border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="aes-display text-4xl sm:text-5xl">Join the joy</p>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/70">
            Get curated drops, discover mode tips, and exclusive offers from independent makers.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-full border-0 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--aes-pink)]"
            />
            <button
              type="submit"
              className="rounded-full bg-[var(--aes-pink)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <p className="aes-display text-3xl">Aesthetics</p>
          <p className="mt-3 text-sm text-white/60">
            Curated design marketplace — joyfully bold, effortlessly stylish.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--aes-pink)]">Shop</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/aesthetics/shop" className="hover:text-white">All products</Link></li>
            <li><Link href="/aesthetics/collections" className="hover:text-white">Collections</Link></li>
            <li><Link href="/aesthetics/discover" className="hover:text-white">Discover mode</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--aes-pink)]">Sell</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/seller" className="hover:text-white">Seller dashboard</Link></li>
            <li><Link href="/platform-admin/login" className="hover:text-white">Admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--aes-pink)]">Contact</p>
          <p className="text-sm text-white/70">hello@aesthetics.app</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Aesthetics — Curated design marketplace
      </div>
    </footer>
  );
}
