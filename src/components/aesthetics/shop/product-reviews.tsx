"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";
import { cn } from "@/lib/utils";

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  customerName: string;
  createdAt: string;
};

type Props = {
  productId: string;
  productSlug: string;
  initialReviews: ReviewRow[];
  rating: number;
  reviewCount: number;
};

export function ProductReviews({
  productId,
  productSlug,
  initialReviews,
  rating,
  reviewCount,
}: Props) {
  const { customer } = useCustomer();
  const [reviews] = useState(initialReviews);
  const [stars, setStars] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const res = await fetch("/api/commerce/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, rating: stars, title: title || undefined, body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(data.error || "Could not submit review");
      return;
    }
    setStatus("sent");
    setTitle("");
    setBody("");
  }

  return (
    <section className="mt-14 border-t border-[var(--gallery-border,#ddd7cf)] pt-10">
      <h2 className="text-lg font-bold text-[var(--gallery-ink,#1e1e1c)]">Reviews</h2>
      {reviewCount > 0 ? (
        <p className="mt-1 flex items-center gap-2 text-sm text-[var(--gallery-muted,#6f6a63)]">
          <Star className="h-4 w-4 fill-[var(--gallery-luxury,#b58e4a)] text-[var(--gallery-luxury,#b58e4a)]" />
          {rating.toFixed(1)} · {reviewCount} review{reviewCount === 1 ? "" : "s"}
        </p>
      ) : (
        <p className="mt-1 text-sm text-[var(--gallery-muted,#6f6a63)]">No reviews yet — be the first.</p>
      )}

      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-2xl border border-[var(--gallery-border,#ddd7cf)] bg-white/60 p-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < r.rating
                      ? "fill-[var(--gallery-luxury,#b58e4a)] text-[var(--gallery-luxury,#b58e4a)]"
                      : "text-[var(--gallery-border,#ddd7cf)]"
                  )}
                />
              ))}
            </div>
            {r.title ? <p className="mt-2 text-sm font-semibold text-[var(--gallery-ink,#1e1e1c)]">{r.title}</p> : null}
            {r.body ? <p className="mt-1 text-sm leading-relaxed text-[var(--gallery-muted,#6f6a63)]">{r.body}</p> : null}
            <p className="mt-2 text-xs text-[var(--gallery-muted,#6f6a63)]">{r.customerName}</p>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--gallery-muted,#6f6a63)]">
          Write a review
        </h3>
        {!customer ? (
          <p className="mt-3 text-sm text-[var(--gallery-muted,#6f6a63)]">
            <Link
              href={`/aesthetics/account/login?redirect=/aesthetics/product/${productSlug}`}
              className="text-[var(--aes-pink)] hover:underline"
            >
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        ) : status === "sent" ? (
          <p className="mt-3 text-sm text-green-700">Thanks — your review will show after approval.</p>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStars(i + 1)}
                  className="p-1"
                  aria-label={`${i + 1} stars`}
                >
                  <Star
                    className={cn(
                      "h-5 w-5",
                      i < stars
                        ? "fill-[var(--gallery-luxury,#b58e4a)] text-[var(--gallery-luxury,#b58e4a)]"
                        : "text-[var(--gallery-border,#ddd7cf)]"
                    )}
                  />
                </button>
              ))}
            </div>
            <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            <textarea
              className="aes-input min-h-[100px] w-full"
              placeholder="How was the piece?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={10}
              maxLength={2000}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Submit review"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
