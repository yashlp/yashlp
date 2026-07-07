"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role === "admin") setState("ok");
        else setState("denied");
      })
      .catch(() => setState("denied"));
  }, []);

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
