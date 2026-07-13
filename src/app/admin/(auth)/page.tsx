"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";

type DashboardStats = {
  sales: { today: number; week: number; month: number; year: number };
  orders: { pending: number; delivered: number; cancelled: number };
  refunds: { pending: number };
  users: { customers: number; sellers: number };
  alerts: { lowStock: number };
  chart: { date: string; revenue: number; orders: number }[];
  recentOrders: { id: string; orderNumber: string; total: number; status: string }[];
};

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
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Commerce management overview</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today", value: `$${stats.sales.today.toFixed(0)}` },
          { label: "This week", value: `$${stats.sales.week.toFixed(0)}` },
          { label: "This month", value: `$${stats.sales.month.toFixed(0)}` },
          { label: "This year", value: `$${stats.sales.year.toFixed(0)}` },
        ].map(({ label, value }) => (
          <Card key={label} hover={false}>
            <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Pending orders</p><p className="text-2xl font-semibold">{stats.orders.pending}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Delivered</p><p className="text-2xl font-semibold">{stats.orders.delivered}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Refund requests</p><p className="text-2xl font-semibold">{stats.refunds.pending}</p></Card>
        <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Low stock alerts</p><p className="text-2xl font-semibold">{stats.alerts.lowStock}</p></Card>
      </div>

      <Card className="mt-8" hover={false}>
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

      <Card className="mt-8" hover={false}>
        <h2 className="font-semibold">Recent orders</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {stats.recentOrders.map((o) => (
            <li key={o.id} className="flex justify-between border-b border-[var(--aes-border)] py-2">
              <span>{o.orderNumber}</span>
              <span className="text-[var(--aes-charcoal-muted)]">{o.status} · ${o.total}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
