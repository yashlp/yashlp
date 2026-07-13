import Link from "next/link";

export function ConsumerFooter() {
  return (
    <footer className="border-t border-[var(--aes-border)] bg-[var(--aes-white)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <p className="aes-display text-2xl font-semibold italic text-[var(--aes-charcoal)]">Aesthetics</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--aes-charcoal-muted)]">
            A curated marketplace for beautiful products from independent brands.
          </p>
        </div>
        <div>
          <p className="aes-mono mb-4 text-[10px] uppercase tracking-widest text-[var(--aes-dusty)]">Shop</p>
          <ul className="space-y-2 text-sm text-[var(--aes-charcoal-muted)]">
            <li><Link href="/aesthetics/shop" className="hover:text-[var(--aes-royal)]">All Products</Link></li>
            <li><Link href="/aesthetics/collections" className="hover:text-[var(--aes-royal)]">Collections</Link></li>
            <li><Link href="/aesthetics/discover" className="hover:text-[var(--aes-royal)]">Discover Mode</Link></li>
          </ul>
        </div>
        <div>
          <p className="aes-mono mb-4 text-[10px] uppercase tracking-widest text-[var(--aes-dusty)]">Sell</p>
          <ul className="space-y-2 text-sm text-[var(--aes-charcoal-muted)]">
            <li><Link href="/seller" className="hover:text-[var(--aes-royal)]">Seller Dashboard</Link></li>
            <li><Link href="/seller/products" className="hover:text-[var(--aes-royal)]">Upload Products</Link></li>
          </ul>
        </div>
        <div>
          <p className="aes-mono mb-4 text-[10px] uppercase tracking-widest text-[var(--aes-dusty)]">Company</p>
          <ul className="space-y-2 text-sm text-[var(--aes-charcoal-muted)]">
            <li><Link href="/platform-admin" className="hover:text-[var(--aes-royal)]">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--aes-border)] py-6 text-center text-xs text-[var(--aes-charcoal-muted)]">
        © {new Date().getFullYear()} Aesthetics. Premium curated commerce.
      </div>
    </footer>
  );
}
