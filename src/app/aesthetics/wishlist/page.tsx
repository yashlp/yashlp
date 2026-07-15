"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { ProductCard } from "@/components/aesthetics/shop/product-card";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";
import { EmptyState, EMPTY_COPY } from "@/components/aesthetics/motion";

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
          <EmptyState
            {...EMPTY_COPY.wishlist}
            actionHref="/aesthetics/shop"
            actionLabel="Browse shop"
            className="mt-4"
          />
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {wishlist.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} quickAdd variant="grid" />
            ))}
          </div>
        )}
      </main>
    </ConsumerPage>
  );
}
