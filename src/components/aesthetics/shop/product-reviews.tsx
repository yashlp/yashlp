"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";
import { AuthModal } from "@/components/aesthetics/auth/auth-modal";
import { Button } from "@/components/aesthetics/ui/button";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  imageUrl: string | null;
  verifiedPurchase: boolean;
  adminReply: string | null;
  createdAt: string;
  customer: { name: string | null } | null;
};

export function ProductReviews({
  productId,
  rating,
  reviewCount,
}: {
  productId: string;
  rating: number;
  reviewCount: number;
}) {
  const { customer } = useCustomer();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ rating: 5, title: "", body: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    fetch(`/api/commerce/reviews?productId=${encodeURIComponent(productId)}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [productId]);

  async function onImage(file: File | undefined) {
    if (!file) return;
    if (!customer) {
      setAuthOpen(true);
      return;
    }
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/commerce/upload", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setForm((f) => ({ ...f, imageUrl: json.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) {
      setAuthOpen(true);
      return;
    }
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/commerce/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: form.rating,
          title: form.title || undefined,
          body: form.body,
          imageUrl: form.imageUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review");
      setMessage(data.message || "Thank you — pending moderation.");
      setForm({ rating: 5, title: "", body: "", imageUrl: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-20 border-t border-[var(--gallery-border,#ddd7cf)] pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="aes-gallery-eyebrow">Reviews</p>
          <h2 className="aes-gallery-title mt-3 text-2xl sm:text-3xl">Customer feedback</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--gallery-muted,#6f6a63)]">
            <Star className="h-4 w-4 fill-[var(--gallery-luxury,#b58e4a)] text-[var(--gallery-luxury,#b58e4a)]" />
            {rating} average · {reviewCount} reviews
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {loading ? (
            <div className="aes-skeleton h-28 rounded-2xl" />
          ) : reviews.length === 0 ? (
            <p className="text-sm text-[var(--gallery-muted,#6f6a63)]">
              No published reviews yet — be the first after your order arrives.
            </p>
          ) : (
            reviews.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] p-5"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-[var(--gallery-ink,#1e1e1c)]">
                    {"★".repeat(r.rating)}
                    <span className="text-[var(--gallery-muted,#6f6a63)]">{"★".repeat(5 - r.rating)}</span>
                  </span>
                  {r.verifiedPurchase && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--gallery-blue,#2c5aa0)]">
                      Verified purchase
                    </span>
                  )}
                </div>
                {r.title && <p className="mt-2 font-medium">{r.title}</p>}
                {r.body && <p className="mt-2 text-sm leading-relaxed text-[var(--gallery-muted,#6f6a63)]">{r.body}</p>}
                {r.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageUrl} alt="" className="mt-4 max-h-48 rounded-xl object-cover" loading="lazy" />
                )}
                <p className="mt-3 text-xs text-[var(--gallery-muted,#6f6a63)]">
                  {r.customer?.name || "Customer"}
                </p>
                {r.adminReply && (
                  <p className="mt-3 rounded-xl bg-[var(--gallery-bg-secondary,#ece8e1)] p-3 text-sm">
                    Only Aesthetics: {r.adminReply}
                  </p>
                )}
              </article>
            ))
          )}
        </div>

        <div className="rounded-[1.5rem] border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-bg-secondary,#ece8e1)] p-6">
          <h3 className="text-lg font-semibold text-[var(--gallery-ink,#1e1e1c)]">Share your experience</h3>
          <p className="mt-2 text-sm text-[var(--gallery-muted,#6f6a63)]">
            Sign in required. Add a photo and description after you receive the product.
          </p>
          {!customer ? (
            <Button className="mt-6" onClick={() => setAuthOpen(true)}>
              Sign in to review
            </Button>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--gallery-muted,#6f6a63)]">
                Rating
                <select
                  className="aes-input mt-1 w-full"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>
              <input
                className="aes-input w-full"
                placeholder="Title (optional)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className="aes-input min-h-28 w-full"
                placeholder="How does it look and feel at home?"
                required
                minLength={10}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[var(--gallery-muted,#6f6a63)]">
                Photo
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-sm"
                  onChange={(e) => onImage(e.target.files?.[0])}
                />
              </label>
              {form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrl} alt="" className="max-h-32 rounded-lg object-cover" />
              )}
              {uploading && <p className="text-xs text-[var(--gallery-muted,#6f6a63)]">Uploading…</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-[var(--gallery-blue,#2c5aa0)]">{message}</p>}
              <Button type="submit" disabled={submitting || uploading}>
                {submitting ? "Sending…" : "Post feedback"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
