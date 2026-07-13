"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: string;
  isFeatured: boolean;
  adminReply: string | null;
  product: { name: string };
  customer: { name: string | null; email: string | null } | null;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/admin/reviews").then((r) => r.json()).then((d) => setReviews(d.reviews || []));
  }

  useEffect(() => { load(); }, []);

  async function update(id: string, data: Record<string, unknown>) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    load();
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Reviews</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Approve, hide, reply, and feature reviews</p>

      <div className="mt-8 space-y-4">
        {reviews.length === 0 && <Card hover={false}><p className="text-[var(--aes-charcoal-muted)]">No reviews yet</p></Card>}
        {reviews.map((r) => (
          <Card key={r.id} hover={false}>
            <div className="flex justify-between">
              <p className="font-semibold">{r.product.name} · {"★".repeat(r.rating)}</p>
              <span className="text-xs text-[var(--aes-dusty)]">{r.status}</span>
            </div>
            {r.title && <p className="mt-1 font-medium">{r.title}</p>}
            {r.body && <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">{r.body}</p>}
            <p className="mt-1 text-xs text-[var(--aes-dusty)]">{r.customer?.name || r.customer?.email || "Guest"}</p>
            {r.adminReply && <p className="mt-2 rounded-lg bg-[var(--aes-ivory)] p-3 text-sm">Reply: {r.adminReply}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {r.status === "PENDING" && (
                <>
                  <Button size="sm" onClick={() => update(r.id, { status: "APPROVED" })}>Approve</Button>
                  <Button size="sm" variant="secondary" onClick={() => update(r.id, { status: "HIDDEN" })}>Hide</Button>
                </>
              )}
              <Button size="sm" variant="secondary" onClick={() => update(r.id, { isFeatured: !r.isFeatured })}>
                {r.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </div>
            <div className="mt-3 flex gap-2">
              <Input placeholder="Reply to customer" value={replies[r.id] || ""} onChange={(e) => setReplies({ ...replies, [r.id]: e.target.value })} />
              <Button size="sm" onClick={() => update(r.id, { adminReply: replies[r.id], status: "APPROVED" })}>Send reply</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
