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
    <ConsumerPage room="editorial">
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">Saved pieces</p>
        <h1 className="aes-gallery-title mt-3">Favourites</h1>
        {wishlist.length === 0 ? (
          <div className="aes-panel mt-12 p-10 text-center">
            <p className="text-[var(--gallery-muted,#6f6a63)]">Tap the heart on any product to save it here.</p>
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
