import { NextResponse } from "next/server";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return adminErrorResponse(e);
  }
}
