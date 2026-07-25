"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";
import { useBrandSettings } from "@/components/aesthetics/hooks/use-brand-settings";
import { ContactForm } from "@/components/aesthetics/contact/contact-form";
import { formatInr } from "@/lib/aesthetics/format-inr";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  courier: string | null;
  trackingNumber: string | null;
  items: { product: { name: string }; quantity: number }[];
  returns: { id: string; status: string }[];
};

type ReturnRow = {
  id: string;
  status: string;
  reason: string | null;
  type: string;
  createdAt: string;
  order: { orderNumber: string; total: number; status: string };
};

type Tab = "orders" | "refunds" | "contact";

export default function AccountPage() {
  const router = useRouter();
  const { customer, loading, logout } = useCustomer();
  const brand = useBrandSettings();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRow[]>([]);
  const [refundOrderId, setRefundOrderId] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !customer) {
      router.replace("/aesthetics/account/login?redirect=/aesthetics/account");
    }
  }, [customer, loading, router]);

  useEffect(() => {
    if (!customer) return;
    fetch("/api/commerce/orders/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]));
    fetch("/api/commerce/returns/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setReturns(d.returns || []))
      .catch(() => setReturns([]));
  }, [customer]);

  async function requestRefund(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch("/api/commerce/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderId: refundOrderId, reason: refundReason, type: "REFUND" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not submit refund request");
      return;
    }
    setMessage("Refund request submitted. Track status in the Refunds tab.");
    setRefundReason("");
    setRefundOrderId("");
    const retRes = await fetch("/api/commerce/returns/me", { credentials: "include" });
    const retData = await retRes.json();
    setReturns(retData.returns || []);
    setTab("refunds");
  }

  async function handleLogout() {
    await logout();
    router.push("/aesthetics");
    router.refresh();
  }

  if (loading || !customer) {
    return <div className="min-h-dvh aes-site-bg" />;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "Order history" },
    { id: "refunds", label: "Track refund" },
    { id: "contact", label: "Contact us" },
  ];

  return (
    <ConsumerPage room="editorial">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">Member space</p>
        <h1 className="aes-gallery-title mt-3">My account</h1>
        <p className="mt-2 text-sm text-[var(--gallery-muted,#6f6a63)]">
          {customer.name || "Customer"} · {customer.email || customer.phone}
        </p>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-[var(--aes-border)] pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition",
                tab === t.id ? "bg-[var(--aes-ink)] text-white" : "bg-white/60 text-[var(--aes-ink-muted)] hover:bg-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div className="mt-8 space-y-4">
            {orders.length === 0 ? (
              <p className="text-[var(--aes-ink-muted)]">No orders yet. <Link href="/aesthetics/shop" className="text-[var(--aes-pink)]">Start shopping</Link></p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="aes-panel p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[var(--aes-ink)]">{o.orderNumber}</p>
                      <p className="text-xs text-[var(--aes-ink-muted)]">{new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.status}</p>
                    </div>
                    <p className="font-bold text-[var(--aes-ink)]">{formatInr(o.total)}</p>
                  </div>
                  <ul className="mt-3 text-sm text-[var(--aes-ink-muted)]">
                    {o.items.map((item, i) => (
                      <li key={i}>{item.product.name} × {item.quantity}</li>
                    ))}
                  </ul>
                  {o.trackingNumber && (
                    <p className="mt-3 text-sm text-[var(--aes-ink)]">
                      <span className="text-[var(--aes-ink-muted)]">Tracking · </span>
                      {o.courier || "Courier"} · <span className="font-medium">{o.trackingNumber}</span>
                    </p>
                  )}
                  {o.status === "DELIVERED" && o.returns.length === 0 && (
                    <button
                      type="button"
                      className="mt-4 text-sm font-medium text-[var(--aes-pink)] hover:underline"
                      onClick={() => {
                        setRefundOrderId(o.id);
                        setTab("contact");
                      }}
                    >
                      Request refund →
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "refunds" && (
          <div className="mt-8 space-y-4">
            {returns.length === 0 ? (
              <p className="text-[var(--aes-ink-muted)]">No refund requests yet.</p>
            ) : (
              returns.map((r) => (
                <div key={r.id} className="aes-panel p-5">
                  <p className="font-bold text-[var(--aes-ink)]">{r.order.orderNumber}</p>
                  <p className="mt-1 text-sm text-[var(--aes-ink-muted)]">Status: <span className="font-medium text-[var(--aes-ink)]">{r.status}</span></p>
                  <p className="mt-2 text-sm text-[var(--aes-ink-muted)]">{r.reason}</p>
                  <p className="mt-2 text-xs text-[var(--aes-ink-soft)]">{new Date(r.createdAt).toLocaleString("en-IN")}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "contact" && (
          <div className="mt-8 space-y-8">
            <div className="aes-panel p-6">
              <h2 className="font-bold text-[var(--aes-ink)]">Request a refund</h2>
              <form onSubmit={requestRefund} className="mt-4 space-y-4">
                <select
                  className="aes-input w-full"
                  value={refundOrderId}
                  onChange={(e) => setRefundOrderId(e.target.value)}
                  required
                >
                  <option value="">Select delivered order</option>
                  {orders
                    .filter((o) => o.status === "DELIVERED")
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} — {formatInr(o.total)}
                      </option>
                    ))}
                </select>
                <Input
                  placeholder="Reason for refund"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                {message && <p className="text-sm text-green-700">{message}</p>}
                <Button type="submit">Submit refund request</Button>
              </form>
            </div>

            <div className="aes-panel p-6">
              <h2 className="font-bold text-[var(--aes-ink)]">Contact us</h2>
              <p className="mt-2 text-sm text-[var(--aes-ink-muted)]">
                Messages go to{" "}
                <a
                  href={`mailto:${brand.supportEmail}?subject=${encodeURIComponent("Refund / order help")}`}
                  className="text-[var(--aes-pink)]"
                >
                  {brand.supportEmail}
                </a>
                {brand.supportPhone ? (
                  <>
                    {" "}
                    or WhatsApp{" "}
                    <a
                      href={`https://wa.me/${brand.supportPhone.replace(/\D/g, "")}`}
                      className="text-[var(--aes-pink)]"
                    >
                      {brand.supportPhone}
                    </a>
                  </>
                ) : null}
                .
              </p>
              <div className="mt-4">
                <ContactForm
                  defaultEmail={customer.email || ""}
                  defaultFirstName={(customer.name || "").split(" ")[0] || ""}
                  defaultLastName={(customer.name || "").split(" ").slice(1).join(" ")}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3">
          <Link href="/aesthetics/shop"><Button className="w-full">Continue shopping</Button></Link>
          <Link href="/aesthetics/wishlist" className="text-center text-sm text-[var(--aes-pink)] hover:underline">View favourites</Link>
          <button type="button" onClick={handleLogout} className="text-sm text-[var(--aes-ink-soft)] underline">
            Sign out
          </button>
        </div>
      </main>
    </ConsumerPage>
  );
}
