import { getAdminPhones } from "./admin";

export function getPrimaryAdminPhone(): string {
  const phones = getAdminPhones();
  if (!phones.length) {
    throw new Error("ADMIN_PHONES is not configured");
  }
  return phones[0];
}

/** Human-readable phone for admin login screen (e.g. +91 95588 12335). */
export function formatAdminPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length >= 12) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  if (digits.length >= 10) {
    return `+${digits.slice(0, digits.length - 10)} ${digits.slice(-10, -5)} ${digits.slice(-5)}`;
  }
  return phone;
}
