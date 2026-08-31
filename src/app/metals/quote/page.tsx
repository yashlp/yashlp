import { Suspense } from "react";
import { QuoteForm } from "@/components/metals/quote-form";

export const metadata = {
  title: "Instant quote — cut to size",
  description: "Grade, shape, dimensions, quantity. Instant weight and indicative landed rate from Vadodara stock.",
};

export default function QuotePage() {
  return (
    <div className="jk-wrap py-14">
      <p className="jk-kicker">Instant Quote</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Steel specs</h1>
      <p className="mt-4 max-w-2xl text-neutral-400">
        Tell us grade, shape, and millimetres. We check the warehouse, weigh the blank, and price it.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-neutral-500">Loading quote sheet…</p>}>
          <QuoteForm />
        </Suspense>
      </div>
    </div>
  );
}
