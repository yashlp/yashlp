"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";
import { ADMIN_QUICK_ACTIONS } from "@/lib/commerce/admin-nav";

type DashboardStats = {
  sales: { today: number; week: number; month: number; year: number };
  orders: {
    today: number;
    pending: number;
    toPack: number;
    packed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  refunds: { pending: number };
  returns: { pending: number };
  inventory: { value: number; lowStock: number };
  users: { customers: number; suppliers: number };
  topProducts: { id: string; name: string; slug: string; sold: number }[];
  bestCategories: { name: string; revenue: number }[];
  topCities: { city: string; orders: number; revenue: number }[];
  chart: { date: string; revenue: number; orders: number }[];
  recentOrders: { id: string; orderNumber: string; total: number; status: string }[];
  taskWidgets: {
    newOrdersToday: number;
    ordersAwaitingPacking: number;
    ordersAwaitingPickup: number;
    todayProfit: number;
    bestSellerToday: { id: string; name: string; slug: string; sold: number } | null;
    lowStockTop5: { id: string; name: string; stock: number; minStock: number; slug: string }[];
    failedPayments: number;
    newReviewsAwaitingApproval: number;
    revenueVsYesterdayPct: number;
  };
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then(setStats)
      .catch(() => setError("Could not load dashboard. Sign in again."));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <div className="aes-skeleton h-40 rounded-2xl" />;

  const maxRevenue = Math.max(...stats.chart.map((c) => c.revenue), 1);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic text-[var(--aes-charcoal)]">Dashboard</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Only Aesthetic — direct-to-consumer operations</p>

      <Card hover={false} className="mt-8 border-[var(--aes-royal)]/20 bg-[var(--aes-cream)]">
        <h2 className="font-semibold text-[var(--aes-charcoal)]">Quick actions</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ADMIN_QUICK_ACTIONS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border border-[var(--aes-border)] bg-white px-4 py-3 transition hover:border-[var(--aes-royal)] hover:shadow-sm"
              >
                <span className="font-medium text-[var(--aes-royal)]">➕ {item.label}</span>
                <span className="mt-0.5 block text-sm text-[var(--aes-charcoal-muted)]">— {item.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "🛒 New Orders (Today)", value: String(stats.taskWidgets.newOrdersToday) },
          { label: "📦 Orders Awaiting Packing", value: String(stats.taskWidgets.ordersAwaitingPacking) },
          { label: "🚚 Orders Awaiting Pickup", value: String(stats.taskWidgets.ordersAwaitingPickup) },
          { label: "💰 Today's Profit", value: formatInr(stats.taskWidgets.todayProfit) },
        ].map(({ label, value }) => (
          <Card key={label} hover={false}>
            <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">🔥 Best Seller Today</p>
          <p className="mt-1 text-base font-semibold">
            {stats.taskWidgets.bestSellerToday?.name || "No sales yet"}
          </p>
          {stats.taskWidgets.bestSellerToday && (
            <p className="text-xs text-[var(--aes-charcoal-muted)]">{stats.taskWidgets.bestSellerToday.sold} sold</p>
          )}
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">❌ Failed Payments</p>
          <p className="text-2xl font-semibold">{stats.taskWidgets.failedPayments}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">⭐ Reviews Awaiting Approval</p>
          <p className="text-2xl font-semibold">{stats.taskWidgets.newReviewsAwaitingApproval}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">📈 Revenue vs Yesterday</p>
          <p className="text-2xl font-semibold">{stats.taskWidgets.revenueVsYesterdayPct.toFixed(1)}%</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">⚠️ Low Stock (Top 5)</p>
          <ul className="mt-2 space-y-1 text-sm">
            {stats.taskWidgets.lowStockTop5.length === 0 ? (
              <li className="text-[var(--aes-charcoal-muted)]">No low stock alerts</li>
            ) : (
              stats.taskWidgets.lowStockTop5.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span className="truncate">{p.name}</span>
                  <span className="text-red-600">{p.stock}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
        <Card hover={false}>
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Inventory value (at cost)</p>
          <p className="mt-2 text-2xl font-semibold">{formatInr(stats.inventory.value)}</p>
        </Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Delivered orders</p><p className="text-2xl font-semibold">{stats.orders.delivered}</p></Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Revenue — last 7 days</p>
          <div className="mt-6 flex h-36 items-end gap-2">
            {stats.chart.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-[var(--aes-royal)] opacity-85"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: d.revenue > 0 ? 8 : 0 }}
                />
                <span className="aes-mono text-[8px] text-[var(--aes-dusty)]">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false}>
          <h2 className="font-semibold">Top selling products</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.topProducts.length === 0 && <li className="text-[var(--aes-dusty)]">No sales yet</li>}
            {stats.topProducts.map((p) => (
              <li key={p.id} className="flex justify-between border-b border-[var(--aes-border)] py-2">
                <Link href={`/admin/products/${p.id}/edit`} className="hover:text-[var(--aes-royal)]">{p.name}</Link>
                <span className="text-[var(--aes-charcoal-muted)]">{p.sold} sold</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Best performing categories</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.bestCategories.length === 0 && <li className="text-[var(--aes-dusty)]">No category data yet</li>}
            {stats.bestCategories.map((c) => (
              <li key={c.name} className="flex justify-between border-b border-[var(--aes-border)] py-2">
                <span>{c.name}</span>
                <span className="text-[var(--aes-charcoal-muted)]">{formatInr(c.revenue)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card hover={false}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Top cities by orders</h2>
            <Link href="/admin/analytics" className="text-xs text-[var(--aes-royal)] hover:underline">
              Full analytics →
            </Link>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {(stats.topCities || []).length === 0 && (
              <li className="text-[var(--aes-dusty)]">No city data yet — appears after checkouts</li>
            )}
            {(stats.topCities || []).map((c) => (
              <li key={c.city} className="flex justify-between border-b border-[var(--aes-border)] py-2">
                <span>{c.city}</span>
                <span className="text-[var(--aes-charcoal-muted)]">
                  {c.orders} orders · {formatInr(c.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card hover={false} className="mt-6">
        <h2 className="font-semibold">Recent orders</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {stats.recentOrders.map((o) => (
            <li key={o.id} className="flex justify-between border-b border-[var(--aes-border)] py-2">
              <Link href="/admin/orders" className="hover:text-[var(--aes-royal)]">{o.orderNumber}</Link>
              <span className="text-[var(--aes-charcoal-muted)]">{o.status} · {formatInr(o.total)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
