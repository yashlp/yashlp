"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  customer: { name: string | null; email: string | null } | null;
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PACKED: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Orders</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Pack, ship, and deliver customer orders</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["", "CONFIRMED", "PACKED", "READY_TO_SHIP", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
          <button
            key={s || "all"}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${filter === s ? "bg-[var(--aes-charcoal)] text-white" : "bg-white border border-[var(--aes-border)]"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--aes-border)] bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="aes-mono border-b text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-[var(--aes-ivory)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-[var(--aes-royal)]">{o.orderNumber}</Link>
                </td>
                <td className="px-4 py-3 text-[var(--aes-charcoal-muted)]">{o.customer?.name || o.customer?.email || "Guest"}</td>
                <td className="px-4 py-3">{formatInr(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[o.status] || "bg-gray-100"}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-[var(--aes-dusty)]">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
