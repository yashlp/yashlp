"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { useNoticeOptional } from "@/components/aesthetics/motion";

function SuccessContent() {
  const params = useSearchParams();
  const notice = useNoticeOptional();
  const orderNumber = params.get("orderNumber");

  useEffect(() => {
    notice?.pushNotice("Order Confirmed", "order");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on enter
  }, []);

  return (
    <ConsumerPage tint="lavender">
      <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="aes-label">Order confirmed</p>
        <h1 className="aes-section-title mt-3 text-[var(--aes-ink)]">Thank you!</h1>
        <p className="mt-4 text-[var(--aes-ink-muted)]">
          Your order <strong>{orderNumber}</strong> has been placed. A confirmation email is on its way.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/aesthetics/account">
            <Button variant="secondary">View my account</Button>
          </Link>
          <Link href="/aesthetics/shop">
            <Button>Continue shopping</Button>
          </Link>
        </div>
      </main>
    </ConsumerPage>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh aes-site-bg" />}>
      <SuccessContent />
    </Suspense>
  );
}
