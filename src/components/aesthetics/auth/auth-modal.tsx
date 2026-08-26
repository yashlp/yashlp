"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { useCustomer } from "@/components/aesthetics/providers/customer-provider";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  redirectTo?: string;
};

export function AuthModal({
  open,
  onClose,
  title = "Sign in to continue",
  subtitle = "Save favourites, track orders, and request refunds.",
  redirectTo = "/aesthetics/account",
}: Props) {
  const router = useRouter();
  const { refresh } = useCustomer();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function resetRegisterExtras() {
    setOtp("");
    setOtpSent(false);
    setEmailVerified(false);
  }

  async function handleLogin(e: React.FormEvent) {
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
      await refresh();
      onClose();
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send code");
      setOtpSent(true);
      setEmailVerified(false);
      if (data.devCode) setOtp(data.devCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setEmailVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!emailVerified) {
      setError("Verify your email with the OTP first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
          address: {
            line1,
            city,
            postalCode,
            country: "IN",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      await refresh();
      onClose();
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} aria-label="Close" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} className="aes-touch absolute right-3 top-3 grid place-items-center text-[var(--aes-ink-soft)] hover:text-[var(--aes-ink)]" aria-label="Close dialog">
          <X className="h-5 w-5" />
        </button>
        <h2 className="aes-joy-title-lower text-xl text-[var(--aes-ink)]">{title}</h2>
        <p className="mt-2 text-sm text-[var(--aes-ink-muted)]">{subtitle}</p>

        <div className="mt-6 flex rounded-full bg-[var(--aes-bg-sand)] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider ${mode === "login" ? "bg-[var(--aes-ink)] text-white" : "text-[var(--aes-ink-muted)]"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
              resetRegisterExtras();
            }}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider ${mode === "register" ? "bg-[var(--aes-ink)] text-white" : "text-[var(--aes-ink-muted)]"}`}
          >
            Sign up
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={sendOtp} disabled={loading || !email}>
                {otpSent ? "Resend code" : "Send email code"}
              </Button>
              <Input
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="max-w-[10rem]"
                inputMode="numeric"
              />
              <Button type="button" onClick={verifyOtp} disabled={loading || otp.length !== 6}>
                Verify
              </Button>
            </div>
            {emailVerified && <p className="text-sm text-emerald-700">Email verified</p>}
            <Input type="tel" placeholder="Phone (+91) (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <Input placeholder="Address line 1" value={line1} onChange={(e) => setLine1(e.target.value)} required />
            <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <Input placeholder="PIN code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !emailVerified}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/aesthetics/account/login" className="text-[var(--aes-pink)] hover:underline" onClick={onClose}>
            Open full sign-in page
          </Link>
        </p>
      </div>
    </div>
  );
}
