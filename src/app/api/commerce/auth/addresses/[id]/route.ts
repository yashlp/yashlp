import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCommerceCustomer } from "@/lib/commerce/customer-session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await requireCommerceCustomer();
    const { id } = await params;
    const body = (await req.json()) as { isDefault?: boolean; label?: string };

    const existing = await prisma.commerceCustomerAddress.findFirst({
      where: { id, customerId: customer.id },
    });
    if (!existing) return NextResponse.json({ error: "Address not found" }, { status: 404 });

    if (body.isDefault) {
      await prisma.commerceCustomerAddress.updateMany({
        where: { customerId: customer.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.commerceCustomerAddress.update({
      where: { id },
      data: {
        ...(typeof body.isDefault === "boolean" ? { isDefault: body.isDefault } : {}),
        ...(body.label !== undefined ? { label: body.label.trim() || "Home" } : {}),
      },
    });
    return NextResponse.json({ address: updated });
  } catch {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await requireCommerceCustomer();
    const { id } = await params;

    const existing = await prisma.commerceCustomerAddress.findFirst({
      where: { id, customerId: customer.id },
    });
    if (!existing) return NextResponse.json({ error: "Address not found" }, { status: 404 });

    await prisma.commerceCustomerAddress.delete({ where: { id } });

    if (existing.isDefault) {
      const next = await prisma.commerceCustomerAddress.findFirst({
        where: { customerId: customer.id },
        orderBy: { updatedAt: "desc" },
      });
      if (next) {
        await prisma.commerceCustomerAddress.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
}
