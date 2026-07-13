import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const logs = await withAdminAuth("audit:read", async () => {
      return prisma.commerceAuditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { admin: { select: { name: true, email: true } } },
      });
    });
    return NextResponse.json({ logs });
  } catch (error) {
    return commerceApiError(error);
  }
}
