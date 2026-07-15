import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";
import { createCustomerSession } from "./customer-session";

const OTP_EXPIRY_MIN = 10;

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export async function registerCustomer(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country?: string;
  };
  orderId?: string;
}) {
  const email = input.email.toLowerCase().trim();
  const phone = normalizePhone(input.phone);

  const existing = await prisma.commerceCustomer.findFirst({
    where: { OR: [{ email }, { phone }] },
  });
  if (existing?.passwordHash) {
    throw new Error("An account with this email or phone already exists. Please sign in.");
  }

  const passwordHash = await hashPassword(input.password);

  const customer = existing
    ? await prisma.commerceCustomer.update({
        where: { id: existing.id },
        data: { name: input.name, email, phone, passwordHash, status: "ACTIVE" },
      })
    : await prisma.commerceCustomer.create({
        data: { name: input.name, email, phone, passwordHash, status: "ACTIVE" },
      });

  await prisma.commerceCustomerAddress.deleteMany({ where: { customerId: customer.id } });
  await prisma.commerceCustomerAddress.create({
    data: {
      customerId: customer.id,
      line1: input.address.line1,
      line2: input.address.line2,
      city: input.address.city,
      state: input.address.state,
      postalCode: input.address.postalCode,
      country: input.address.country || "IN",
      phone,
      isDefault: true,
    },
  });

  if (input.orderId) {
    const order = await prisma.commerceOrder.findUnique({ where: { id: input.orderId } });
    if (order && !order.customerId) {
      const haystack = `${order.customerNotes || ""}\n${order.shippingAddress || ""}`.toLowerCase();
      if (haystack.includes(email)) {
        await prisma.commerceOrder.update({
          where: { id: order.id },
          data: { customerId: customer.id },
        });
      }
    }
  }

  await createCustomerSession(customer.id);
  return customer;
}

export async function loginWithEmail(email: string, password: string) {
  const normalized = email.toLowerCase().trim();
  const customer = await prisma.commerceCustomer.findUnique({ where: { email: normalized } });
  if (!customer?.passwordHash || customer.status !== "ACTIVE") {
    throw new Error("Invalid email or password");
  }
  const valid = await verifyPassword(password, customer.passwordHash);
  if (!valid) throw new Error("Invalid email or password");
  await createCustomerSession(customer.id);
  return customer;
}

export async function sendPhoneOtp(phone: string) {
  const normalized = normalizePhone(phone);
  if (normalized.length < 10) throw new Error("Enter a valid phone number");

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000);

  await prisma.commerceCustomerPhoneOtp.create({
    data: { phone: normalized, codeHash: hashOtp(code), expiresAt },
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[Aesthetics OTP] ${normalized}: ${code}`);
  }

  return { phone: normalized, devCode: process.env.NODE_ENV !== "production" ? code : undefined };
}

export async function verifyPhoneOtp(phone: string, code: string) {
  const normalized = normalizePhone(phone);
  const otp = await prisma.commerceCustomerPhoneOtp.findFirst({
    where: {
      phone: normalized,
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp || otp.codeHash !== hashOtp(code)) {
    throw new Error("Invalid or expired code");
  }

  await prisma.commerceCustomerPhoneOtp.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  });

  let customer = await prisma.commerceCustomer.findUnique({ where: { phone: normalized } });
  if (!customer) {
    customer = await prisma.commerceCustomer.create({
      data: { phone: normalized, status: "ACTIVE" },
    });
  }

  await createCustomerSession(customer.id);
  return customer;
}
