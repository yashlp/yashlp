"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";
import { ADMIN_QUICK_START } from "@/lib/commerce/admin-nav";

type ActionAlert = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  href: string;
  count?: number;
};

type DashboardStats = {
  actionCenter: ActionAlert[];
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
  chart: { date: string; revenue: number; orders: number }[];
  recentOrders: { id: string; orderNumber: string; total: number; status: string }[];
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const severityStyle = {
  critical: "border-red-300 bg-red-50 text-red-900",
  warning: "border-amber-300 bg-amber-50 text-amber-950",
  info: "border-[var(--aes-border)] bg-white text-[var(--aes-charcoal)]",
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
  const alerts = stats.actionCenter || [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic text-[var(--aes-charcoal)]">Dashboard</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">What needs your attention today?</p>
        </div>
        <Link href="/admin/business-health" className="text-sm font-medium text-[var(--aes-royal)]">
          Business Health →
        </Link>
      </div>

      <Card hover={false} className="mt-8 border-amber-200/80 bg-amber-50/40">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-[var(--aes-charcoal)]">Action Center</h2>
          <span className="text-xs text-[var(--aes-dusty)]">{alerts.length} items</span>
        </div>
        <ul className="mt-4 space-y-2">
          {alerts.map((a) => (
            <li key={a.id}>
              <Link
                href={a.href}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition hover:shadow-sm ${severityStyle[a.severity]}`}
              >
                <span className="mt-0.5 text-base" aria-hidden>
                  {a.severity === "info" && a.id === "all-clear" ? "✓" : "⚠"}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{a.title}</span>
                  <span className="mt-0.5 block text-sm opacity-80">{a.detail}</span>
                </span>
                <span className="text-xs font-medium opacity-70">Open</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card hover={false} className="mt-6 border-[var(--aes-royal)]/20 bg-[var(--aes-cream)]">
        <h2 className="font-semibold text-[var(--aes-charcoal)]">Quick start</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ADMIN_QUICK_START.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border border-[var(--aes-border)] bg-white px-4 py-3 transition hover:border-[var(--aes-royal)] hover:shadow-sm"
              >
                <span className="font-medium text-[var(--aes-royal)]">{item.label}</span>
                <span className="mt-0.5 block text-sm text-[var(--aes-charcoal-muted)]">— {item.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today's revenue", value: formatInr(stats.sales.today) },
          { label: "Today's orders", value: String(stats.orders.today) },
          { label: "Pending orders", value: String(stats.orders.pending) },
          { label: "Orders to pack", value: String(stats.orders.toPack) },
        ].map(({ label, value }) => (
          <Card key={label} hover={false}>
            <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Orders shipped</p>
          <p className="text-2xl font-semibold">{stats.orders.shipped}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Packed</p>
          <p className="text-2xl font-semibold">{stats.orders.packed}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Returns</p>
          <p className="text-2xl font-semibold">{stats.returns.pending}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Refund requests</p>
          <p className="text-2xl font-semibold">{stats.refunds.pending}</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Low stock alerts</p>
          <p className="text-2xl font-semibold text-red-600">{stats.inventory.lowStock}</p>
        </Card>
        <Card hover={false}>
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
            Inventory value (at cost)
          </p>
          <p className="mt-2 text-2xl font-semibold">{formatInr(stats.inventory.value)}</p>
        </Card>
        <Card hover={false}>
          <p className="text-sm text-[var(--aes-dusty)]">Customers</p>
          <p className="text-2xl font-semibold">{stats.users.customers}</p>
          <Link href="/admin/customers" className="mt-2 inline-block text-xs text-[var(--aes-royal)]">
            Open CRM →
          </Link>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
            Revenue — last 7 days
          </p>
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
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Recent orders</p>
          <ul className="mt-4 space-y-2 text-sm">
            {stats.recentOrders.slice(0, 8).map((o) => (
              <li key={o.id} className="flex justify-between border-b border-[var(--aes-border)] py-2">
                <Link href={`/admin/orders/${o.id}`} className="font-medium text-[var(--aes-royal)]">
                  {o.orderNumber}
                </Link>
                <span>
                  {formatInr(o.total)} · {o.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
