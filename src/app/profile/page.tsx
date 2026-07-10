"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, LogOut, Mail, RefreshCw, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { MAX_NAME_CHANGES, nameChangesRemaining } from "@/lib/random-name";

type User = {
  id: string;
  name: string;
  phone: string;
  nameChangeCount: number;
  reputation: number;
  reliabilityScore: number;
  role?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactEmail, setContactEmail] = useState("yash.shah.uk@gmail.com");
  const [supportFormEnabled, setSupportFormEnabled] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState("");

  const load = useCallback(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push("/login");
        else setUser(d.user);
      });
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((d) => {
        if (d.contactEmail) setContactEmail(d.contactEmail);
        setSupportFormEnabled(Boolean(d.supportFormEnabled));
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const remaining = user ? nameChangesRemaining(user.nameChangeCount) : 0;
  const canEdit = user ? user.role !== "admin" && remaining > 0 : false;

  const changeName = async (useRandom: boolean) => {
    if (!user) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/name", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        useRandom,
        name: useRandom ? undefined : newName.trim(),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not update name");
      return;
    }
    setUser(data.user);
    setNewName("");
    setEditing(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const sendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    setSupportError("");
    setSupportSent(false);
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: supportSubject, message: supportMessage }),
    });
    const data = await res.json();
    setSupportLoading(false);
    if (!res.ok) {
      setSupportError(data.error ?? "Could not send message");
      return;
    }
    setSupportSent(true);
    setSupportSubject("");
    setSupportMessage("");
  };

  if (!user) return <div className="p-8 text-center text-muted">Loading...</div>;

  const tier =
    user.reputation >= 200 ? "Community Leader" : user.reputation >= 100 ? "Trusted Contributor" : "New Member";

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
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

        <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-800">
            <UserRound className="h-4 w-4 text-orange-500" />
            Display name
          </div>
          {user.role === "admin" ? (
            <div className="space-y-2 text-xs text-stone-600">
              <p>Your account is verified.</p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Email:</strong> {contactEmail}
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-500">
                Use a random name to protect your privacy. You can change your display name{" "}
                <strong>{MAX_NAME_CHANGES} times</strong> only.
              </p>
              <p className="mt-2 text-sm font-medium text-orange-700">
                {remaining} of {MAX_NAME_CHANGES} changes remaining
              </p>
            </>
          )}

          {canEdit && !editing && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => changeName(true)}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Random name
              </button>
              <button
                onClick={() => {
                  setEditing(true);
                  setNewName(user.name);
                }}
                disabled={loading}
                className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-orange-50 disabled:opacity-50"
              >
                Choose name
              </button>
            </div>
          )}

          {editing && (
            <div className="mt-3 space-y-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={32}
                className="input-field w-full"
                placeholder="New display name"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => changeName(false)}
                  disabled={loading || newName.trim().length < 2 || newName.trim() === user.name}
                  className="rounded-lg bg-orange-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!canEdit && user.role !== "admin" && (
            <p className="mt-2 text-xs text-stone-500">
              Your display name is locked after {MAX_NAME_CHANGES} changes.
            </p>
          )}

          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
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

        <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-800">
            <Mail className="h-4 w-4 text-orange-500" />
            Contact us
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Have an issue with your account, a report, or need help? We&apos;ll get back to you.
          </p>
          {supportFormEnabled ? (
            <form onSubmit={sendSupport} className="mt-3 space-y-2">
              <input
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                maxLength={120}
                required
                className="input-field w-full"
                placeholder="Subject"
              />
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                maxLength={2000}
                required
                rows={4}
                className="input-field w-full resize-y"
                placeholder="Describe your issue..."
              />
              {supportError && <p className="text-sm text-rose-600">{supportError}</p>}
              {supportSent && (
                <p className="text-sm text-emerald-700">Message sent — we&apos;ll reply soon.</p>
              )}
              <button
                type="submit"
                disabled={supportLoading}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {supportLoading ? "Sending..." : "Send message"}
              </button>
            </form>
          ) : (
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent("CivicLens support request")}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-orange-700 ring-1 ring-orange-200 hover:bg-orange-50"
            >
              <Mail className="h-4 w-4" />
              {contactEmail}
            </a>
          )}
        </div>

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
