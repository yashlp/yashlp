"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";

export default function PlatformAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="aesthetics-root flex min-h-dvh items-center justify-center bg-[var(--aes-ivory)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="aes-display text-lg font-semibold tracking-wide">
            <span className="text-[var(--aes-charcoal-muted)]">only </span>
            <span className="text-[var(--aes-royal)]">A E S T H E T I C S</span>
          </p>
          <p className="aes-mono mt-2 text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">
            D2C Admin Portal
          </p>
          <p className="mt-3 text-xs text-[var(--aes-charcoal-muted)]">
            Inventory · Orders · Purchases · Analytics
          </p>
          <p className="mt-2 text-[10px] text-[var(--aes-dusty)]">
            This is Only Aesthetic store admin — not CivicLens. CivicLens admin:{" "}
            <a href="/civic-admin/login" className="underline">
              /civic-admin/login
            </a>
          </p>
        </div>

        <form onSubmit={handleLogin} className="aes-card space-y-4 p-8">
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
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
