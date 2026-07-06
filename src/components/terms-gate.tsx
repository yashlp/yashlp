"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Globe, Shield, CheckCircle2, Scale } from "lucide-react";
import {
  TERMS_STORAGE_KEY,
  TERMS_VERSION_KEY,
  LEGAL_PROFILE_KEY,
  LEGAL_COUNTRY_KEY,
  LEGAL_DOCUMENT_VERSION,
} from "@/lib/constants";
import type { CountryDetectionResult } from "@/lib/legal-engine";

export function TermsGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const [detection, setDetection] = useState<CountryDetectionResult | null>(null);

  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(TERMS_VERSION_KEY);
      const isAccepted =
        localStorage.getItem(TERMS_STORAGE_KEY) === "true" &&
        storedVersion === LEGAL_DOCUMENT_VERSION;
      setAccepted(isAccepted);
    } catch {
      setAccepted(false);
    }

    const deviceCountry = navigator.language?.includes("-")
      ? navigator.language.split("-")[1]?.toUpperCase()
      : undefined;

    fetch(`/api/legal/detect${deviceCountry ? `?country=${deviceCountry}` : ""}`)
      .then((r) => r.json())
      .then((d) => setDetection(d))
      .catch(() =>
        setDetection({
          country: "International",
          countryCode: "INT",
          region: "International",
          legalProfile: "GLOBAL_DEFAULT",
          detectionSource: "fallback",
        })
      );
  }, []);

  const accept = async () => {
    localStorage.setItem(TERMS_STORAGE_KEY, "true");
    localStorage.setItem(TERMS_VERSION_KEY, LEGAL_DOCUMENT_VERSION);
    if (detection) {
      localStorage.setItem(LEGAL_PROFILE_KEY, detection.legalProfile);
      localStorage.setItem(LEGAL_COUNTRY_KEY, detection.countryCode);
    }

    try {
      await fetch("/api/legal/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: detection?.countryCode,
          legalProfile: detection?.legalProfile,
          termsVersion: LEGAL_DOCUMENT_VERSION,
        }),
      });
    } catch {
      // local acceptance still valid for anonymous users
    }

    setAccepted(true);
  };

  if (accepted === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#fffaf7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
        <p className="text-sm text-stone-500">Loading CivicLens...</p>
      </div>
    );
  }

  if (accepted) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="animate-fade-up w-full max-w-lg rounded-3xl border border-orange-200 bg-white p-4 shadow-2xl shadow-orange-100 sm:p-8">
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

        {detection && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/80 px-3 py-2 text-xs text-stone-600">
            <Scale className="h-4 w-4 shrink-0 text-orange-500" />
            <span>
              Legal documents adapted for <strong>{detection.country}</strong> (
              {detection.legalProfile.replace(/_/g, " ")})
            </span>
          </div>
        )}

        <div className="mb-6 max-h-48 overflow-y-auto rounded-2xl border border-orange-100 bg-orange-50/50 p-4 text-sm leading-relaxed text-stone-600">
          <p className="mb-3 font-medium text-stone-800">
            CivicLens is a community intelligence platform — not a legal authority. By continuing
            you agree that:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              Reports are user-generated and NOT legally verified as absolute truth.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              You submit accurate, good-faith community reports only — no false accusations.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              Location data is used to place incidents and calculate area health scores.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              Businesses may dispute reports; no automatic assumption of guilt.
            </li>
            <li className="flex gap-2">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              High-risk content is AI-reviewed and may be held under review before public visibility.
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/terms"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              <FileText className="h-3.5 w-3.5" />
              Terms
            </Link>
            <Link
              href="/privacy"
              target="_blank"
              className="text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              Privacy
            </Link>
            <Link
              href="/content-policy"
              target="_blank"
              className="text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              Content Guidelines
            </Link>
          </div>
        </div>

        <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-orange-100 bg-white p-4 transition hover:border-orange-300">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-stone-700">
            I have read and agree to the region-adapted{" "}
            <Link href="/terms" target="_blank" className="font-medium text-orange-600 hover:underline">
              Terms & Conditions
            </Link>
            ,{" "}
            <Link href="/privacy" target="_blank" className="font-medium text-orange-600 hover:underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/content-policy"
              target="_blank"
              className="font-medium text-orange-600 hover:underline"
            >
              Content Guidelines
            </Link>
            .
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
