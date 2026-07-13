"use client";

import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { Button } from "@/components/aesthetics/ui/button";
import { useCart } from "@/components/aesthetics/providers/cart-provider";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, cartCount } = useCart();

  return (
    <>
      <ConsumerNav cartCount={cartCount} />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="aes-display text-4xl font-semibold italic text-[var(--aes-charcoal)]">Your cart</h1>
        {cart.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-[var(--aes-charcoal-muted)]">Your cart is empty.</p>
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
                      <p className="aes-mono text-[9px] uppercase tracking-wider text-[var(--aes-dusty)]">
                      {item.brand?.name ?? "Independent"}
                    </p>
                      <Link href={`/aesthetics/product/${item.slug}`} className="font-medium hover:text-[var(--aes-royal)]">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-lg font-semibold">${item.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="self-start text-sm text-[var(--aes-charcoal-muted)] hover:text-[var(--aes-charcoal)]"
                    >
                      Remove
                    </button>
                  </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-[var(--aes-border)] pt-8">
              <div className="flex justify-between text-lg">
                <span className="text-[var(--aes-charcoal-muted)]">Subtotal</span>
                <span className="font-semibold">${cartTotal}</span>
              </div>
            <Link href="/aesthetics/checkout" className="mt-6 block">
              <Button className="w-full py-4">Proceed to checkout — ${cartTotal}</Button>
            </Link>
            </div>
          </>
        )}
      </main>
      <ConsumerFooter />
    </>
  );
}
