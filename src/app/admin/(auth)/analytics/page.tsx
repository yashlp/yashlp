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
  sales: {
    conversionRate: number;
    sessions: number;
    cartAbandonment: number;
    checkoutAbandonment: number;
    revenueByCategory: { name: string; amount: number }[];
    revenueByCollection: { title: string; amount: number }[];
  };
  productsInsight: {
    mostViewed: { name: string; count: number }[];
    mostAddedToCart: { name: string; count: number }[];
    highestWishlist: { name: string; count: number }[];
    highestReturnRate: { name: string; rate: number; returns: number; sold: number }[];
  };
  customersInsight: {
    newVsReturning: { new: number; returning: number };
    customerLifetimeValue: number;
    repeatPurchaseRate: number;
  };
  inventoryInsight: {
    deadStock: { name: string; stock: number }[];
    fastMoving: { name: string; sold: number }[];
    slowMoving: { name: string; stock: number; sold: number }[];
    sellThroughPct: number;
  };
  marketingInsight: {
    couponPerformance: { code: string; usedCount: number; discountLabel: string; isActive: boolean }[];
    emailOpenRate: number;
    campaignRoi: number;
  };
  returnReasons: { reason: string; count: number }[];
  note?: string;
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
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Sales, products, customers, inventory, marketing</p>

      <section className="mt-10">
        <h2 className="font-semibold">Sales</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Revenue</p><p className="text-2xl font-semibold">{formatInr(stats.revenue)}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Conversion rate</p><p className="text-2xl font-semibold">{stats.sales.conversionRate}%</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Sessions</p><p className="text-2xl font-semibold">{stats.sales.sessions}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">AOV</p><p className="text-2xl font-semibold">{formatInr(stats.aov)}</p></Card>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Cart abandonment</p><p className="text-2xl font-semibold">{stats.sales.cartAbandonment}%</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Checkout abandonment</p><p className="text-2xl font-semibold">{stats.sales.checkoutAbandonment}%</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Gross profit</p><p className="text-2xl font-semibold">{formatInr(stats.grossProfit)}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Monthly growth</p><p className="text-2xl font-semibold">{stats.monthlyGrowth}%</p></Card>
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <Card hover={false}>
            <h3 className="font-medium">Revenue by category</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {stats.sales.revenueByCategory.map((c) => (
                <li key={c.name} className="flex justify-between border-b py-2">
                  <span>{c.name}</span><span>{formatInr(c.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card hover={false}>
            <h3 className="font-medium">Revenue by collection</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {stats.sales.revenueByCollection.map((c) => (
                <li key={c.title} className="flex justify-between border-b py-2">
                  <span>{c.title}</span><span>{formatInr(c.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold">Products</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {[
            ["Most viewed", stats.productsInsight.mostViewed],
            ["Most added to cart", stats.productsInsight.mostAddedToCart],
            ["Highest wishlist", stats.productsInsight.highestWishlist],
          ].map(([title, rows]) => (
            <Card key={title as string} hover={false}>
              <h3 className="font-medium">{title as string}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {(rows as { name: string; count: number }[]).map((r) => (
                  <li key={r.name + r.count} className="flex justify-between border-b py-2">
                    <span>{r.name}</span><span>{r.count}</span>
                  </li>
                ))}
                {!(rows as unknown[]).length && <li className="text-[var(--aes-dusty)]">No events yet</li>}
              </ul>
            </Card>
          ))}
          <Card hover={false}>
            <h3 className="font-medium">Highest return rate</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {stats.productsInsight.highestReturnRate.map((r) => (
                <li key={r.name} className="flex justify-between border-b py-2">
                  <span>{r.name}</span>
                  <span>{r.rate}% · {r.returns}/{r.sold}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold">Customers</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card hover={false}>
            <p className="text-sm text-[var(--aes-dusty)]">New vs returning</p>
            <p className="text-2xl font-semibold">
              {stats.customersInsight.newVsReturning.new} / {stats.customersInsight.newVsReturning.returning}
            </p>
          </Card>
          <Card hover={false}>
            <p className="text-sm text-[var(--aes-dusty)]">Customer lifetime value</p>
            <p className="text-2xl font-semibold">{formatInr(stats.customersInsight.customerLifetimeValue)}</p>
          </Card>
          <Card hover={false}>
            <p className="text-sm text-[var(--aes-dusty)]">Repeat purchase rate</p>
            <p className="text-2xl font-semibold">{stats.customersInsight.repeatPurchaseRate}%</p>
          </Card>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold">Inventory</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Sell through %</p><p className="text-2xl font-semibold">{stats.inventoryInsight.sellThroughPct}%</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Dead stock SKUs</p><p className="text-2xl font-semibold">{stats.inventoryInsight.deadStock.length}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Fast moving</p><p className="text-2xl font-semibold">{stats.inventoryInsight.fastMoving.length}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Slow moving</p><p className="text-2xl font-semibold">{stats.inventoryInsight.slowMoving.length}</p></Card>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold">Marketing</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Email open rate (est.)</p><p className="text-2xl font-semibold">{stats.marketingInsight.emailOpenRate}%</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Campaign ROI (est.)</p><p className="text-2xl font-semibold">{stats.marketingInsight.campaignRoi}x</p></Card>
        </div>
        <Card className="mt-4" hover={false}>
          <h3 className="font-medium">Coupon performance</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.marketingInsight.couponPerformance.map((c) => (
              <li key={c.code} className="flex justify-between border-b py-2">
                <span>{c.code} ({c.discountLabel})</span>
                <span>{c.usedCount} uses · {c.isActive ? "Active" : "Off"}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="font-semibold">Return reasons</h2>
        <Card className="mt-4" hover={false}>
          <ul className="space-y-2 text-sm">
            {stats.returnReasons.map((r) => (
              <li key={r.reason} className="flex justify-between border-b py-2">
                <span>{r.reason}</span><span>{r.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {stats.note && (
        <p className="mt-8 text-xs text-[var(--aes-dusty)]">{stats.note}</p>
      )}
    </div>
  );
}
