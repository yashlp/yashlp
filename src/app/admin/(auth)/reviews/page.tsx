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
  imageUrl: string | null;
  status: string;
  isFeatured: boolean;
  isPinned: boolean;
  adminReply: string | null;
  product: { name: string };
  customer: { name: string | null; email: string | null } | null;
};

type Analytics = {
  total: number;
  pending: number;
  approved: number;
  featured: number;
  pinned: number;
  withImages: number;
  averageRating: number;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [imageEdits, setImageEdits] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/admin/reviews").then((r) => r.json()).then((d) => setReviews(d.reviews || []));
    fetch("/api/admin/reviews?analytics=true")
      .then((r) => r.json())
      .then((d) => setAnalytics(d.analytics || null));
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: string, data: Record<string, unknown>) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this review permanently? Use for fake or abusive feedback.")) return;
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Reviews</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Approve, feature, pin, attach images, reply — and remove fakes
      </p>

      {analytics && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Total", analytics.total],
            ["Pending", analytics.pending],
            ["Approved", analytics.approved],
            ["Featured", analytics.featured],
            ["Pinned", analytics.pinned],
            ["With images", analytics.withImages],
          ].map(([label, value]) => (
            <Card key={label as string} hover={false}>
              <p className="text-xs text-[var(--aes-dusty)]">{label}</p>
              <p className="text-xl font-semibold">{value}</p>
            </Card>
          ))}
          <Card hover={false} className="sm:col-span-3 lg:col-span-6">
            <p className="text-sm text-[var(--aes-dusty)]">Average rating (approved)</p>
            <p className="text-2xl font-semibold">★ {analytics.averageRating}</p>
          </Card>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {reviews.length === 0 && (
          <Card hover={false}>
            <p className="text-[var(--aes-charcoal-muted)]">No reviews yet</p>
          </Card>
        )}
        {reviews.map((r) => (
          <Card key={r.id} hover={false}>
            <div className="flex justify-between gap-3">
              <p className="font-semibold">
                {r.product.name} · {"★".repeat(r.rating)}
                {r.isPinned && <span className="ml-2 text-xs text-[var(--aes-royal)]">PINNED</span>}
                {r.isFeatured && <span className="ml-2 text-xs text-[var(--aes-royal)]">FEATURED</span>}
              </p>
              <span className="text-xs text-[var(--aes-dusty)]">{r.status}</span>
            </div>
            {r.title && <p className="mt-1 font-medium">{r.title}</p>}
            {r.body && <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">{r.body}</p>}
            {r.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.imageUrl} alt="" className="mt-3 max-h-40 rounded-lg object-cover" />
            )}
            <p className="mt-1 text-xs text-[var(--aes-dusty)]">
              {r.customer?.name || r.customer?.email || "Guest"}
            </p>
            {r.adminReply && (
              <p className="mt-2 rounded-lg bg-[var(--aes-ivory)] p-3 text-sm">Reply: {r.adminReply}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {r.status === "PENDING" && (
                <>
                  <Button size="sm" onClick={() => update(r.id, { status: "APPROVED" })}>
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => update(r.id, { status: "HIDDEN" })}>
                    Hide
                  </Button>
                </>
              )}
              {r.status === "APPROVED" && (
                <Button size="sm" variant="secondary" onClick={() => update(r.id, { status: "HIDDEN" })}>
                  Hide
                </Button>
              )}
              {r.status === "HIDDEN" && (
                <Button size="sm" onClick={() => update(r.id, { status: "APPROVED" })}>
                  Re-approve
                </Button>
              )}
              <Button size="sm" variant="secondary" onClick={() => update(r.id, { isFeatured: !r.isFeatured })}>
                {r.isFeatured ? "Unfeature" : "Feature"}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => update(r.id, { isPinned: !r.isPinned })}>
                {r.isPinned ? "Unpin" : "Pin"}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => remove(r.id)}>
                Remove (fake)
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Input
                placeholder="Add / replace image URL"
                value={imageEdits[r.id] ?? r.imageUrl ?? ""}
                onChange={(e) => setImageEdits({ ...imageEdits, [r.id]: e.target.value })}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => update(r.id, { imageUrl: imageEdits[r.id] || r.imageUrl })}
              >
                Save image
              </Button>
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Reply to customer"
                value={replies[r.id] || ""}
                onChange={(e) => setReplies({ ...replies, [r.id]: e.target.value })}
              />
              <Button
                size="sm"
                onClick={() => update(r.id, { adminReply: replies[r.id], status: "APPROVED" })}
              >
                Send reply
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
