"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useCart } from "@/components/aesthetics/providers/cart-provider";
import { EmptyState, EMPTY_COPY } from "@/components/aesthetics/motion";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const FREE_SHIPPING = 999;
const SHIPPING_FEE = 49;
const GST_RATE = 0.18;

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartCount, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "demo">("razorpay");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
  });

  useEffect(() => {
    fetch("/api/commerce/payments/create")
      .then((r) => r.json())
      .then((d) => {
        const enabled = Boolean(d.razorpay);
        setRazorpayEnabled(enabled);
        if (!enabled) setPaymentMethod("demo");
      })
      .catch(() => {
        setRazorpayEnabled(false);
        setPaymentMethod("demo");
      });
  }, []);

  const shipping = cartTotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const tax = Math.round(cartTotal * GST_RATE * 100) / 100;
  const total = cartTotal + shipping + tax;

  async function placeOrder() {
    const res = await fetch("/api/commerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        paymentMethod,
        items: cart.map((p) => ({
          productId: p.id,
          quantity: 1,
          unitPrice: p.price,
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Checkout failed");
    return data.order;
  }

  async function openRazorpay(order: { id: string; orderNumber: string; total: number }) {
    const payRes = await fetch("/api/commerce/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id }),
    });
    const payData = await payRes.json();
    if (!payRes.ok) throw new Error(payData.error || "Payment init failed");

    return new Promise<void>((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error("Razorpay script not loaded"));
        return;
      }
      const rzp = new window.Razorpay({
        key: payData.keyId,
        amount: payData.amount,
        currency: payData.currency,
        name: "Only Aesthetics",
        description: order.orderNumber,
        order_id: payData.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/commerce/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) reject(new Error(verifyData.error || "Payment verification failed"));
          else resolve();
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#2B4ACB" },
      });
      rzp.open();
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const order = await placeOrder();

      if (paymentMethod === "razorpay" && razorpayEnabled) {
        await openRazorpay(order);
      }

      clearCart();
      const params = new URLSearchParams({
        orderId: order.id,
        orderNumber: order.orderNumber,
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
      <ConsumerPage cartCount={cartCount} room="calm">
        <main className="mx-auto max-w-lg px-4 py-12">
          <EmptyState
            {...EMPTY_COPY.cart}
            actionHref="/aesthetics/shop"
            actionLabel="Continue shopping"
          />
        </main>
      </ConsumerPage>
    );
  }

  return (
    <ConsumerPage cartCount={cartCount} room="calm">
      {razorpayEnabled && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="aes-gallery-eyebrow">Secure payment</p>
        <h1 className="aes-gallery-title mt-3">Checkout</h1>

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
              <Input placeholder="PIN code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
              <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>

            <div className="space-y-2 border-t border-[var(--aes-border)] pt-4">
              <p className="text-sm font-semibold text-[var(--aes-ink)]">Payment — online only (India)</p>
              {razorpayEnabled ? (
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="pay" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} />
                  UPI · Cards · Net Banking · Wallets (Razorpay)
                </label>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="pay" checked={paymentMethod === "demo"} onChange={() => setPaymentMethod("demo")} />
                  Pay online (demo mode — UPI / Card / Net Banking)
                </label>
              )}
              <p className="text-xs text-[var(--aes-ink-muted)]">Cash on delivery is not available. All prices in ₹ INR.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full py-4" disabled={loading}>
              {loading ? "Placing order…" : `Place order — ${formatInr(total)}`}
            </Button>
          </form>

          <div className="aes-panel p-6 sm:p-8">
            <h2 className="font-semibold text-[var(--gallery-ink,#1e1e1c)]">Order summary</h2>
            <ul className="mt-4 space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--aes-ink)]">{item.name}</p>
                    <p className="text-sm text-[var(--aes-ink-muted)]">{formatInr(item.price)}</p>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="aes-touch px-2 text-xs text-[var(--aes-ink-soft)] hover:text-[var(--aes-pink)]">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-[var(--aes-border)] pt-4 text-sm text-[var(--aes-ink)]">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatInr(cartTotal)}</span></div>
              <div className="flex justify-between"><span>GST (18%)</span><span>{formatInr(tax)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatInr(shipping)}</span></div>
              <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatInr(total)}</span></div>
            </div>
          </div>
        </div>
      </main>
    </ConsumerPage>
  );
}
