import { NextRequest, NextResponse } from "next/server";
import { customerCrmService } from "@/lib/commerce/services/customer-crm.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("q") || undefined;
    const customers = await withAdminAuth("customers:read", () => customerCrmService.list(search));
    return NextResponse.json({ customers });
  } catch (error) {
    return commerceApiError(error);
  }
}
