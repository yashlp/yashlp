import { prisma } from "@/lib/db";

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
  return digits;
}

export type GuestCheckoutContact = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

/** Create or update a customer profile for guest checkout so admin Customers list stays accurate. */
export async function ensureGuestCustomer(contact: GuestCheckoutContact): Promise<string> {
  const email = normalizeEmail(contact.email);
  const phone = normalizePhone(contact.phone);

  let customer = await prisma.commerceCustomer.findFirst({
    where: { OR: [{ email }, { phone }] },
  });

  if (!customer) {
    customer = await prisma.commerceCustomer.create({
      data: {
        name: contact.name.trim(),
        email,
        phone,
        emailVerified: false,
        status: "ACTIVE",
      },
    });
  } else {
    customer = await prisma.commerceCustomer.update({
      where: { id: customer.id },
      data: {
        name: customer.name?.trim() || contact.name.trim(),
        email: customer.email || email,
        phone: customer.phone || phone,
      },
    });
  }

  const line1 = contact.line1.trim();
  if (line1) {
    const addressData = {
      line1,
      line2: contact.line2?.trim() || null,
      city: contact.city?.trim() || "—",
      state: contact.state?.trim() || null,
      postalCode: contact.postalCode?.trim() || "—",
      country: (contact.country || "IN").toUpperCase(),
      phone,
      isDefault: true,
    };

    const existing = await prisma.commerceCustomerAddress.findFirst({
      where: { customerId: customer.id, isDefault: true },
    });

    if (existing) {
      await prisma.commerceCustomerAddress.update({
        where: { id: existing.id },
        data: addressData,
      });
    } else {
      await prisma.commerceCustomerAddress.create({
        data: { customerId: customer.id, ...addressData },
      });
    }
  }

  return customer.id;
}
