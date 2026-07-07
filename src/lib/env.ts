const DEV_SESSION_FALLBACK = "civiclens-dev-secret-change-in-production";

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32) {
      throw new Error("SESSION_SECRET must be set to a random string of at least 32 characters in production");
    }
    if (secret === DEV_SESSION_FALLBACK) {
      throw new Error("SESSION_SECRET must not use the default development value in production");
    }
    return secret;
  }
  return secret && secret.length >= 16 ? secret : DEV_SESSION_FALLBACK;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDemoOtpAllowed(): boolean {
  return process.env.ALLOW_DEMO_OTP === "true" || !isProduction();
}

export function isSmsConfigured(): boolean {
  return Boolean(process.env.SMS_API_KEY && process.env.SMS_PROVIDER);
}
