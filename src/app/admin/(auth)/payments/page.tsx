"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";

type Payment = {
  id: string;
  amount: number;
  status: string;
  provider: string;
  createdAt: string;
  order: { orderNumber: string; status: string };
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [daily, setDaily] = useState({ revenue: 0, count: 0 });

  const [gstCollected, setGstCollected] = useState(0);

  useEffect(() => {
    fetch("/api/admin/payments").then((r) => r.json()).then((d) => {
      setPayments(d.payments || []);
      setDaily(d.daily || { revenue: 0, count: 0 });
      setGstCollected(d.gstCollected || 0);
    });
  }, []);

  const successful = payments.filter((p) => p.status === "SUCCESS" || p.status === "PAID");
  const failed = payments.filter((p) => p.status === "FAILED");
  const pending = payments.filter((p) => p.status === "PENDING");
  const online = payments.filter((p) => p.provider === "razorpay" || p.provider === "demo");

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Payments</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Online only — UPI, cards, and net banking (no COD)</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Today&apos;s revenue</p><p className="text-2xl font-semibold">{formatInr(daily.revenue)}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">GST collected</p><p className="text-2xl font-semibold">{formatInr(gstCollected)}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Successful</p><p className="text-2xl font-semibold">{successful.length}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Failed / pending</p><p className="text-2xl font-semibold">{failed.length + pending.length}</p></Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Online payments</p><p className="text-2xl font-semibold">{online.length}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">COD</p><p className="text-2xl font-semibold">Disabled</p></Card>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-[10px] uppercase text-[var(--aes-dusty)]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3">{p.order.orderNumber}</td>
                <td className="px-4 py-3">{formatInr(p.amount)}</td>
                <td className="px-4 py-3 uppercase">{p.provider}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
