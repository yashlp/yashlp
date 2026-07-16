import { NextResponse } from "next/server";
import { getCommerceCustomerWithAddress } from "@/lib/commerce/customer-session";

export async function GET() {
  const customer = await getCommerceCustomerWithAddress();
  if (!customer) return NextResponse.json({ customer: null });
  return NextResponse.json({ customer });
}
