"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeUpReduced } from "@/lib/aesthetics/motion";
import { useAesReducedMotion } from "./use-reduced-motion";
import { cn } from "@/lib/utils";

export type EmptyIllustration = "plant" | "vase" | "notebook" | "lamp" | "object";

type Props = {
  title: string;
  description: string;
  illustration?: EmptyIllustration;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

function MonoIllustration({ kind }: { kind: EmptyIllustration }) {
  const stroke = "currentColor";
  const common = { fill: "none", stroke, strokeWidth: 1.25, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (kind === "plant") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <path d="M32 52V28" {...common} />
        <path d="M32 34c-8-2-14-10-12-18 8 2 14 10 12 18Z" {...common} />
        <path d="M32 38c8-2 14-10 12-18-8 2-14 10-12 18Z" {...common} />
        <ellipse cx="32" cy="54" rx="10" ry="3" {...common} />
      </svg>
    );
  }
  if (kind === "vase") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <path d="M26 18h12l4 8v22a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V26l4-8Z" {...common} />
        <path d="M24 18h16" {...common} />
        <path d="M32 10v8" {...common} />
        <path d="M32 14c4 0 7-3 7-6" {...common} />
      </svg>
    );
  }
  if (kind === "notebook") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <rect x="18" y="12" width="30" height="40" rx="2" {...common} />
        <path d="M26 12v40M32 22h10M32 30h10M32 38h8" {...common} />
      </svg>
    );
  }
  if (kind === "lamp") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <path d="M32 12v10" {...common} />
        <path d="M22 28c0-6 4.5-10 10-10s10 4 10 10H22Z" {...common} />
        <path d="M32 28v16M24 52h16M28 44h8v8" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
      <circle cx="32" cy="34" r="14" {...common} />
      <path d="M32 20v-6M26 22l-3-4M38 22l3-4" {...common} />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  illustration = "object",
  actionHref,
  actionLabel,
  className,
}: Props) {
  const reduced = useAesReducedMotion();

  return (
    <motion.div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={reduced ? fadeUpReduced : fadeUp}
    >
      <div className="mb-6 text-[var(--aes-ink-soft)] opacity-70">
        <MonoIllustration kind={illustration} />
      </div>
      <h2 className="aes-display text-xl text-[var(--aes-ink)] sm:text-2xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--aes-ink-muted)]">{description}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="aes-btn aes-btn-primary mt-8 px-8 py-3">
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}

export const EMPTY_COPY = {
  products: {
    title: "We couldn't find something beautiful yet.",
    description: "Try another collection or discover a different mood.",
    illustration: "vase" as const,
  },
  wishlist: {
    title: "Your future favourites are waiting.",
    description: "Tap the ribbon on any piece to save it here.",
    illustration: "plant" as const,
  },
  search: {
    title: "We couldn't match that style.",
    description: "Try another word — scent, ceramic, journal, or cozy.",
    illustration: "notebook" as const,
  },
  cart: {
    title: "Your bag is waiting to be filled.",
    description: "Browse the shop and add pieces that feel like home.",
    illustration: "lamp" as const,
  },
  collections: {
    title: "We couldn't find something beautiful yet.",
    description: "New rooms are being curated — check back soon, or browse the shop.",
    illustration: "object" as const,
  },
};
