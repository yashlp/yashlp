"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, Shield } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

/** CivicLens-only admin login — never shared with Only Aesthetic `/admin`. */
export default function CivicAdminLoginPage() {
  const router = useRouter();
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/civic-admin/auth/login-info")
      .then((r) => r.json())
      .then((d) => {
        if (d.phoneDisplay) setPhoneDisplay(d.phoneDisplay);
        if (d.email) setEmail(d.email);
      })
      .catch(() => setError("CivicLens admin login is not configured on this server."));

    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role === "admin") router.replace("/civic-admin");
      })
      .catch(() => {});
  }, [router]);

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/civic-admin/auth/send-otp", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send code");
      return;
    }
    setOtpSent(true);
    setHint(data.demoHint ?? "");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/civic-admin/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Invalid code");
      return;
    }
    window.dispatchEvent(new Event("civiclens-auth"));
    router.push("/civic-admin");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50">
        <div className="mb-6 text-center">
          <BrandLogo variant="icon" href="/" className="mx-auto justify-center" imageClassName="h-14 w-14" />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            CivicLens
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900">Community admin sign in</h1>
          <p className="mt-1 text-sm text-stone-500">
            Map pins, picture approval, and launch settings. Separate from the Only Aesthetic store
            admin.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <Phone className="h-4 w-4 text-orange-600" />
            <span className="font-medium">CivicLens admin phone</span>
          </div>
          <p className="text-lg font-bold tracking-wide text-orange-800">
            {phoneDisplay || "Loading…"}
          </p>
          {email && (
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Mail className="h-3.5 w-3.5 text-orange-500" />
              <span>{email}</span>
            </div>
          )}
          <p className="text-xs text-stone-500">
            Customer map sign-in is at /login. Store admin is at /admin/login (Only Aesthetic).
          </p>
        </div>

        {!otpSent ? (
          <button
            type="button"
            onClick={sendOtp}
            disabled={loading || !phoneDisplay}
            className="mt-5 w-full rounded-2xl bg-orange-600 py-3.5 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send OTP to admin phone"}
          </button>
        ) : (
          <form onSubmit={verifyOtp} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700">6-digit OTP</label>
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
            {hint && (
              <p className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-800">
                <Shield className="h-4 w-4 shrink-0" />
                {hint}
              </p>
            )}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-2xl bg-orange-600 py-3.5 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Verify & open CivicLens admin"}
            </button>
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="w-full text-sm font-medium text-orange-700 hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          </form>
        )}

        {error && !otpSent && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      </div>

      <p className="mt-4 text-center text-sm text-stone-500">
        <Link href="/" className="text-orange-600 hover:underline">
          ← Back to CivicLens map
        </Link>
      </p>
    </div>
  );
}
