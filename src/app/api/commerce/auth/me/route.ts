import { NextResponse } from "next/server";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";

export async function GET() {
  const customer = await getCommerceCustomer();
  if (!customer) return NextResponse.json({ customer: null });
  return NextResponse.json({ customer });
}
