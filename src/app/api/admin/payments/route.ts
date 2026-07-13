import { NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const [payments, daily] = await withAdminAuth("payments:read", async () =>
      Promise.all([commercePaymentService.listAdmin(), commercePaymentService.dailyRevenue()])
    );
    return NextResponse.json({ payments, daily });
  } catch (error) {
    return commerceApiError(error);
  }
}
