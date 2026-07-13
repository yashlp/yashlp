import { NextResponse } from "next/server";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { returnService } from "@/lib/commerce/services/return.service";

export async function GET() {
  const customer = await getCommerceCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const returns = await returnService.listForCustomer(customer.id);
  return NextResponse.json({ returns });
}
