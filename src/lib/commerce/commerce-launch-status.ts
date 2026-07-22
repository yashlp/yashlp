import { isCommerceEmailConfigured } from "@/lib/commerce/commerce-email";
import { isObjectStorageConfigured } from "@/lib/commerce/object-storage";
import { isRazorpayConfigured } from "@/lib/payments/config";
import { getSiteUrl } from "@/lib/payments/config";

export type CommerceLaunchCheck = {
  id: string;
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
  required: boolean;
  youMustDo?: boolean;
};

function sessionSecretOk() {
  const s = process.env.SESSION_SECRET;
  return Boolean(s && s.length >= 32 && s !== "civiclens-dev-secret-change-in-production");
}

function databaseOk() {
  return (process.env.DATABASE_URL ?? "").startsWith("postgresql://");
}

function blobOk() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()) || isObjectStorageConfigured();
}

function adminCredsOk() {
  return Boolean(
    process.env.COMMERCE_ADMIN_EMAIL?.trim() && process.env.COMMERCE_ADMIN_PASSWORD?.trim()
  );
}

function demoPaymentBlocked() {
  return process.env.ALLOW_DEMO_PAYMENT !== "true";
}

function indiaOnlyOn() {
  return process.env.INDIA_ONLY_STOREFRONT !== "false";
}

function customDomainOk() {
  const url = getSiteUrl();
  return url.includes("onlyaesthetics.in") && !url.includes("vercel.app");
}

export function getCommerceLaunchStatus(): CommerceLaunchCheck[] {
  const prod = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  return [
    {
      id: "database",
      label: "PostgreSQL (Neon)",
      status: databaseOk() ? "ok" : "fail",
      detail: databaseOk()
        ? "DATABASE_URL is set"
        : "You: create Neon Postgres and set DATABASE_URL in Vercel",
      required: true,
      youMustDo: !databaseOk(),
    },
    {
      id: "session",
      label: "Session secret",
      status: sessionSecretOk() ? "ok" : "fail",
      detail: sessionSecretOk()
        ? "SESSION_SECRET is strong"
        : "You: set SESSION_SECRET (openssl rand -base64 32) in Vercel",
      required: true,
      youMustDo: !sessionSecretOk(),
    },
    {
      id: "admin",
      label: "Commerce admin login",
      status: adminCredsOk() ? "ok" : "fail",
      detail: adminCredsOk()
        ? "COMMERCE_ADMIN_EMAIL + PASSWORD set"
        : "You: set COMMERCE_ADMIN_EMAIL and COMMERCE_ADMIN_PASSWORD in Vercel",
      required: true,
      youMustDo: !adminCredsOk(),
    },
    {
      id: "razorpay",
      label: "Razorpay live payments",
      status: isRazorpayConfigured() ? "ok" : "fail",
      detail: isRazorpayConfigured()
        ? "Razorpay keys configured"
        : "You: complete Razorpay KYC and add live RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET",
      required: true,
      youMustDo: !isRazorpayConfigured(),
    },
    {
      id: "resend",
      label: "Resend email (OTP + orders)",
      status: isCommerceEmailConfigured() ? "ok" : "fail",
      detail: isCommerceEmailConfigured()
        ? "RESEND_API_KEY + COMMERCE_FROM_EMAIL configured"
        : "You: verify domain in Resend and set RESEND_API_KEY + COMMERCE_FROM_EMAIL",
      required: true,
      youMustDo: !isCommerceEmailConfigured(),
    },
    {
      id: "blob",
      label: "Product media storage",
      status: blobOk() ? "ok" : "fail",
      detail: isObjectStorageConfigured()
        ? "Cloudflare R2 / S3 configured"
        : process.env.BLOB_READ_WRITE_TOKEN?.trim()
          ? "Vercel Blob configured"
          : "You: set Cloudflare R2 (S3_*) on Render/Railway, or BLOB_READ_WRITE_TOKEN on Vercel",
      required: true,
      youMustDo: !blobOk(),
    },
    {
      id: "demo_payment",
      label: "Demo payment disabled",
      status: demoPaymentBlocked() ? "ok" : prod ? "fail" : "warn",
      detail: demoPaymentBlocked()
        ? "ALLOW_DEMO_PAYMENT is off"
        : "You: remove ALLOW_DEMO_PAYMENT from production env",
      required: true,
      youMustDo: !demoPaymentBlocked(),
    },
    {
      id: "india_only",
      label: "India-only storefront",
      status: indiaOnlyOn() ? "ok" : "warn",
      detail: indiaOnlyOn()
        ? "INDIA_ONLY_STOREFRONT enabled"
        : "Recommended: set INDIA_ONLY_STOREFRONT=true",
      required: false,
      youMustDo: !indiaOnlyOn(),
    },
    {
      id: "domain",
      label: "Custom domain onlyaesthetics.in",
      status: customDomainOk() ? "ok" : "warn",
      detail: customDomainOk()
        ? `NEXT_PUBLIC_SITE_URL=${getSiteUrl()}`
        : "You: create Vercel project only-aesthetics, point onlyaesthetics.in DNS there (leave CivicLens/yashlp alone)",
      required: false,
      youMustDo: !customDomainOk(),
    },
    {
      id: "product_surface",
      label: "Aesthetics-only deploy mode",
      status: process.env.PRODUCT_SURFACE === "aesthetics" ? "ok" : "warn",
      detail:
        process.env.PRODUCT_SURFACE === "aesthetics"
          ? "PRODUCT_SURFACE=aesthetics — CivicLens routes blocked on this project"
          : "You: on project only-aesthetics set PRODUCT_SURFACE=aesthetics (do not set this on CivicLens)",
      required: true,
      youMustDo: process.env.PRODUCT_SURFACE !== "aesthetics",
    },
    {
      id: "site_url",
      label: "Public site URL",
      status: process.env.NEXT_PUBLIC_SITE_URL ? "ok" : "warn",
      detail: process.env.NEXT_PUBLIC_SITE_URL
        ? `NEXT_PUBLIC_SITE_URL=${process.env.NEXT_PUBLIC_SITE_URL}`
        : "You: set NEXT_PUBLIC_SITE_URL=https://onlyaesthetics.in on only-aesthetics",
      required: false,
      youMustDo: !process.env.NEXT_PUBLIC_SITE_URL,
    },
  ];
}

export function isCommerceLaunchReady() {
  return getCommerceLaunchStatus()
    .filter((c) => c.required)
    .every((c) => c.status === "ok");
}
