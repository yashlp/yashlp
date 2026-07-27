"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";

type CityStat = {
  city: string;
  orders: number;
  revenue: number;
};

type Stats = {
  revenue: number;
  grossProfit: number;
  gstCollected: number;
  orderCount: number;
  aov: number;
  monthlyGrowth: number;
  repeatRate: number;
  conversionRate: number;
  repeatCustomers: number;
  bestSelling: { name: string; sold: number; price: number }[];
  slowMoving: { name: string; stock: number; sold: number }[];
  topCities: CityStat[];
  salesByCollection: { name: string; revenue: number }[];
  salesBySupplier: { name: string; revenue: number }[];
  refundAnalysis: { requested: number; processed: number; amount: number };
  cityInsights: {
    citiesTracked: number;
    ordersWithCity: number;
    ordersMissingCity: number;
    sampleSize: number;
  };
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

  const maxCityOrders = Math.max(...(stats.topCities?.map((c) => c.orders) || [0]), 1);
  const topCity = stats.topCities?.[0];

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Analytics</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Revenue, cities, and inventory insights</p>

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
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Conversion rate (orders cleared)</p><p className="text-2xl font-semibold">{stats.conversionRate}%</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Returning customers</p><p className="text-2xl font-semibold">{stats.repeatCustomers}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Refund amount</p><p className="text-2xl font-semibold">{formatInr(stats.refundAnalysis.amount)}</p></Card>
      </div>

      <Card hover={false} className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold">Orders by city</h2>
            <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
              Where most orders are coming from
              {topCity ? ` — leading city: ${topCity.city}` : ""}
            </p>
          </div>
          <p className="text-xs text-[var(--aes-dusty)]">
            {stats.cityInsights?.citiesTracked || 0} cities · {stats.cityInsights?.sampleSize || 0} orders scanned
          </p>
        </div>

        {!stats.topCities?.length ? (
          <p className="mt-6 text-sm text-[var(--aes-dusty)]">
            No city data yet. New checkouts store city automatically; older orders are parsed from the delivery address when possible.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {stats.topCities.map((c, index) => (
              <li key={c.city}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[var(--aes-ink)]">
                    <span className="mr-2 text-[var(--aes-dusty)]">{index + 1}.</span>
                    {c.city}
                  </span>
                  <span className="text-[var(--aes-charcoal-muted)]">
                    {c.orders} order{c.orders === 1 ? "" : "s"} · {formatInr(c.revenue)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--aes-border)]">
                  <div
                    className="h-full rounded-full bg-[var(--aes-royal)]"
                    style={{ width: `${Math.max(6, (c.orders / maxCityOrders) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

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
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Sales by collection</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.salesByCollection.map((c) => (
              <li key={c.name} className="flex justify-between border-b py-2">
                <span>{c.name}</span>
                <span className="text-[var(--aes-charcoal-muted)]">{formatInr(c.revenue)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card hover={false}>
          <h2 className="font-semibold">Sales by supplier</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.salesBySupplier.map((s) => (
              <li key={s.name} className="flex justify-between border-b py-2">
                <span>{s.name}</span>
                <span className="text-[var(--aes-charcoal-muted)]">{formatInr(s.revenue)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
