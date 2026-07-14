"use client";

import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { formatInr } from "@/lib/aesthetics/format-inr";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, cartCount } = useCart();

  return (
    <ConsumerPage cartCount={cartCount} room="calm">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">Checkout prep</p>
        <h1 className="aes-gallery-title mt-3">Your cart</h1>
        {cart.length === 0 ? (
          <div className="aes-panel mt-12 p-10 text-center">
            <p className="text-[var(--aes-ink-muted)]">Your cart is empty.</p>
            <Link href="/aesthetics/shop" className="mt-6 inline-block">
              <Button>Continue shopping</Button>
            </Link>
          </div>
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
                    <p className="mt-1 text-lg font-semibold text-[var(--aes-ink)]">{formatInr(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="self-start text-sm text-[var(--aes-ink-muted)] hover:text-[var(--aes-pink)]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="aes-panel mt-10 p-6">
              <div className="flex justify-between text-lg">
                <span className="text-[var(--aes-ink-muted)]">Subtotal</span>
                <span className="font-semibold text-[var(--aes-ink)]">{formatInr(cartTotal)}</span>
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
