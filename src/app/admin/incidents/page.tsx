"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Incident = {
  id: string;
  title: string;
  status: string;
  visibilityStage: string;
  underLegalReview: boolean;
  confirmationCount: number;
  createdAt: string;
  category: { emoji: string; name: string };
  reporter: { name: string; phone: string };
};

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/incidents?limit=50")
      .then((r) => r.json())
      .then((d) => setIncidents(d.incidents ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const patch = async (id: string, body: Record<string, unknown>) => {
    await fetch(`/api/admin/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this report permanently?")) return;
    await fetch(`/api/admin/incidents/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="text-sm text-stone-400">Loading incidents…</p>;

  return (
    <div className="space-y-3">
      {incidents.map((inc) => (
        <div
          key={inc.id}
          className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-stone-900">
                {inc.category.emoji} {inc.title}
              </p>
              <p className="text-xs text-stone-500">
                {inc.reporter.name} · {inc.confirmationCount} confirms ·{" "}
                {new Date(inc.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-stone-400">
                {inc.status} · {inc.visibilityStage}
                {inc.underLegalReview ? " · under review" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => patch(inc.id, { underLegalReview: !inc.underLegalReview })}
                className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200"
              >
                {inc.underLegalReview ? "Clear review" : "Hold review"}
              </button>
              <button
                onClick={() => patch(inc.id, { status: "resolved" })}
                className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200"
              >
                Mark resolved
              </button>
              <button
                onClick={() => remove(inc.id)}
                className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {incidents.length === 0 && (
        <p className="py-8 text-center text-sm text-stone-400">No incidents yet.</p>
      )}
    </div>
  );
}
