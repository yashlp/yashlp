import { NextResponse } from "next/server";
import { getCommerceCustomer } from "@/lib/commerce/customer-session";
import { orderService } from "@/lib/commerce/services/order.service";

export async function GET() {
  const customer = await getCommerceCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const orders = await orderService.listForCustomer(customer.id);
  return NextResponse.json({ orders });
}
