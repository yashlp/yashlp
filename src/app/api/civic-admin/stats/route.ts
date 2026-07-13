import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();

    const [users, incidents, categories, reportsToday] = await Promise.all([
      prisma.user.count(),
      prisma.incident.count(),
      prisma.category.count(),
      prisma.incident.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const byStatus = await prisma.incident.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const underReview = await prisma.incident.count({ where: { underLegalReview: true } });

    return NextResponse.json({
      users,
      incidents,
      categories,
      reportsToday,
      underReview,
      byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count._all])),
    });
  } catch (e) {
    return adminErrorResponse(e);
  }
}
