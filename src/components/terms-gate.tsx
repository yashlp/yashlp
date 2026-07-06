"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Globe, Shield, CheckCircle2 } from "lucide-react";
import { TERMS_STORAGE_KEY } from "@/lib/constants";

export function TermsGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAccepted(localStorage.getItem(TERMS_STORAGE_KEY) === "true");
  }, []);

  const accept = () => {
    localStorage.setItem(TERMS_STORAGE_KEY, "true");
    setAccepted(true);
  };

  if (accepted === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
      </div>
    );
  }

  if (accepted) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="animate-fade-up w-full max-w-lg rounded-3xl border border-orange-200 bg-white p-8 shadow-2xl shadow-orange-100">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200">
            <Globe className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              Welcome to <span className="text-orange-600">CivicLens</span>
            </h1>
            <p className="text-sm text-stone-500">Community intelligence for every place on Earth</p>
          </div>
        </div>

        <div className="mb-6 max-h-48 overflow-y-auto rounded-2xl border border-orange-100 bg-orange-50/50 p-4 text-sm leading-relaxed text-stone-600">
          <p className="mb-3 font-medium text-stone-800">Before you continue, please review our Terms & Conditions:</p>
          <ul className="space-y-2 text-xs">
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              You agree to submit accurate, good-faith community reports only.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              Location data is used to place incidents on the map and calculate area health scores.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              Do not upload offensive, false, or copyrighted content.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              CivicLens is a community platform — not an official government channel.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              You must be 13+ to use this service. See full terms for privacy and data use.
            </li>
          </ul>
          <Link
            href="/terms"
            target="_blank"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            <FileText className="h-3.5 w-3.5" />
            Read full Terms & Conditions
          </Link>
        </div>

        <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-orange-100 bg-white p-4 transition hover:border-orange-300">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-stone-700">
            I have read and agree to the{" "}
            <Link href="/terms" target="_blank" className="font-medium text-orange-600 hover:underline">
              Terms & Conditions
            </Link>{" "}
            and Privacy Policy.
          </span>
        </label>

        <button
          onClick={accept}
          disabled={!checked}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCircle2 className="h-5 w-5" />
          Accept & Enter CivicLens
        </button>
      </div>
    </div>
  );
}
