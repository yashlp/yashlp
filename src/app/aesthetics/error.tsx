"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AestheticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="aesthetics-root flex min-h-dvh flex-col items-center justify-center bg-[var(--aes-bg-base,#fff5e1)] px-4 text-center">
      <h1 className="text-xl font-bold text-[var(--aes-ink,#121212)]">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-[var(--aes-ink-muted,#4a4a4a)]">
        The store hit a temporary error. Try again, or go back to the homepage.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[var(--aes-royal,#1e3a5f)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/aesthetics"
          className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold"
        >
          Only Aesthetic home
        </Link>
      </div>
    </div>
  );
}
