"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";

type CommentRow = {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string; phone: string };
  incident: {
    id: string;
    title: string;
    category: { emoji: string; name: string };
  };
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback((search = query) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    fetch(`/api/civic-admin/comments?${params}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    load("");
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this comment permanently?")) return;
    await fetch(`/api/civic-admin/comments/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(query);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search comments, users, or pin titles…"
            className="input-field w-full pl-9"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-stone-400">Loading comments…</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-stone-800">{c.body}</p>
                  <p className="mt-2 text-xs text-stone-500">
                    {c.user.name} · {c.user.phone} · {new Date(c.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    On pin: {c.incident.category.emoji} {c.incident.title}
                  </p>
                </div>
                <button
                  onClick={() => remove(c.id)}
                  className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="py-8 text-center text-sm text-stone-400">No comments found.</p>
          )}
        </div>
      )}
    </div>
  );
}
