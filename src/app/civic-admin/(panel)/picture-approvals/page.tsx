"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ImageIcon, X } from "lucide-react";

type ApprovalItem = {
  id: string;
  type: "incident_photo" | "comment_photo";
  url: string;
  approvalStatus: string;
  createdAt: string;
  commentBody: string | null;
  user: { id: string; name: string; phone: string } | null;
  incident: {
    id: string;
    title: string;
    category: { emoji: string; name: string };
  };
};

export default function PictureApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/civic-admin/photo-approvals?status=pending")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        setPendingCount(d.pendingCount ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (item: ApprovalItem, action: "approve" | "reject") => {
    const label = action === "approve" ? "approve" : "reject";
    if (!confirm(`${action === "approve" ? "Approve" : "Reject"} this photo?`)) return;

    setActing(item.id);
    const res = await fetch("/api/civic-admin/photo-approvals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, type: item.type, action }),
    });
    setActing(null);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? `Failed to ${label} photo`);
      return;
    }
    load();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-orange-600" />
          <div>
            <h2 className="font-semibold text-stone-900">Picture Approval</h2>
            <p className="text-sm text-stone-500">
              User-uploaded photos on reports and comments are hidden until you approve them.
              Text-only comments are published immediately.
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-stone-600">
          Pending review: <strong>{pendingCount}</strong>
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-stone-400">Loading pending photos…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-orange-100 bg-white py-12 text-center text-sm text-stone-400">
          No photos waiting for approval.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt="Pending user upload"
                className="aspect-[4/3] w-full object-cover bg-stone-100"
              />
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                  {item.type === "incident_photo" ? "Report photo" : "Comment photo"}
                </p>
                <p className="text-sm text-stone-700">
                  {item.incident.category.emoji} {item.incident.title}
                </p>
                {item.commentBody && (
                  <p className="rounded-lg bg-stone-50 px-2 py-1.5 text-sm text-stone-600">
                    &ldquo;{item.commentBody}&rdquo;
                  </p>
                )}
                {item.user && (
                  <p className="text-xs text-stone-500">
                    {item.user.name} · {item.user.phone}
                  </p>
                )}
                <p className="text-xs text-stone-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    disabled={acting === item.id}
                    onClick={() => review(item, "approve")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    disabled={acting === item.id}
                    onClick={() => review(item, "reject")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
