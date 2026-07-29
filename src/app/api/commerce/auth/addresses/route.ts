import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCommerceCustomer } from "@/lib/commerce/customer-session";
import { customerAddressSchema } from "@/lib/commerce/validators/customer";

export async function GET() {
  try {
    const customer = await requireCommerceCustomer();
    const addresses = await prisma.commerceCustomerAddress.findMany({
      where: { customerId: customer.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
    return NextResponse.json({ addresses });
  } catch {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await requireCommerceCustomer();
    const body = customerAddressSchema.parse(await req.json());

    const phone = body.phone?.trim() || null;
    const country = (body.country || "IN").toUpperCase();
    const isDefault = Boolean(body.isDefault);

    if (isDefault) {
      await prisma.commerceCustomerAddress.updateMany({
        where: { customerId: customer.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.commerceCustomerAddress.create({
      data: {
        customerId: customer.id,
        label: body.label?.trim() || "Home",
        line1: body.line1.trim(),
        line2: body.line2?.trim() || null,
        city: body.city.trim(),
        state: body.state?.trim() || null,
        postalCode: body.postalCode.trim(),
        country,
        phone,
        isDefault,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save address";
    const status = message.includes("Sign in required") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
