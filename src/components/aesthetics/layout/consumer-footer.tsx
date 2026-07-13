import Link from "next/link";
import { Instagram, ArrowUpRight } from "lucide-react";

export function ConsumerFooter() {
  return (
    <footer className="mt-8 border-t border-[var(--aes-border)] bg-[var(--aes-ink)] text-white">
      <div className="bg-[var(--aes-gradient-brand)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="aes-display text-3xl font-extrabold sm:text-4xl">Join the aesthetic</h2>
          <p className="aes-serif mx-auto mt-3 max-w-md text-lg italic text-white/85">
            Curated objects from independent studios, delivered with gallery care.
          </p>
          <Link
            href="/aesthetics/discover"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[var(--aes-ink)] shadow-xl transition hover:scale-105"
          >
            Start discovering
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">Æ</span>
            <span className="aes-display text-xl font-bold">Aesthetics</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            A colourful curated marketplace for art, design, and independent brands.
          </p>
        </div>
        <div>
          <p className="aes-mono mb-4 text-[10px] uppercase tracking-widest text-white/40">Shop</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/aesthetics/shop" className="hover:text-white">All products</Link></li>
            <li><Link href="/aesthetics/collections" className="hover:text-white">Collections</Link></li>
            <li><Link href="/aesthetics/discover" className="hover:text-white">Discover mode</Link></li>
          </ul>
        </div>
        <div>
          <p className="aes-mono mb-4 text-[10px] uppercase tracking-widest text-white/40">Sell</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/seller" className="hover:text-white">Seller dashboard</Link></li>
            <li><Link href="/platform-admin/login" className="hover:text-white">Admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="aes-mono mb-4 text-[10px] uppercase tracking-widest text-white/40">Follow</p>
          <a href="#" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <Instagram className="h-4 w-4" /> @aesthetics
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Aesthetics — Art & design marketplace
      </div>
    </footer>
  );
}
