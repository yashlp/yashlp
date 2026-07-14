"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Row = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  orderCount: number;
  lifetimeValue: number;
  averageSpend: number;
  reviewCount: number;
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
      fetch(`/api/admin/customers${params}`)
        .then((r) => r.json())
        .then((d) => setCustomers(d.customers || []));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Customers</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">CRM — lifetime value, orders, and engagement</p>
      <Input
        className="mt-6 max-w-md"
        placeholder="Search name, email, phone"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="mt-8 space-y-3">
        {customers.map((c) => (
          <Card key={c.id} hover={false} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Link href={`/admin/customers/${c.id}`} className="font-semibold text-[var(--aes-royal)]">
                {c.name || c.email || c.phone || "Customer"}
              </Link>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">
                {c.email || "—"} · {c.phone || "—"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-right text-sm">
              <div>
                <p className="text-[var(--aes-dusty)]">Orders</p>
                <p className="font-semibold">{c.orderCount}</p>
              </div>
              <div>
                <p className="text-[var(--aes-dusty)]">LTV</p>
                <p className="font-semibold">{formatInr(c.lifetimeValue)}</p>
              </div>
              <div>
                <p className="text-[var(--aes-dusty)]">Avg spend</p>
                <p className="font-semibold">{formatInr(c.averageSpend)}</p>
              </div>
            </div>
          </Card>
        ))}
        {!customers.length && (
          <Card hover={false}>
            <p className="text-[var(--aes-charcoal-muted)]">No customers yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
