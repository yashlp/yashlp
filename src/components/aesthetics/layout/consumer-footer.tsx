import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ConsumerFooter() {
  return (
    <footer className="bg-[var(--aes-forest-deep)] text-[var(--aes-sand)]">
      <div className="border-b border-[var(--aes-border-light)] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="aes-serif text-2xl italic text-[var(--aes-sand)]/80 sm:text-3xl">
            &ldquo;The world can wait — take a day to breathe.&rdquo;
          </p>
          <Link
            href="/aesthetics/discover"
            className="mt-10 inline-flex items-center gap-2 border border-[var(--aes-sand)]/40 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--aes-sand)] transition hover:bg-[var(--aes-sand)] hover:text-[var(--aes-forest-deep)]"
          >
            Start discovering
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">
        <div>
          <p className="aes-display text-2xl text-[var(--aes-sand)]">Aesthetics</p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--aes-sand)]/60">
            A luxury wellness marketplace — curated objects for mindful living, delivered with care.
          </p>
        </div>
        <div>
          <p className="aes-label mb-4 text-[var(--aes-gold-soft)]">Shop</p>
          <ul className="space-y-2.5 text-sm text-[var(--aes-sand)]/70">
            <li><Link href="/aesthetics/shop" className="hover:text-[var(--aes-sand)]">All products</Link></li>
            <li><Link href="/aesthetics/collections" className="hover:text-[var(--aes-sand)]">Collections</Link></li>
            <li><Link href="/aesthetics/discover" className="hover:text-[var(--aes-sand)]">Discover mode</Link></li>
          </ul>
        </div>
        <div>
          <p className="aes-label mb-4 text-[var(--aes-gold-soft)]">Sell</p>
          <ul className="space-y-2.5 text-sm text-[var(--aes-sand)]/70">
            <li><Link href="/seller" className="hover:text-[var(--aes-sand)]">Seller dashboard</Link></li>
            <li><Link href="/platform-admin/login" className="hover:text-[var(--aes-sand)]">Admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="aes-label mb-4 text-[var(--aes-gold-soft)]">Reach us</p>
          <p className="text-sm text-[var(--aes-sand)]/70">
            hello@aesthetics.app
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--aes-border-light)] py-6 text-center text-xs text-[var(--aes-sand)]/40">
        © {new Date().getFullYear()} Aesthetics — Luxury wellness marketplace
      </div>
    </footer>
  );
}
