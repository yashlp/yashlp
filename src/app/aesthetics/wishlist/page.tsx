"use client";

import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";

export default function WishlistPage() {
  const { wishlist } = useCart();

  return (
    <>
      <ConsumerNav />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-display text-4xl font-semibold italic text-[var(--aes-charcoal)]">Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-[var(--aes-charcoal-muted)]">Save pieces you love while you browse the shop.</p>
            <Link href="/aesthetics/shop" className="mt-6 inline-block">
              <Button variant="secondary">Browse shop</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {wishlist.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
