import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import {
  hashAdminPassword,
  setAdminUnlockSession,
  verifyAdminPassword,
} from "@/lib/admin-password";
import { rateLimitKey, rateLimitResponse } from "@/lib/api-security";
import { prisma } from "@/lib/db";

const schema = z.object({
  currentPassword: z.string().min(8).max(128).optional(),
  newPassword: z.string().min(12).max(128),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "admin-password-set", 10, 30 * 60 * 1000);
  if (limited) return limited;

  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const userLimited = rateLimitKey(`admin-password-set:${user.id}`, user.id, 5, 30 * 60 * 1000);
  if (userLimited) return userLimited;

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = schema.parse(body);

    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (row?.passwordHash) {
      if (!currentPassword || !verifyAdminPassword(currentPassword, row.passwordHash)) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
      }
    }

    const passwordHash = hashAdminPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await setAdminUnlockSession(user.id);
    return NextResponse.json({ ok: true, passwordSet: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not set admin password" }, { status: 500 });
  }
}

