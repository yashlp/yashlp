"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";

export default function AccountLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/aesthetics/account";
  const { refresh } = useCustomer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function afterAuth() {
    await refresh();
    router.push(redirect);
    router.refresh();
  }

  async function loginEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      await afterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConsumerPage room="ivory">
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <p className="aes-gallery-eyebrow text-center">Welcome back</p>
        <h1 className="aes-gallery-title mt-3 text-center">Sign in</h1>
        <p className="mt-3 text-center text-sm text-[var(--gallery-muted,#6f6a63)]">
          Sign in to save favourites, view orders, and request refunds.
        </p>

        <form onSubmit={loginEmail} className="aes-panel mt-8 space-y-4 p-6">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--aes-ink-muted)]">
          <Link href="/aesthetics/shop" className="text-[var(--aes-pink)] hover:underline">
            Continue as guest
          </Link>
        </p>
      </main>
    </ConsumerPage>
  );
}
