"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#fff5e1] px-4 text-center">
      <h1 className="mt-2 text-xl font-bold text-stone-900">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-stone-600">
        Please try again. If this keeps happening, open the store homepage or refresh the page.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152a45]"
        >
          Try again
        </button>
        <Link
          href="/aesthetics"
          className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
        >
          Go to Only Aesthetic
        </Link>
      </div>
    </div>
  );
}
