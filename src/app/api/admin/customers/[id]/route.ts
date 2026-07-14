import { NextRequest, NextResponse } from "next/server";
import { customerCrmService } from "@/lib/commerce/services/customer-crm.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const profile = await withAdminAuth("customers:read", () => customerCrmService.getProfile(id));
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error) {
    return commerceApiError(error);
  }
}
