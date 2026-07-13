"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";

export default function WishlistPage() {
  const router = useRouter();
  const { customer, loading } = useCustomer();
  const { wishlist } = useCart();

  useEffect(() => {
    if (!loading && !customer) {
      router.replace("/aesthetics/account/login?redirect=/aesthetics/wishlist");
    }
  }, [customer, loading, router]);

  if (loading || !customer) {
    return <div className="min-h-dvh aes-site-bg" />;
  }

  return (
    <ConsumerPage tint="lavender">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">favourites</h1>
        {wishlist.length === 0 ? (
          <div className="aes-panel-lavender mt-16 p-10 text-center">
            <p className="text-[var(--aes-ink-muted)]">Tap the heart on any product to save it here.</p>
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
