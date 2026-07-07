import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

    const incidents = await prisma.incident.findMany({
      where: status ? { status } : undefined,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { emoji: true, name: true, slug: true } },
        reporter: { select: { name: true, phone: true } },
      },
    });

    return NextResponse.json({ incidents });
  } catch (e) {
    return adminErrorResponse(e);
  }
}
