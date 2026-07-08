import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { isAdminUnlocked } from "@/lib/admin-password";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  const hasPassword = Boolean(row?.passwordHash);
  const unlocked = hasPassword ? await isAdminUnlocked(user.id) : true;

  return NextResponse.json({
    hasPassword,
    unlocked,
  });
}

