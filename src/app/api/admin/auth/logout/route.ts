import { NextResponse } from "next/server";
import { adminLogout } from "@/lib/commerce/admin-auth";
import { commerceApiError } from "@/lib/commerce/api-utils";

export async function POST() {
  try {
    await adminLogout();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return commerceApiError(error);
  }
}
