/**
 * Shiprocket (India) delivery API client.
 * Auth + create adhoc order. Token cached ~9 days (API validity is 10 days).
 */

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

const API_BASE = "https://apiv2.shiprocket.in/v1/external";

export type ParsedShippingAddress = {
  name: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
};

export type ShiprocketCreateResult = {
  shiprocketOrderId: number | string | null;
  shipmentId: number | string | null;
  awb: string | null;
  courierName: string | null;
  labelUrl: string | null;
  raw: unknown;
};

export function isShiprocketConfigured(): boolean {
  return Boolean(
    process.env.SHIPROCKET_EMAIL?.trim() && process.env.SHIPROCKET_PASSWORD?.trim()
  );
}

export function getShiprocketPickupLocation(): string {
  return process.env.SHIPROCKET_PICKUP_LOCATION?.trim() || "Primary";
}

async function shiprocketFetch<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = init;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    const body = json as { message?: string; errors?: unknown };
    const msg =
      body?.message ||
      (body?.errors ? JSON.stringify(body.errors) : "") ||
      text ||
      `Shiprocket HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json as T;
}

export async function getShiprocketToken(): Promise<string> {
  if (!isShiprocketConfigured()) {
    throw new Error("Shiprocket is not configured (set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD)");
  }
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const data = await shiprocketFetch<{ token?: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL!.trim(),
      password: process.env.SHIPROCKET_PASSWORD!.trim(),
    }),
  });

  if (!data?.token) throw new Error("Shiprocket login did not return a token");
  tokenCache = {
    token: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000,
  };
  return data.token;
}

/** Parse multiline shippingAddress created at checkout. */
export function parseShippingAddressBlob(
  blob: string | null | undefined,
  fallback: { city?: string | null; state?: string | null; name?: string; email?: string; phone?: string } = {}
): ParsedShippingAddress {
  const lines = (blob || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let phone = fallback.phone || "";
  let email = fallback.email || "";
  const remaining: string[] = [];

  for (const line of lines) {
    const phoneMatch = line.match(/^Phone:\s*(.+)$/i);
    const emailMatch = line.match(/^Email:\s*(.+)$/i);
    if (phoneMatch) {
      phone = phoneMatch[1].trim();
      continue;
    }
    if (emailMatch) {
      email = emailMatch[1].trim();
      continue;
    }
    if (/^IN(DIA)?$/i.test(line)) continue;
    remaining.push(line);
  }

  const nameLine = remaining[0] || fallback.name || "Customer";
  const nameParts = nameLine.split(/\s+/);
  const firstName = nameParts[0] || "Customer";
  const lastName = nameParts.slice(1).join(" ") || firstName;

  // Prefer "City, State PIN" line
  let city = fallback.city || "";
  let state = fallback.state || "";
  let pincode = "";
  let cityLineIdx = -1;

  for (let i = remaining.length - 1; i >= 0; i--) {
    const m = remaining[i].match(/^(.+?)(?:,\s*([A-Za-z\s]+))?\s+(\d{6})\s*$/);
    if (m) {
      city = m[1].trim();
      state = (m[2] || state || "").trim();
      pincode = m[3];
      cityLineIdx = i;
      break;
    }
    const pinOnly = remaining[i].match(/(\d{6})/);
    if (pinOnly && !pincode) pincode = pinOnly[1];
  }

  const addressLines = remaining.filter((_, i) => i !== 0 && i !== cityLineIdx);
  const line1 = addressLines[0] || remaining[1] || city || "Address";
  const line2 = addressLines.slice(1).join(", ");

  phone = phone.replace(/\D/g, "").slice(-10);

  return {
    name: firstName,
    lastName,
    line1,
    line2,
    city: city || "City",
    state: state || "State",
    pincode: pincode || "000000",
    phone: phone || "9999999999",
    email: email || "orders@onlyaesthetic.in",
  };
}

export type CreateShiprocketShipmentInput = {
  orderNumber: string;
  orderDate: Date;
  subtotal: number;
  paymentMethod?: "Prepaid" | "COD";
  weightKg?: number;
  lengthCm?: number;
  breadthCm?: number;
  heightCm?: number;
  address: ParsedShippingAddress;
  items: { name: string; sku?: string; units: number; sellingPrice: number }[];
};

export async function createShiprocketShipment(
  input: CreateShiprocketShipmentInput
): Promise<ShiprocketCreateResult> {
  const token = await getShiprocketToken();
  const orderDate = input.orderDate
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");

  const payload = {
    order_id: input.orderNumber.slice(0, 50),
    order_date: orderDate,
    pickup_location: getShiprocketPickupLocation(),
    billing_customer_name: input.address.name,
    billing_last_name: input.address.lastName,
    billing_address: input.address.line1,
    billing_address_2: input.address.line2 || undefined,
    billing_city: input.address.city,
    billing_pincode: input.address.pincode,
    billing_state: input.address.state,
    billing_country: "India",
    billing_email: input.address.email,
    billing_phone: input.address.phone,
    shipping_is_billing: true,
    order_items: input.items.map((item) => ({
      name: item.name.slice(0, 200),
      sku: (item.sku || item.name).slice(0, 50),
      units: item.units,
      selling_price: Math.max(1, Math.round(item.sellingPrice)),
    })),
    payment_method: input.paymentMethod || "Prepaid",
    sub_total: Math.max(1, Math.round(input.subtotal)),
    length: input.lengthCm ?? Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM || 20),
    breadth: input.breadthCm ?? Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM || 15),
    height: input.heightCm ?? Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM || 10),
    weight: input.weightKg ?? Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG || 0.5),
  };

  const raw = await shiprocketFetch<Record<string, unknown>>("/orders/create/adhoc", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  const awb =
    (raw.awb_code as string | undefined) ||
    (raw.awb as string | undefined) ||
    ((raw.data as { awb_code?: string } | undefined)?.awb_code ?? null);

  const shipmentId =
    (raw.shipment_id as number | string | undefined) ||
    ((raw.data as { shipment_id?: number | string } | undefined)?.shipment_id ?? null);

  const shiprocketOrderId =
    (raw.order_id as number | string | undefined) ||
    ((raw.data as { order_id?: number | string } | undefined)?.order_id ?? null);

  const courierName =
    (raw.courier_name as string | undefined) ||
    ((raw.data as { courier_name?: string } | undefined)?.courier_name ?? "Shiprocket");

  const labelUrl =
    (raw.label_url as string | undefined) ||
    (shipmentId
      ? `https://app.shiprocket.in/seller/orders/details/${shiprocketOrderId || ""}`
      : null);

  return {
    shiprocketOrderId: shiprocketOrderId ?? null,
    shipmentId: shipmentId ?? null,
    awb: awb ? String(awb) : null,
    courierName: courierName ? String(courierName) : "Shiprocket",
    labelUrl,
    raw,
  };
}

/** Map Shiprocket webhook / tracking status strings → our order statuses. */
export function mapShiprocketStatusToOrderStatus(
  status: string
): "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | null {
  const s = status.toLowerCase().replace(/[_-]/g, " ");
  if (
    s.includes("delivered") ||
    s.includes("rto delivered") ||
    s === "delivered"
  ) {
    return "DELIVERED";
  }
  if (s.includes("out for delivery") || s.includes("ofd")) {
    return "OUT_FOR_DELIVERY";
  }
  if (
    s.includes("shipped") ||
    s.includes("in transit") ||
    s.includes("picked up") ||
    s.includes("pickup") ||
    s.includes("dispatched") ||
    s.includes("in transit")
  ) {
    return "SHIPPED";
  }
  return null;
}
