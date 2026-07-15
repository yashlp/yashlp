"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type CustomerRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  orderCount: number;
  reviewCount: number;
  lifetimeValue: number;
  createdAt: string;
  latestOrders: { orderNumber: string; status: string; total: number }[];
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    setLoading(true);
    fetch(`/api/admin/customers?${params}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Customers</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Same accounts and orders as the storefront — CRM over live commerce data
      </p>

      <div className="mt-6 max-w-md">
        <Input
          placeholder="Search name, email, or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Customers</p>
          <p className="text-2xl font-semibold">{customers.length}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Orders (listed)</p>
          <p className="text-2xl font-semibold">
            {customers.reduce((s, c) => s + c.orderCount, 0)}
          </p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Lifetime value</p>
          <p className="text-2xl font-semibold">
            {formatInr(customers.reduce((s, c) => s + c.lifetimeValue, 0))}
          </p>
        </Card>
      </div>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-[var(--aes-charcoal-muted)]">Loading…</p>}
        {!loading && customers.length === 0 && (
          <Card hover={false}>
            <p className="text-[var(--aes-charcoal-muted)]">No customers yet</p>
          </Card>
        )}
        {customers.map((c) => (
          <Card key={c.id} hover={false}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link href={`/admin/customers/${c.id}`} className="font-semibold text-[var(--aes-royal)] hover:underline">
                  {c.name || "Unnamed customer"}
                </Link>
                <p className="text-sm text-[var(--aes-charcoal-muted)]">
                  {[c.email, c.phone].filter(Boolean).join(" · ") || "No contact"}
                </p>
                <p className="mt-1 text-xs text-[var(--aes-dusty)]">
                  {c.orderCount} orders · {c.reviewCount} reviews · {c.status}
                </p>
              </div>
              <p className="text-lg font-semibold">{formatInr(c.lifetimeValue)}</p>
            </div>
            {c.latestOrders.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-[var(--aes-border)] pt-3 text-xs text-[var(--aes-charcoal-muted)]">
                {c.latestOrders.map((o) => (
                  <li key={o.orderNumber}>
                    {o.orderNumber} · {o.status} · {formatInr(o.total)}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
