"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, Rocket } from "lucide-react";

type Check = {
  id: string;
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
  required: boolean;
};

export default function AdminLaunchPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [ready, setReady] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    fetch("/api/civic-admin/launch-status")
      .then((r) => r.json())
      .then((d) => {
        setChecks(d.checks ?? []);
        setReady(Boolean(d.ready));
        setSiteUrl(d.siteUrl ?? "");
      });
  }, []);

  const icon = (status: Check["status"]) => {
    if (status === "ok") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    if (status === "warn") return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    return <XCircle className="h-5 w-5 text-rose-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Rocket className="h-6 w-6 text-orange-600" />
          <div>
            <h2 className="text-lg font-bold text-stone-900">Production launch checklist</h2>
            <p className="mt-1 text-sm text-stone-600">
              Required items must be green before official customer launch. Optional items improve
              experience but are not blocking.
            </p>
            <p className="mt-2 text-sm font-medium text-stone-800">
              Live URL:{" "}
              <a href={siteUrl} className="text-orange-600 underline" target="_blank" rel="noreferrer">
                {siteUrl}
              </a>
            </p>
            <p
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                ready ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
              }`}
            >
              {ready ? "Ready for official launch" : "Setup incomplete"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm"
          >
            {icon(c.status)}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-stone-900">
                {c.label}
                {!c.required && (
                  <span className="ml-2 text-xs font-normal text-stone-400">optional</span>
                )}
              </p>
              <p className="text-sm text-stone-600">{c.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
        <p className="font-semibold">Your steps (Vercel dashboard)</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Add all env vars in Vercel → Settings → Environment Variables → Production</li>
          <li>Redeploy after changing variables</li>
          <li>
            <Link href="/civic-admin/settings" className="font-semibold underline">
              Publish for customers
            </Link>{" "}
            in Site settings
          </li>
          <li>Add custom domain in Vercel → Domains (optional)</li>
        </ol>
        <p className="mt-3">
          Full guide: <code className="rounded bg-white px-1">LAUNCH.md</code> in the GitHub repo.
        </p>
      </div>
    </div>
  );
}
