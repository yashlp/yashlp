"use client";

import { useEffect, useState } from "react";

type Stats = {
  users: number;
  incidents: number;
  categories: number;
  reportsToday: number;
  underReview: number;
  byStatus: Record<string, number>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sm text-stone-400">Loading stats…</p>;
  }

  const cards = [
    { label: "Users", value: stats.users },
    { label: "Total reports", value: stats.incidents },
    { label: "Reports today", value: stats.reportsToday },
    { label: "Under review", value: stats.underReview },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-stone-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-stone-900">Reports by status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <span
              key={status}
              className="rounded-full bg-orange-50 px-3 py-1 text-sm text-stone-700 ring-1 ring-orange-100"
            >
              {status}: <strong>{count}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-900">
        <strong>Customer launch:</strong> Use <em>Site settings → Publish for customers</em> to show the
        welcome banner and confirm demo/maintenance are off. Wire MSG91 SMS in Vercel when you are ready
        for real OTP codes.
      </div>
    </div>
  );
}
