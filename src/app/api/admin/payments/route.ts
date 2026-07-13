import { NextResponse } from "next/server";
import { commercePaymentService } from "@/lib/commerce/services/commerce-payment.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const [payments, daily, gstAgg] = await withAdminAuth("payments:read", async () =>
      Promise.all([
        commercePaymentService.listAdmin(),
        commercePaymentService.dailyRevenue(),
        import("@/lib/db").then(({ prisma }) =>
          prisma.commerceOrder.aggregate({ _sum: { tax: true }, where: { status: { not: "CANCELLED" } } })
        ),
      ])
    );
    return NextResponse.json({ payments, daily, gstCollected: gstAgg._sum?.tax || 0 });
  } catch (error) {
    return commerceApiError(error);
  }
}
