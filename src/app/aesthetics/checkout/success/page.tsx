"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useNoticeOptional } from "@/components/aesthetics/motion";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const notice = useNoticeOptional();
  const [showAccount, setShowAccount] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const orderNumber = params.get("orderNumber");
  const orderId = params.get("orderId");

  useEffect(() => {
    notice?.pushNotice("Order Confirmed", "order");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on enter
  }, []);

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: params.get("name"),
          email: params.get("email"),
          phone: params.get("phone"),
          password,
          orderId,
          address: {
            line1: params.get("line1"),
            line2: params.get("line2") || undefined,
            city: params.get("city"),
            state: params.get("state") || undefined,
            postalCode: params.get("postalCode"),
            country: params.get("country") || "US",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create account");
      router.push("/aesthetics/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConsumerPage tint="lavender">
      <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="aes-label">Order confirmed</p>
        <h1 className="aes-section-title mt-3 text-[var(--aes-ink)]">Thank you!</h1>
        <p className="mt-4 text-[var(--aes-ink-muted)]">
          Your order <strong>{orderNumber}</strong> has been placed. We&apos;ll be in touch shortly.
        </p>

        {showAccount && (
          <div className="aes-panel-lavender mt-12 p-8 text-left">
            <h2 className="text-lg font-bold text-[var(--aes-ink)]">Save your details for next time</h2>
            <p className="mt-2 text-sm text-[var(--aes-ink-muted)]">
              Create a permanent account with your delivery details. Next time, sign in with your email
              and password, or your phone number.
            </p>
            <form onSubmit={createAccount} className="mt-6 space-y-4">
              <Input value={params.get("name") || ""} disabled placeholder="Name" />
              <Input value={params.get("email") || ""} disabled placeholder="Email" />
              <Input value={params.get("phone") || ""} disabled placeholder="Phone" />
              <Input
                type="password"
                placeholder="Choose a password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create my account"}
              </Button>
            </form>
            <button
              type="button"
              onClick={() => setShowAccount(false)}
              className="mt-4 w-full text-center text-xs text-[var(--aes-ink-soft)] underline"
            >
              Skip for now
            </button>
          </div>
        )}

        <div className="mt-10">
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
