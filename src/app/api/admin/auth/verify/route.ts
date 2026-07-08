import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { setAdminUnlockSession, verifyAdminPassword } from "@/lib/admin-password";
import { rateLimitKey, rateLimitResponse } from "@/lib/api-security";
import { prisma } from "@/lib/db";

const schema = z.object({
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "admin-password-verify", 20, 15 * 60 * 1000);
  if (limited) return limited;

  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const phoneLimited = rateLimitKey(`admin-password-verify:${user.id}`, user.id, 8, 15 * 60 * 1000);
  if (phoneLimited) return phoneLimited;

  try {
    const body = await req.json();
    const { password } = schema.parse(body);

    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    if (!row?.passwordHash) {
      return NextResponse.json(
        { error: "Admin password is not set. Please set it first." },
        { status: 400 }
      );
    }

    if (!verifyAdminPassword(password, row.passwordHash)) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    await setAdminUnlockSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not verify admin password" }, { status: 500 });
  }
}

