"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type StorefrontReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  customerName: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
};

type Props = {
  reviews: StorefrontReview[];
};

function ReviewCard({ review }: { review: StorefrontReview }) {
  return (
    <blockquote className="flex w-[min(300px,82vw)] shrink-0 gap-3 rounded-2xl aes-panel p-4 sm:w-[320px] sm:p-5">
      <Link
        href={`/aesthetics/product/${review.productSlug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--aes-bg-muted,#f3eee8)]"
      >
        {review.productImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.productImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[10px] text-[var(--aes-ink-soft)]">
            OA
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < review.rating
                  ? "fill-[var(--aes-yellow-deep,#b58e4a)] text-[var(--aes-yellow-deep,#b58e4a)]"
                  : "text-[var(--aes-border)]"
              )}
            />
          ))}
        </div>
        {review.title ? (
          <p className="mt-2 truncate text-sm font-bold text-[var(--aes-ink)]">{review.title}</p>
        ) : null}
        {review.body ? (
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-[var(--aes-ink-muted)]">
            &ldquo;{review.body}&rdquo;
          </p>
        ) : null}
        <footer className="mt-3 text-[11px] text-[var(--aes-ink-soft)]">
          <span className="font-semibold text-[var(--aes-ink)]">{review.customerName}</span>
          {" · "}
          <Link href={`/aesthetics/product/${review.productSlug}`} className="hover:text-[var(--aes-pink)]">
            {review.productName}
          </Link>
        </footer>
      </div>
    </blockquote>
  );
}

/** Auto-scrolling marquee: cards move left → right. Hidden when there are no real reviews. */
export function TestimonialsSection({ reviews }: Props) {
  if (!reviews.length) return null;

  const loop = [...reviews, ...reviews];

  return (
    <section className="aes-bg-testimonial overflow-hidden px-4 py-16 sm:px-6 sm:py-20" aria-label="Customer reviews">
      <div className="mx-auto max-w-7xl">
        <h2 className="aes-section-title text-center text-[var(--aes-ink)]">Customer reviews</h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-[var(--aes-ink-muted)]">
          Real feedback from people who bought these pieces.
        </p>

        <div className="relative mt-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--aes-bg-testimonial,#f6f1ec)] to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--aes-bg-testimonial,#f6f1ec)] to-transparent sm:w-16" />
          <div className="oa-reviews-marquee flex w-max gap-4 hover:[animation-play-state:paused]">
            {loop.map((review, i) => (
              <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
