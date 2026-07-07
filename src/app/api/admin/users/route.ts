import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_ROLE, adminErrorResponse, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        reputation: true,
        reliabilityScore: true,
        createdAt: true,
        _count: { select: { incidents: true, confirmations: true } },
      },
    });
    return NextResponse.json({ users });
  } catch (e) {
    return adminErrorResponse(e);
  }
}

const patchSchema = z.object({
  userId: z.string(),
  role: z.enum(["user", "admin"]),
});

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = patchSchema.parse(await req.json());

    if (data.userId === admin.id && data.role !== ADMIN_ROLE) {
      return NextResponse.json({ error: "Cannot demote yourself" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: data.userId },
      data: { role: data.role },
      select: { id: true, phone: true, name: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    return adminErrorResponse(e);
  }
}
