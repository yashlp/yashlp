import { NextResponse } from "next/server";
import { destroyCustomerSession } from "@/lib/commerce/customer-session";

export async function POST() {
  await destroyCustomerSession();
  return NextResponse.json({ ok: true });
}
