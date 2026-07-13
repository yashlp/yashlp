"use client";

import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";

export default function WishlistPage() {
  const { wishlist } = useCart();

  return (
    <ConsumerPage tint="lavender">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="aes-panel-lavender mt-16 p-10 text-center">
            <p className="text-[var(--aes-ink-muted)]">Save pieces you love while you browse the shop.</p>
            <Link href="/aesthetics/shop" className="mt-6 inline-block">
              <Button variant="secondary">Browse shop</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
            ))}
          </div>
        )}
      </main>
    </ConsumerPage>
  );
}
