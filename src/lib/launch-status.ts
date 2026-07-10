import { isDemoOtpAllowed, isProduction, isSmsConfigured } from "./env";
import { isPaymentsConfigured, isRazorpayConfigured, isStripeConfigured, getSiteUrl } from "./payments/config";

export type LaunchCheck = {
  id: string;
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
  required: boolean;
};

function sessionSecretOk(): boolean {
  const s = process.env.SESSION_SECRET;
  return Boolean(s && s.length >= 32 && s !== "civiclens-dev-secret-change-in-production");
}

function databaseOk(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return url.startsWith("postgresql://");
}

function openAiOk(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function resendOk(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.SUPPORT_EMAIL_TO?.trim());
}

function s3Ok(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_PUBLIC_URL
  );
}

function customDomainOk(): boolean {
  const url = getSiteUrl();
  return !url.includes("vercel.app");
}

export function getLaunchStatus(): LaunchCheck[] {
  const sms = isSmsConfigured();
  const demoOtp = isDemoOtpAllowed();
  const prod = isProduction();

  return [
    {
      id: "database",
      label: "PostgreSQL database",
      status: databaseOk() ? "ok" : "fail",
      detail: databaseOk()
        ? "DATABASE_URL is set (Neon PostgreSQL)"
        : "Set DATABASE_URL to a postgresql:// Neon pooled URL",
      required: true,
    },
    {
      id: "session",
      label: "Session secret",
      status: sessionSecretOk() ? "ok" : "fail",
      detail: sessionSecretOk()
        ? "SESSION_SECRET is strong (32+ chars)"
        : "Set SESSION_SECRET with: openssl rand -base64 32",
      required: true,
    },
    {
      id: "admin_phones",
      label: "Admin phones",
      status: Boolean(process.env.ADMIN_PHONES?.trim()) ? "ok" : "fail",
      detail: process.env.ADMIN_PHONES?.trim()
        ? "ADMIN_PHONES configured"
        : "Set ADMIN_PHONES to your E.164 admin number",
      required: true,
    },
    {
      id: "sms",
      label: "MSG91 SMS OTP",
      status: sms ? "ok" : "fail",
      detail: sms
        ? "SMS_PROVIDER + SMS_API_KEY configured"
        : "Add MSG91 keys for real customer sign-in",
      required: true,
    },
    {
      id: "demo_otp",
      label: "Demo OTP disabled",
      status: !prod || !demoOtp ? "ok" : sms ? "warn" : "fail",
      detail: !demoOtp
        ? "ALLOW_DEMO_OTP is false — production sign-in uses SMS only"
        : sms
          ? "Set ALLOW_DEMO_OTP=false now that SMS is configured"
          : "ALLOW_DEMO_OTP=true — acceptable only until MSG91 is live",
      required: true,
    },
    {
      id: "razorpay",
      label: "Razorpay (India payments)",
      status: isRazorpayConfigured() ? "ok" : "fail",
      detail: isRazorpayConfigured()
        ? "Razorpay live keys configured"
        : "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (live mode)",
      required: true,
    },
    {
      id: "stripe",
      label: "Stripe (international)",
      status: isStripeConfigured() ? "ok" : "warn",
      detail: isStripeConfigured()
        ? "Stripe live keys configured"
        : "Optional: add STRIPE_PUBLISHABLE_KEY + STRIPE_SECRET_KEY for USD",
      required: false,
    },
    {
      id: "payments",
      label: "Payments enabled",
      status: isPaymentsConfigured() ? "ok" : "fail",
      detail: isPaymentsConfigured()
        ? "At least one payment provider is ready"
        : "Configure Razorpay and/or Stripe",
      required: true,
    },
    {
      id: "site_url",
      label: "Public site URL",
      status: customDomainOk() ? "ok" : "warn",
      detail: customDomainOk()
        ? `NEXT_PUBLIC_SITE_URL=${getSiteUrl()}`
        : `Using ${getSiteUrl()} — set custom .com in Vercel + NEXT_PUBLIC_SITE_URL`,
      required: false,
    },
    {
      id: "openai",
      label: "OpenAI Ask AI",
      status: openAiOk() ? "ok" : "warn",
      detail: openAiOk()
        ? "OPENAI_API_KEY set — Ask AI uses GPT with local data context"
        : "Optional: set OPENAI_API_KEY for smarter Ask AI answers",
      required: false,
    },
    {
      id: "resend",
      label: "Resend support email",
      status: resendOk() ? "ok" : "warn",
      detail: resendOk()
        ? "Support form emails enabled"
        : "Optional: RESEND_API_KEY + SUPPORT_EMAIL_TO + RESEND_FROM_EMAIL",
      required: false,
    },
    {
      id: "s3",
      label: "Cloud photo storage",
      status: s3Ok() ? "ok" : "warn",
      detail: s3Ok()
        ? "S3/R2 configured for photo uploads at scale"
        : "Optional: photos stored in DB until S3_* env vars are set",
      required: false,
    },
  ];
}

export function isLaunchReady(): boolean {
  return getLaunchStatus().filter((c) => c.required).every((c) => c.status === "ok");
}
