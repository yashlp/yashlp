"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";

type Snapshot = {
  revenueToday: number;
  revenueYesterday: number;
  revenueDeltaPct: number;
  profitMargin: number;
  inventoryAtRisk: { lowStock: number; deadStock: number };
  ordersDelayed: number;
  failedPayments: number;
  averageRating: number;
  customers: { new: number; returning: number };
  bestCollection: { title: string; revenue: number };
  worstProducts: { id: string; name: string; sold: number; stock: number; rating: number }[];
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function BusinessHealthPage() {
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    fetch("/api/admin/business-health")
      .then((r) => r.json())
      .then((d) => setSnap(d.snapshot));
  }, []);

  if (!snap) return <div className="aes-skeleton h-40 rounded-2xl" />;

  return (
    <div>
      <Link href="/admin" className="text-sm text-[var(--aes-royal)]">
        ← Dashboard
      </Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">Business Health</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">At-a-glance pulse of revenue, ops risk, and customers</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">💰 Revenue today vs yesterday</p>
          <p className="mt-2 text-2xl font-semibold">{formatInr(snap.revenueToday)}</p>
          <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
            Yesterday {formatInr(snap.revenueYesterday)} · {snap.revenueDeltaPct >= 0 ? "+" : ""}
            {snap.revenueDeltaPct}%
          </p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">📈 Profit margin (today)</p>
          <p className="mt-2 text-2xl font-semibold">{snap.profitMargin}%</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">📦 Inventory at risk</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">{snap.inventoryAtRisk.lowStock} low</p>
          <p className="mt-1 text-sm">{snap.inventoryAtRisk.deadStock} dead stock SKUs</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">🚚 Orders delayed</p>
          <p className="mt-2 text-2xl font-semibold">{snap.ordersDelayed}</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">💳 Failed payments</p>
          <p className="mt-2 text-2xl font-semibold">{snap.failedPayments}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">⭐ Average rating</p>
          <p className="mt-2 text-2xl font-semibold">{snap.averageRating || "—"}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">👥 New vs returning</p>
          <p className="mt-2 text-2xl font-semibold">
            {snap.customers.new} / {snap.customers.returning}
          </p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">🎯 Best collection</p>
          <p className="mt-2 text-lg font-semibold">{snap.bestCollection.title}</p>
          <p className="text-sm text-[var(--aes-charcoal-muted)]">{formatInr(snap.bestCollection.revenue)}</p>
        </Card>
      </div>

      <Card className="mt-8" hover={false}>
        <h2 className="font-semibold">📉 Worst-performing products</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {snap.worstProducts.map((p) => (
            <li key={p.id} className="flex justify-between border-b py-2">
              <span>{p.name}</span>
              <span className="text-[var(--aes-charcoal-muted)]">
                {p.sold} sold · {p.stock} stock · ★{p.rating}
              </span>
            </li>
          ))}
          {!snap.worstProducts.length && (
            <li className="text-[var(--aes-charcoal-muted)]">No product data yet</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
