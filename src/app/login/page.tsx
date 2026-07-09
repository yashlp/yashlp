"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, RefreshCw, Shield, UserRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [useRandomName, setUseRandomName] = useState(true);
  const [randomName, setRandomName] = useState("");
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [isAdminPhone, setIsAdminPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshRandomName = async () => {
    const res = await fetch("/api/auth/name");
    const data = await res.json();
    setRandomName(data.name);
  };

  useEffect(() => {
    if (step === "otp" && !randomName) {
      refreshRandomName();
    }
  }, [step, randomName]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) return;
        router.replace(d.user.role === "admin" ? "/admin" : "/");
      })
      .catch(() => {});
  }, [router]);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send code");
      return;
    }
    setIsAdminPhone(Boolean(data.isAdminPhone));
    setHint(data.demoHint ?? "");
    setStep("otp");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        otp,
        useRandomName,
        name: useRandomName ? undefined : customName.trim() || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Invalid code");
      return;
    }
    window.dispatchEvent(new Event("civiclens-auth"));
    router.push(data.user?.role === "admin" ? "/admin" : "/");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-md flex-col justify-center px-4 py-12 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-12">
      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200">
            <Phone className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Sign in with phone</h1>
          <p className="mt-1 text-sm text-stone-500">
            No password needed — we&apos;ll text you a quick code.
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700">Mobile number</label>
              <div className="mt-1 flex gap-2">
                <span className="flex items-center rounded-xl border border-orange-200 bg-orange-50 px-3 text-sm text-stone-600">
                  +
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))}
                  placeholder="91 98765 43210"
                  required
                  className="input-field flex-1"
                />
              </div>
              <p className="mt-1 text-xs text-stone-400">Include country code (e.g. 91 for India)</p>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || phone.replace(/\D/g, "").length < 10}
              className="w-full rounded-2xl bg-orange-600 py-3.5 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <p className="rounded-xl bg-orange-50 px-3 py-2 text-center text-sm text-stone-600">
              Code sent to <strong>+{phone.replace(/\D/g, "")}</strong>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="ml-2 text-orange-600 hover:underline"
              >
                Change
              </button>
            </p>
            <div>
              <label className="text-sm font-medium text-stone-700">6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                className="input-field mt-1 w-full text-center text-2xl tracking-[0.4em]"
              />
            </div>

            {!isAdminPhone ? (
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-stone-800">
                  <UserRound className="h-4 w-4 text-orange-500" />
                  Display name (privacy)
                </div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    checked={useRandomName}
                    onChange={() => setUseRandomName(true)}
                    className="mt-1"
                  />
                  <span className="text-sm text-stone-700">
                    <strong>Use random name</strong> — recommended for privacy
                  </span>
                </label>
                {useRandomName && (
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                    <span className="flex-1 font-medium text-orange-700">
                      {randomName || "Generating..."}
                    </span>
                    <button
                      type="button"
                      onClick={refreshRandomName}
                      className="rounded-lg p-1.5 text-orange-600 hover:bg-orange-50"
                      title="New random name"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <label className="mt-3 flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    checked={!useRandomName}
                    onChange={() => setUseRandomName(false)}
                    className="mt-1"
                  />
                  <span className="text-sm text-stone-700">Choose my own name</span>
                </label>
                {!useRandomName && (
                  <input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Your display name"
                    maxLength={32}
                    className="input-field mt-2 w-full"
                  />
                )}
                <p className="mt-2 text-xs text-stone-500">
                  New accounts get a privacy-friendly name. You can change it up to 2 times later in
                  Profile.
                </p>
              </div>
            ) : (
              <p className="rounded-xl bg-violet-50 px-3 py-2 text-xs text-violet-700">
                Admin verification mode: OTP login will take you directly to the admin panel.
              </p>
            )}

            {hint && (
              <p className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-800">
                <Shield className="h-4 w-4 shrink-0" />
                {hint}
              </p>
            )}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6 ||
                (!isAdminPhone && !useRandomName && customName.trim().length < 2)
              }
              className="w-full rounded-2xl bg-orange-600 py-3.5 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & continue"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-stone-500">
        <Link href="/" className="text-orange-600 hover:underline">
          ← Continue without signing in
        </Link>
      </p>
    </div>
  );
}
