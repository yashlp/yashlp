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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
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
          phone,
          password,
          address: {
            line1: "To be updated",
            city: "Mumbai",
            postalCode: "400001",
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
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-[var(--aes-ink-soft)] hover:text-[var(--aes-ink)]" aria-label="Close dialog">
          <X className="h-5 w-5" />
        </button>
        <h2 className="aes-joy-title-lower text-xl text-[var(--aes-ink)]">{title}</h2>
        <p className="mt-2 text-sm text-[var(--aes-ink-muted)]">{subtitle}</p>

        <div className="mt-6 flex rounded-full bg-[var(--aes-bg-sand)] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider ${mode === "login" ? "bg-[var(--aes-ink)] text-white" : "text-[var(--aes-ink-muted)]"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
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
            <Input type="tel" placeholder="Phone (+91)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-[var(--aes-ink-muted)]">
          Demo account: <span className="font-medium">demo@customer.com</span> / Chester@2604
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/aesthetics/account/login" className="text-[var(--aes-pink)] hover:underline" onClick={onClose}>
            Open full sign-in page
          </Link>
        </p>
      </div>
    </div>
  );
}
