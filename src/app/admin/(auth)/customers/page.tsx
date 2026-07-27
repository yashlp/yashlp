"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  lifetimeSpend: number;
  totalOrders: number;
  lastOrderAt: string | null;
  lastOrderNumber: string | null;
  addressCount: number;
  wishlistCount: number;
  supportTicketCount: number;
  isBlocked: boolean;
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Customers</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Lifetime spend, order history, addresses, wishlist, support, and block controls.
      </p>

      <Card className="mt-6" hover={false}>
        <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
          Search customer
        </label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, email, phone"
        />
      </Card>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--aes-border)] bg-white">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="aes-mono border-b border-[var(--aes-border)] text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Lifetime spend</th>
              <th className="px-4 py-3">Total orders</th>
              <th className="px-4 py-3">Last order</th>
              <th className="px-4 py-3">Saved addresses</th>
              <th className="px-4 py-3">Wishlist</th>
              <th className="px-4 py-3">Support tickets</th>
              <th className="px-4 py-3">Block customer</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-[var(--aes-border)] last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{c.name || "Guest"}</p>
                  <p className="text-xs text-[var(--aes-charcoal-muted)]">{c.email || c.phone || "—"}</p>
                </td>
                <td className="px-4 py-3">{formatInr(c.lifetimeSpend)}</td>
                <td className="px-4 py-3">{c.totalOrders}</td>
                <td className="px-4 py-3 text-[var(--aes-charcoal-muted)]">
                  {c.lastOrderNumber || "—"}
                  {c.lastOrderAt ? ` · ${new Date(c.lastOrderAt).toLocaleDateString("en-IN")}` : ""}
                </td>
                <td className="px-4 py-3">{c.addressCount}</td>
                <td className="px-4 py-3">{c.wishlistCount}</td>
                <td className="px-4 py-3">{c.supportTicketCount}</td>
                <td className="px-4 py-3">{c.isBlocked ? "Blocked" : "Active"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
