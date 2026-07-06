"use client";

import { useEffect } from "react";

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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#fffaf7] px-4 text-center">
      <p className="text-4xl">⚠️</p>
      <h1 className="mt-4 text-xl font-bold text-stone-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-stone-500">
        The dev server cache may be corrupted. Stop the server, run{" "}
        <code className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-800">npm run dev:clean</code>
        , then refresh.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
      >
        Try again
      </button>
    </div>
  );
}
