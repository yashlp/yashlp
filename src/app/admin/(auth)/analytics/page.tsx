"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";

type Stats = {
  revenue: number;
  grossProfit: number;
  gstCollected: number;
  orderCount: number;
  aov: number;
  monthlyGrowth: number;
  repeatRate: number;
  bestSelling: { name: string; sold: number; price: number }[];
  slowMoving: { name: string; stock: number; sold: number }[];
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics").then((r) => r.json()).then((d) => setStats(d.stats));
  }, []);

  if (!stats) return <div className="aes-skeleton h-40 rounded-2xl" />;

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Analytics</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Revenue, profit, and inventory insights</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Monthly revenue</p><p className="text-2xl font-semibold">{formatInr(stats.revenue)}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Gross profit</p><p className="text-2xl font-semibold">{formatInr(stats.grossProfit)}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Avg order value</p><p className="text-2xl font-semibold">{formatInr(stats.aov)}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Monthly growth</p><p className="text-2xl font-semibold">{stats.monthlyGrowth}%</p></Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">GST collected</p><p className="text-2xl font-semibold">{formatInr(stats.gstCollected)}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Orders this month</p><p className="text-2xl font-semibold">{stats.orderCount}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Repeat customer rate</p><p className="text-2xl font-semibold">{stats.repeatRate}%</p></Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Best-selling products</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.bestSelling.map((p) => (
              <li key={p.name} className="flex justify-between border-b py-2">
                <span>{p.name}</span>
                <span className="text-[var(--aes-charcoal-muted)]">{p.sold} sold</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card hover={false}>
          <h2 className="font-semibold">Slow-moving inventory</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.slowMoving.map((p) => (
              <li key={p.name} className="flex justify-between border-b py-2">
                <span>{p.name}</span>
                <span className="text-[var(--aes-charcoal-muted)]">{p.stock} in stock · {p.sold} sold</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6" hover={false}>
        <p className="text-sm text-[var(--aes-charcoal-muted)]">Cart abandonment tracking requires storefront session analytics — connect PostHog or Google Analytics for full funnel data.</p>
      </Card>
    </div>
  );
}
