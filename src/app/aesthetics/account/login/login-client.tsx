"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";

type Mode = "email" | "phone";

export default function AccountLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/aesthetics/account";
  const { refresh } = useCustomer();
  const [mode, setMode] = useState<Mode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string>();
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

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send code");
      setOtpSent(true);
      if (data.devCode) setDevCode(data.devCode);
      if (data.hint) setDevCode((prev) => prev || "123456");
      if (data.demo && !data.devCode) setDevCode("123456");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      await afterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
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

        <div className="aes-panel mt-8 flex p-1">
          <button
            type="button"
            onClick={() => { setMode("email"); setError(""); }}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider ${mode === "email" ? "bg-[var(--aes-ink)] text-white" : "text-[var(--aes-ink-muted)]"}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => { setMode("phone"); setError(""); }}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider ${mode === "phone" ? "bg-[var(--aes-ink)] text-white" : "text-[var(--aes-ink-muted)]"}`}
          >
            Phone
          </button>
        </div>

        {mode === "email" ? (
          <form onSubmit={loginEmail} className="aes-panel mt-6 space-y-4 p-6">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        ) : !otpSent ? (
          <form onSubmit={sendOtp} className="aes-panel mt-6 space-y-4 p-6">
            <Input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send verification code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="aes-panel mt-6 space-y-4 p-6">
            <Input placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
            {devCode && <p className="text-xs text-[var(--aes-ink-soft)]">Dev code: {devCode}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Verify & sign in"}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[var(--aes-ink-muted)]">
          <Link href="/aesthetics/shop" className="text-[var(--aes-pink)] hover:underline">
            Continue as guest
          </Link>
        </p>
      </main>
    </ConsumerPage>
  );
}
