"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<
    { id: string; orderNumber: string; total: number; status: string; customer: { name: string | null } | null }[]
  >([]);

  useEffect(() => {
    fetch("/api/platform-admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Orders</h1>
      <Card className="mt-8 overflow-hidden p-0" hover={false}>
        <table className="w-full text-sm">
          <thead className="bg-[var(--aes-ivory)]">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[var(--aes-border)]">
                <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.customer?.name || "—"}</td>
                <td className="px-4 py-3">${o.total}</td>
                <td className="px-4 py-3 text-[var(--aes-royal)]">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
