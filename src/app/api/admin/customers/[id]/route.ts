import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { customerCrmService } from "@/lib/commerce/services/customer-crm.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const customer = await withAdminAuth("customers:read", () => customerCrmService.getById(id));
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json({ customer });
  } catch (error) {
    return commerceApiError(error);
  }
}

const patchSchema = z.object({
  notes: z.string().max(4000),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = patchSchema.parse(await req.json());
    const customer = await withAdminAuth("customers:write", () =>
      customerCrmService.updateNotes(id, body.notes)
    );
    return NextResponse.json({ customer });
  } catch (error) {
    return commerceApiError(error);
  }
}
