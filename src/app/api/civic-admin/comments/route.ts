import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);

    const comments = await prisma.comment.findMany({
      where: q
        ? {
            OR: [
              { body: { contains: q, mode: "insensitive" } },
              { user: { name: { contains: q, mode: "insensitive" } } },
              { incident: { title: { contains: q, mode: "insensitive" } } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        incident: {
          select: {
            id: true,
            title: true,
            category: { select: { emoji: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (e) {
    return adminErrorResponse(e);
  }
}
