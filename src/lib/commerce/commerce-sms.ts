import { isMsg91Configured, sendSmsOtp, sendTransactionalSms, smsMobile } from "@/lib/sms";

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function logSms(kind: string, phone: string, result: { ok: true } | { ok: false; error: string }) {
  if (result.ok) {
    console.info(`[sms:${kind}] sent to ${smsMobile(phone)}`);
    return;
  }
  console.error(`[sms:${kind}] failed for ${smsMobile(phone)}:`, result.error);
}

/** Admin login OTP — uses COMMERCE_ADMIN_PHONE when set. */
export async function notifyAdminOtpSms(code: string) {
  const phone = process.env.COMMERCE_ADMIN_PHONE?.trim();
  if (!phone) {
    return { ok: false as const, error: "COMMERCE_ADMIN_PHONE is not set", skipped: true as const };
  }
  if (!isMsg91Configured()) {
    return { ok: false as const, error: "MSG91 is not configured", skipped: true as const };
  }

  const result = await sendSmsOtp(phone, code);
  logSms("admin-otp", phone, result);
  return { ...result, skipped: false as const };
}

/** Purchase confirmation after payment clears. */
export async function notifyOrderConfirmSms(input: {
  phone: string | null | undefined;
  name: string;
  orderNumber: string;
  totalInr: number;
}) {
  if (!input.phone?.trim()) {
    return { ok: false as const, error: "No phone on order", skipped: true as const };
  }
  if (!isMsg91Configured()) {
    return { ok: false as const, error: "MSG91 is not configured", skipped: true as const };
  }

  const result = await sendTransactionalSms({
    templateEnvKey: "SMS_FLOW_ORDER_CONFIRM",
    phone: input.phone,
    vars: {
      name: input.name,
      order: input.orderNumber,
      amount: formatInr(input.totalInr),
      // Common MSG91 / DLT variable aliases
      VAR1: input.name,
      VAR2: input.orderNumber,
      VAR3: formatInr(input.totalInr),
    },
  });
  logSms("order-confirm", input.phone, result);
  return { ...result, skipped: false as const };
}

/** Shipped / out for delivery / delivered updates. */
export async function notifyDeliverySms(input: {
  phone: string | null | undefined;
  name: string;
  orderNumber: string;
  status: "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED";
  courier?: string | null;
  trackingNumber?: string | null;
}) {
  if (!input.phone?.trim()) {
    return { ok: false as const, error: "No phone on order", skipped: true as const };
  }
  if (!isMsg91Configured()) {
    return { ok: false as const, error: "MSG91 is not configured", skipped: true as const };
  }

  const statusLabel =
    input.status === "SHIPPED"
      ? "shipped"
      : input.status === "OUT_FOR_DELIVERY"
        ? "out for delivery"
        : "delivered";

  const envKey =
    input.status === "SHIPPED"
      ? "SMS_FLOW_SHIPPED"
      : input.status === "OUT_FOR_DELIVERY"
        ? "SMS_FLOW_OUT_FOR_DELIVERY"
        : "SMS_FLOW_DELIVERED";

  // Fall back to a single delivery-update template if specific one is unset
  const primary = process.env[envKey]?.trim();
  const templateEnvKey = primary ? envKey : "SMS_FLOW_DELIVERY_UPDATE";

  const result = await sendTransactionalSms({
    templateEnvKey,
    phone: input.phone,
    vars: {
      name: input.name,
      order: input.orderNumber,
      status: statusLabel,
      courier: input.courier || "Courier",
      tracking: input.trackingNumber || "—",
      VAR1: input.name,
      VAR2: input.orderNumber,
      VAR3: statusLabel,
      VAR4: input.trackingNumber || input.courier || "—",
    },
  });
  logSms(`delivery-${input.status.toLowerCase()}`, input.phone, result);
  return { ...result, skipped: false as const };
}
