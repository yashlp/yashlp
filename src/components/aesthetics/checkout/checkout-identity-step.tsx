"use client";

import { useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";

export type CheckoutFormState = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Props = {
  form: CheckoutFormState;
  onFormChange: (next: CheckoutFormState) => void;
  onContinue: (mode: "guest" | "signed-in") => void;
};

type AuthMode = "choose" | "signin" | "signup";

export function CheckoutIdentityStep({ form, onFormChange, onContinue }: Props) {
  const [mode, setMode] = useState<AuthMode>("choose");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/commerce/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");

      const meRes = await fetch("/api/commerce/auth/me");
      const me = await meRes.json();
      if (me.customer?.address) {
        const a = me.customer.address;
        onFormChange({
          ...form,
          name: me.customer.name || form.name,
          email: me.customer.email || form.email,
          phone: me.customer.phone || form.phone,
          line1: a.line1,
          line2: a.line2 || "",
          city: a.city,
          state: a.state || "",
          postalCode: a.postalCode,
          country: a.country || "IN",
        });
      } else if (me.customer) {
        onFormChange({
          ...form,
          name: me.customer.name || form.name,
          email: me.customer.email || form.email,
          phone: me.customer.phone || form.phone,
        });
      }
      onContinue("signed-in");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
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
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send code");
      setOtpSent(true);
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
        body: JSON.stringify({ email: form.email, code: otp }),
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

  async function handleSignUp(e: React.FormEvent) {
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
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password,
          address: {
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            state: form.state || undefined,
            postalCode: form.postalCode,
            country: form.country || "IN",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create account");
      onContinue("signed-in");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "choose") {
    return (
      <div className="aes-panel space-y-6 p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-semibold text-[var(--aes-ink)]">Before you checkout</h2>
          <p className="mt-2 text-sm text-[var(--aes-ink-muted)]">
            Do you already have an Only Aesthetic account?
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Button type="button" variant="secondary" className="w-full" onClick={() => setMode("signin")}>
            Sign in
          </Button>
          <Button type="button" className="w-full" onClick={() => setMode("signup")}>
            Sign up
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => onContinue("guest")}>
            Continue as guest
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "signin") {
    return (
      <form onSubmit={handleSignIn} className="aes-panel space-y-4 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[var(--aes-ink)]">Sign in</h2>
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => onFormChange({ ...form, email: e.target.value })}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in & continue"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setMode("choose")}>
            Back
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="aes-panel space-y-4 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-[var(--aes-ink)]">Create your account</h2>
      <p className="text-sm text-[var(--aes-ink-muted)]">
        We&apos;ll save your details for faster checkout next time. Verify your email to continue.
      </p>
      <Input
        placeholder="Full name"
        value={form.name}
        onChange={(e) => onFormChange({ ...form, name: e.target.value })}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => onFormChange({ ...form, email: e.target.value })}
        required
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={sendOtp} disabled={loading || !form.email}>
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
      <Input
        type="tel"
        placeholder="Mobile number"
        value={form.phone}
        onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="Password (min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <Input
        placeholder="Address line 1"
        value={form.line1}
        onChange={(e) => onFormChange({ ...form, line1: e.target.value })}
        required
      />
      <Input
        placeholder="Address line 2 (optional)"
        value={form.line2}
        onChange={(e) => onFormChange({ ...form, line2: e.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder="City" value={form.city} onChange={(e) => onFormChange({ ...form, city: e.target.value })} required />
        <Input placeholder="State" value={form.state} onChange={(e) => onFormChange({ ...form, state: e.target.value })} />
      </div>
      <Input
        placeholder="PIN code"
        value={form.postalCode}
        onChange={(e) => onFormChange({ ...form, postalCode: e.target.value })}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading || !emailVerified}>
          {loading ? "Creating account…" : "Create account & continue"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setMode("choose")}>
          Back
        </Button>
      </div>
    </form>
  );
}
