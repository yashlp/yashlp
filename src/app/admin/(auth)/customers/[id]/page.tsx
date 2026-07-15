"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<{
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    status: string;
    notes: string | null;
    lifetimeValue: number;
    orders: { id: string; orderNumber: string; status: string; total: number; createdAt: string }[];
    reviews: { id: string; rating: number; title: string | null; status: string; product: { name: string } }[];
    addresses: { line1: string; city: string; postalCode: string; isDefault: boolean }[];
  } | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/customers/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setCustomer(d.customer || null);
        setNotes(d.customer?.notes || "");
      });
  }, [params.id]);

  async function saveNotes() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/customers/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setCustomer((c) => (c ? { ...c, notes: data.customer.notes } : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!customer) {
    return <p className="text-sm text-[var(--aes-charcoal-muted)]">Loading customer…</p>;
  }

  return (
    <div>
      <Link href="/admin/customers" className="text-sm text-[var(--aes-royal)]">
        ← Customers
      </Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">
        {customer.name || "Customer"}
      </h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        {[customer.email, customer.phone].filter(Boolean).join(" · ")} · {customer.status}
      </p>
      <p className="mt-2 text-lg font-semibold">LTV {formatInr(customer.lifetimeValue)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Internal notes</h2>
          <textarea
            className="mt-3 w-full rounded-xl border border-[var(--aes-border)] bg-white p-3 text-sm"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <Button className="mt-3" type="button" onClick={saveNotes} disabled={saving}>
            {saving ? "Saving…" : "Save notes"}
          </Button>
        </Card>

        <Card hover={false}>
          <h2 className="font-semibold">Addresses</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--aes-charcoal-muted)]">
            {customer.addresses.length === 0 && <li>No saved addresses</li>}
            {customer.addresses.map((a, i) => (
              <li key={`${a.line1}-${i}`}>
                {a.line1}, {a.city} {a.postalCode}
                {a.isDefault ? " · default" : ""}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card hover={false} className="mt-6">
        <h2 className="font-semibold">Orders from storefront</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {customer.orders.length === 0 && (
            <li className="text-[var(--aes-charcoal-muted)]">No orders yet</li>
          )}
          {customer.orders.map((o) => (
            <li key={o.id} className="flex justify-between gap-3 border-b border-[var(--aes-border)] py-2">
              <Link href={`/admin/orders/${o.id}`} className="text-[var(--aes-royal)] hover:underline">
                {o.orderNumber}
              </Link>
              <span>
                {o.status} · {formatInr(o.total)}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card hover={false} className="mt-6">
        <h2 className="font-semibold">Reviews</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--aes-charcoal-muted)]">
          {customer.reviews.length === 0 && <li>No reviews</li>}
          {customer.reviews.map((r) => (
            <li key={r.id}>
              {r.rating}★ · {r.product.name} · {r.title || "Untitled"} · {r.status}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
