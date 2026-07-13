"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConsumerNav } from "@/components/aesthetics/layout/consumer-nav";
import { ConsumerFooter } from "@/components/aesthetics/layout/consumer-footer";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";

type Mode = "email" | "phone";

export default function AccountLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/aesthetics/account");
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
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send code");
      setOtpSent(true);
      if (data.devCode) setDevCode(data.devCode);
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
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      router.push("/aesthetics/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ConsumerNav />
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="aes-section-title text-center text-[var(--aes-ink)]">Sign in</h1>
        <p className="mt-3 text-center text-sm text-[var(--aes-ink-muted)]">
          Use your email and password, or sign in with your phone number.
        </p>

        <div className="mt-8 flex rounded-full bg-white p-1 shadow-sm">
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
          <form onSubmit={loginEmail} className="mt-6 space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        ) : !otpSent ? (
          <form onSubmit={sendOtp} className="mt-6 space-y-4">
            <Input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send verification code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="mt-6 space-y-4">
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
      <ConsumerFooter />
    </>
  );
}
