import { createHash, randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db";

const CUSTOMER_SESSION_COOKIE = "aes_customer_session";
const SESSION_DAYS = 30;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export type CommerceCustomerUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
};

export type CommerceCustomerAddressItem = {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
};

export type CommerceCustomerWithAddress = CommerceCustomerUser & {
  address: CommerceCustomerAddressItem | null;
  addresses: CommerceCustomerAddressItem[];
  defaultAddressId: string | null;
};

function mapAddress(addr: {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}): CommerceCustomerAddressItem {
  return {
    id: addr.id,
    label: addr.label,
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country,
    phone: addr.phone,
    isDefault: addr.isDefault,
  };
}

export type LegacyCommerceCustomerWithAddress = CommerceCustomerUser & {
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
    phone: string | null;
  } | null;
};

async function loadCustomerFromSession(token: string) {
  return prisma.commerceCustomerSession.findFirst({
    where: {
      tokenHash: hashToken(token),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      customer: {
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
          status: true,
          addresses: {
            orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
          },
        },
      },
    },
  });
}

export async function createCustomerSession(customerId: string) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const meta = await getRequestMeta();

  await prisma.commerceCustomerSession.create({
    data: {
      customerId,
      tokenHash: hashToken(token),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.FORCE_SECURE_COOKIES === "true";

  cookieStore.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return token;
}

export async function destroyCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (token) {
    await prisma.commerceCustomerSession.updateMany({
      where: { tokenHash: hashToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
}

export async function getCommerceCustomer(): Promise<CommerceCustomerUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await loadCustomerFromSession(token);
  if (!session?.customer || session.customer.status !== "ACTIVE") return null;
  const { addresses, ...customer } = session.customer;
  void addresses;
  return customer;
}

export async function getCommerceCustomerWithAddress(): Promise<CommerceCustomerWithAddress | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await loadCustomerFromSession(token);
  if (!session?.customer || session.customer.status !== "ACTIVE") return null;

  const addresses = session.customer.addresses.map(mapAddress);
  const addr = addresses.find((a) => a.isDefault) || addresses[0] || null;
  return {
    id: session.customer.id,
    email: session.customer.email,
    phone: session.customer.phone,
    name: session.customer.name,
    address: addr,
    addresses,
    defaultAddressId: addr?.id || null,
  };
}

export async function requireCommerceCustomer(): Promise<CommerceCustomerUser> {
  const customer = await getCommerceCustomer();
  if (!customer) throw new CustomerAuthError("Sign in required");
  return customer;
}

export class CustomerAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomerAuthError";
  }
}

export async function getRequestMeta() {
  const h = await headers();
  return {
    ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined,
    userAgent: h.get("user-agent") || undefined,
  };
}
