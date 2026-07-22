"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Rocket, XCircle } from "lucide-react";

type Check = {
  id: string;
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
  required: boolean;
  youMustDo?: boolean;
};

export default function CommerceLaunchPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [ready, setReady] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/launch-status", { credentials: "include" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Could not load launch status");
        setChecks(d.checks ?? []);
        setReady(Boolean(d.ready));
        setSiteUrl(d.siteUrl ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  const icon = (status: Check["status"]) => {
    if (status === "ok") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    if (status === "warn") return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    return <XCircle className="h-5 w-5 text-rose-600" />;
  };

  const youMust = checks.filter((c) => c.youMustDo);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-[var(--aes-border)] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Rocket className="h-6 w-6 text-[var(--aes-royal)]" />
          <div>
            <h1 className="text-xl font-bold text-[var(--aes-charcoal)]">Go-live checklist</h1>
            <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
              Green = ready. Items marked &quot;You must do&quot; need your Vercel/provider accounts —
              Cursor cannot set those from here.
            </p>
            <p className="mt-2 text-sm">
              Site URL:{" "}
              <a href={siteUrl || "https://yashlp.vercel.app/aesthetics"} className="text-[var(--aes-royal)] underline" target="_blank" rel="noreferrer">
                {siteUrl || "https://yashlp.vercel.app"}
              </a>
            </p>
            <p
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                ready ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
              }`}
            >
              {ready ? "Required env ready — finish DNS + catalog + first payment" : "Required setup incomplete"}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {youMust.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">Only you can do these</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-amber-950">
            {youMust.map((c) => (
              <li key={c.id}>
                <strong>{c.label}</strong> — {c.detail}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-amber-900">
            Full guide:{" "}
            <Link href="https://github.com/yashlp/yashlp/blob/main/docs/LAUNCH_ONLY_AESTHETICS.md" className="underline" target="_blank">
              docs/LAUNCH_ONLY_AESTHETICS.md
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-2">
        {checks.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 rounded-2xl border border-[var(--aes-border)] bg-white px-4 py-3"
          >
            {icon(c.status)}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[var(--aes-charcoal)]">
                {c.label}
                {!c.required && (
                  <span className="ml-2 text-xs font-normal text-[var(--aes-charcoal-muted)]">optional</span>
                )}
                {c.youMustDo && (
                  <span className="ml-2 text-xs font-semibold text-amber-700">You must do</span>
                )}
              </p>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">{c.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--aes-border)] bg-white p-5 text-sm text-[var(--aes-charcoal-muted)]">
        <p className="font-semibold text-[var(--aes-charcoal)]">After env is green</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            Create Vercel project <strong>only-aesthetics</strong> (not CivicLens / yashlp) and set PRODUCT_SURFACE=aesthetics.
          </li>
          <li>Point onlyaesthetics.in DNS to that project (leave WordPress).</li>
          <li>Redeploy Production once.</li>
          <li>Optional one-time: PURGE_DEMO_CATALOG=true → redeploy → remove var → redeploy.</li>
          <li>
            Add real products at <Link href="/admin/products" className="text-[var(--aes-royal)] underline">/admin/products</Link>.
          </li>
          <li>Place one Razorpay test order from an India network.</li>
        </ol>
      </div>
    </div>
  );
}
