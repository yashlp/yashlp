"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useCart } from "@/components/aesthetics/providers/cart-provider";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartCount, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  const shipping = cartTotal >= 75 ? 0 : 8;
  const total = cartTotal + shipping;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map((p) => ({
            productId: p.id,
            quantity: 1,
            unitPrice: p.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      clearCart();
      const params = new URLSearchParams({
        orderId: data.order.id,
        orderNumber: data.order.orderNumber,
        name: form.name,
        email: form.email,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2 || "",
        city: form.city,
        state: form.state || "",
        postalCode: form.postalCode,
        country: form.country,
      });
      router.push(`/aesthetics/checkout/success?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (!cart.length) {
    return (
      <ConsumerPage cartCount={cartCount} tint="peach">
        <main className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="text-[var(--aes-ink-muted)]">Your cart is empty.</p>
          <Link href="/aesthetics/shop" className="mt-6 inline-block">
            <Button>Continue shopping</Button>
          </Link>
        </main>
      </ConsumerPage>
    );
  }

  return (
    <ConsumerPage cartCount={cartCount} tint="peach">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="aes-joy-title-lower text-[var(--aes-ink)]">checkout</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <form onSubmit={submit} className="aes-panel space-y-4 p-6 sm:p-8">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input type="tel" placeholder="Mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input placeholder="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
            <Input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
              <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full py-4" disabled={loading}>
              {loading ? "Placing order…" : `Place order — $${total.toFixed(2)}`}
            </Button>
          </form>

          <div className="aes-panel-lavender p-6 sm:p-8">
            <h2 className="font-bold text-[var(--aes-ink)]">Order summary</h2>
            <ul className="mt-4 space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--aes-ink)]">{item.name}</p>
                    <p className="text-sm text-[var(--aes-ink-muted)]">${item.price}</p>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="text-xs text-[var(--aes-ink-soft)] hover:text-[var(--aes-pink)]">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-[var(--aes-border)] pt-4 text-sm text-[var(--aes-ink)]">
              <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="flex justify-between text-base font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </main>
    </ConsumerPage>
  );
}
