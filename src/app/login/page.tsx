"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("demo@civiclens.app");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email, password } : { email, password, name };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Authentication failed");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200">
            <span className="text-lg font-bold">CL</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            {mode === "login" ? "Welcome back" : "Join CivicLens"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {mode === "login"
              ? "Sign in to report, confirm, and build reputation."
              : "Create an account to contribute community intelligence."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-600 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button onClick={() => setMode("register")} className="text-orange-600 hover:underline">
                Register
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button onClick={() => setMode("login")} className="text-orange-600 hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>

        {mode === "login" && (
          <p className="mt-4 rounded-xl bg-orange-50 p-3 text-center text-xs text-stone-500">
            Demo: demo@civiclens.app / demo1234
          </p>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        <Link href="/" className="text-orange-600 hover:underline">
          ← Back to map
        </Link>
      </p>
    </div>
  );
}
