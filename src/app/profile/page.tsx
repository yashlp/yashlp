"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, LogOut, Shield } from "lucide-react";

type User = {
  id: string;
  name: string;
  phone: string;
  reputation: number;
  reliabilityScore: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push("/login");
        else setUser(d.user);
      });
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (!user) return <div className="p-8 text-center text-muted">Loading...</div>;

  const tier =
    user.reputation >= 200 ? "Community Leader" : user.reputation >= 100 ? "Trusted Contributor" : "New Member";

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-24">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-600 text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted">{user.phone}</p>
            <span className="mt-1 inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
              {tier}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted">
              <Award className="h-3.5 w-3.5" /> Reputation
            </div>
            <p className="mt-1 text-3xl font-bold text-orange-600">{user.reputation}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted">
              <Shield className="h-3.5 w-3.5" /> Reliability
            </div>
            <p className="mt-1 text-3xl font-bold">
              {Math.round(user.reliabilityScore * 100)}%
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          Earn reputation by confirming incidents, submitting accurate reports, and verifying resolutions.
          Higher reliability increases the weight of your contributions.
        </p>

        <button
          onClick={logout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
