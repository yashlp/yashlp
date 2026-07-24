import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";

export default function IndiaOnlyPage() {
  return (
    <ConsumerPage room="calm">
      <main className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="aes-gallery-eyebrow">India only</p>
        <h1 className="aes-gallery-title mt-3 text-balance">Only Aesthetic is available in India</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--aes-ink-muted)]">
          We currently serve customers across India only. If you are browsing from outside India, check back when we
          expand.
        </p>
        <p className="mt-8 text-xs text-[var(--aes-ink-soft)]">
          Visiting from India?{" "}
          <Link href="/aesthetics" className="underline">
            Continue to the store
          </Link>
        </p>
      </main>
    </ConsumerPage>
  );
}
