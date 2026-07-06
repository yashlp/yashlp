"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, MessageSquare, X, XCircle } from "lucide-react";
import Link from "next/link";
import { confidenceLabel, statusLabel } from "@/lib/utils";
import { CONFIRMATION_THRESHOLD } from "@/lib/constants";

type IncidentDetail = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  confidenceScore: number;
  confirmationCount: number;
  isPositive: boolean;
  createdAt: string;
  category: { emoji: string; name: string; slug: string };
  reporter: { name: string; reputation: number };
  confirmations: { id: string; comment: string | null; user: { name: string }; createdAt: string }[];
  comments: { id: string; body: string; user: { name: string }; createdAt: string }[];
  timelineEvents: { id: string; action: string; createdAt: string }[];
  resolutionUpdates: {
    id: string;
    description: string | null;
    status: string;
    confirmationCount: number;
    user: { name: string };
  }[];
};

export function IncidentPanel({
  incidentId,
  onClose,
  onUpdate,
}: {
  incidentId: string;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch(`/api/incidents/${incidentId}`)
      .then((r) => r.json())
      .then((d) => setIncident(d.incident));
  };

  useEffect(() => {
    load();
  }, [incidentId]);

  const action = async (path: string, body?: object) => {
    setLoading(true);
    setError("");
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Action failed");
      return;
    }
    load();
    onUpdate();
  };

  if (!incident) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-[1001] p-4 md:left-auto md:right-4 md:bottom-4 md:w-96">
        <div className="glass-card rounded-2xl p-6 shadow-xl">Loading...</div>
      </div>
    );
  }

  const needsMore = incident.confirmationCount < CONFIRMATION_THRESHOLD;

  return (
    <div className="absolute bottom-14 left-0 right-0 z-[1001] max-h-[70vh] overflow-y-auto p-4 md:bottom-4 md:left-auto md:right-4 md:w-[420px] md:max-h-[calc(100vh-6rem)]">
      <div className="glass-card rounded-2xl shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{incident.category.emoji}</span>
              <div>
                <h2 className="font-semibold">{incident.category.name}</h2>
                <p className="text-xs capitalize text-muted">
                  {statusLabel(incident.status, incident.isPositive)} · {confidenceLabel(incident.confidenceScore)}
                </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          {incident.description && (
            <p className="text-sm text-slate-700">{incident.description}</p>
          )}

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              {incident.confirmationCount} confirmations
              {needsMore && ` (${CONFIRMATION_THRESHOLD} needed)`}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              by {incident.reporter.name}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
            </span>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {incident.status !== "resolved" && (
              <button
                disabled={loading}
                onClick={() => action(`/api/incidents/${incidentId}/confirm`)}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm
              </button>
            )}
            {incident.status === "active" && !incident.isPositive && (
              <button
                disabled={loading}
                onClick={() =>
                  action(`/api/incidents/${incidentId}/resolve`, {
                    description: "Issue appears resolved.",
                  })
                }
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Resolved
              </button>
            )}
            {incident.resolutionUpdates[0]?.status === "pending" && (
              <>
                <button
                  disabled={loading}
                  onClick={() =>
                    action(`/api/incidents/${incidentId}/resolve-confirm`, { confirm: true })
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white"
                >
                  Verify Fix
                </button>
                <button
                  disabled={loading}
                  onClick={() =>
                    action(`/api/incidents/${incidentId}/resolve-confirm`, { confirm: false })
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700"
                >
                  <XCircle className="h-4 w-4" />
                  Dispute
                </button>
              </>
            )}
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-muted">
              <MessageSquare className="h-3.5 w-3.5" /> Add comment
            </label>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share what you observed..."
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
              <button
                disabled={!comment.trim() || loading}
                onClick={() => {
                  action(`/api/incidents/${incidentId}/comment`, { body: comment });
                  setComment("");
                }}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>

          {incident.confirmations.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-muted">Confirmations</h3>
              <div className="space-y-2">
                {incident.confirmations.map((c) => (
                  <div key={c.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium">{c.user.name}</span>
                    {c.comment && <p className="text-slate-600">{c.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {incident.timelineEvents.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-muted">Timeline</h3>
              <div className="space-y-1 border-l-2 border-orange-200 pl-3">
                {incident.timelineEvents.map((e) => (
                  <p key={e.id} className="text-xs text-slate-600">
                    <span className="font-medium capitalize">{e.action.replace(/_/g, " ")}</span>
                    {" · "}
                    {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
                  </p>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted">
            <Link href="/login" className="text-orange-600 hover:underline">
              Sign in
            </Link>{" "}
            to contribute and build reputation
          </p>
        </div>
      </div>
    </div>
  );
}
