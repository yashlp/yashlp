"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";

export default function PlatformAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/platform-admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.requiresOtp) {
        setAdminId(data.adminId);
      } else {
        router.push("/platform-admin");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/platform-admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP failed");
      router.push("/platform-admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="aesthetics-root flex min-h-dvh items-center justify-center bg-[var(--aes-ivory)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="aes-display text-3xl font-semibold italic text-[var(--aes-charcoal)]">Aesthetics</p>
          <p className="aes-mono mt-2 text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">
            Platform Admin
          </p>
        </div>

        <form
          onSubmit={adminId ? handleOtp : handleLogin}
          className="aes-card space-y-4 p-8"
        >
          {!adminId ? (
            <>
              <div>
                <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
                  Email
                </label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
                  Password
                </label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </>
          ) : (
            <div>
              <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
                Verification code
              </label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} required />
              <p className="mt-2 text-xs text-[var(--aes-charcoal-muted)]">Check server logs in dev if using demo OTP.</p>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : adminId ? "Verify" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
