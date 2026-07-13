import { NextResponse } from "next/server";
import { getCommerceAdmin } from "@/lib/commerce/admin-session";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const admin = await getCommerceAdmin();
    if (!admin) {
      return NextResponse.json({ admin: null }, { status: 401 });
    }
    return NextResponse.json({ admin });
  } catch (error) {
    return commerceApiError(error);
  }
}
