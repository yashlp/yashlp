"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<
    "loading" | "ok" | "denied" | "needs-password" | "set-password"
  >("loading");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (d) => {
        if (d.user?.role !== "admin") {
          setState("denied");
          return;
        }
        const statusRes = await fetch("/api/admin/auth/status");
        const status = await statusRes.json();
        if (!statusRes.ok) {
          setState("denied");
          return;
        }
        if (!status.hasPassword) {
          setState("set-password");
          return;
        }
        if (!status.unlocked) {
          setState("needs-password");
          return;
        }
        setState("ok");
      })
      .catch(() => setState("denied"));
  }, []);

  const verifyPassword = async () => {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Password verification failed");
      return;
    }
    setPassword("");
    setState("ok");
  };

  const setAdminPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newPassword,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Could not set admin password");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setState("ok");
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-stone-900">Admin access required</h1>
        <p className="mt-2 text-sm text-stone-500">
          Sign in with an admin phone number configured in <code>ADMIN_PHONES</code>.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (state === "needs-password") {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-xl font-bold text-stone-900">Admin password required</h1>
        <p className="mt-2 text-sm text-stone-500">
          Enter your admin password to unlock backend access for this session.
        </p>
        <div className="mt-4 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="input-field w-full"
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            onClick={verifyPassword}
            disabled={saving || password.length < 8}
            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Verifying..." : "Unlock admin"}
          </button>
        </div>
      </div>
    );
  }

  if (state === "set-password") {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-xl font-bold text-stone-900">Set admin password</h1>
        <p className="mt-2 text-sm text-stone-500">
          Secure your admin panel by creating a strong password (minimum 12 characters).
        </p>
        <div className="mt-4 space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New admin password"
            className="input-field w-full"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="input-field w-full"
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            onClick={setAdminPassword}
            disabled={saving || newPassword.length < 12 || confirmPassword.length < 12}
            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Set admin password"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Backend</p>
        <h1 className="text-2xl font-bold text-stone-900">CivicLens Admin</h1>
        <p className="text-sm text-stone-500">Manage incidents, users, and live site settings</p>
      </div>
      <AdminNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}
