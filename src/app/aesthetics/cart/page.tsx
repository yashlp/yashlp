"use client";

import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { EmptyState, EMPTY_COPY } from "@/components/aesthetics/motion";
import { formatInr } from "@/lib/aesthetics/format-inr";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, cartCount } = useCart();

  return (
    <ConsumerPage cartCount={cartCount} room="calm">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">Checkout prep</p>
        <h1 className="aes-gallery-title mt-3">Your cart</h1>
        {cart.length === 0 ? (
          <EmptyState
            {...EMPTY_COPY.cart}
            actionHref="/aesthetics/shop"
            actionLabel="Continue shopping"
            className="mt-4"
          />
        ) : (
          <>
            <ul className="mt-10 space-y-6">
              {cart.map((item) => (
                <li key={item.id} className="aes-card flex gap-4 p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/aesthetics/product/${item.slug}`}
                      className="font-bold text-[var(--aes-ink)] hover:text-[var(--aes-pink)]"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-lg font-semibold text-[var(--gallery-ink,#1e1e1c)]">{formatInr(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="self-start text-sm text-[var(--gallery-muted,#6f6a63)] hover:text-[var(--gallery-blue,#2c5aa0)]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="aes-panel mt-10 p-6">
              <div className="flex justify-between text-lg">
                <span className="text-[var(--gallery-muted,#6f6a63)]">Subtotal</span>
                <span className="font-semibold text-[var(--gallery-ink,#1e1e1c)]">{formatInr(cartTotal)}</span>
              </div>
              <Link href="/aesthetics/checkout" className="mt-6 block">
                <Button className="w-full py-4">Proceed to checkout — {formatInr(cartTotal)}</Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </ConsumerPage>
  );
}
