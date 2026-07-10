import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, normalizePhone } from "@/lib/auth";
import { getAdminPhones, ADMIN_ROLE } from "@/lib/admin";
import { rateLimitKey, rateLimitResponse } from "@/lib/api-security";
import { verifyOtp } from "@/lib/otp";
import { generateRandomDisplayName } from "@/lib/random-name";

const schema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6),
  name: z.string().min(2).max(32).optional(),
  useRandomName: z.boolean().optional(),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "verify-otp", 20, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const phone = normalizePhone(data.phone);

    if (getAdminPhones().includes(phone)) {
      return NextResponse.json(
        { error: "This mobile number cannot be used here. Try a different number or contact support." },
        { status: 403 }
      );
    }

    const phoneLimited = rateLimitKey("verify-otp-phone", phone, 10, 15 * 60 * 1000);
    if (phoneLimited) return phoneLimited;

    const valid = await verifyOtp(phone, data.otp);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      const displayName =
        data.useRandomName !== false && !data.name?.trim()
          ? generateRandomDisplayName()
          : data.name?.trim() || generateRandomDisplayName();

      const isAdminPhone = getAdminPhones().includes(phone);

      user = await prisma.user.create({
        data: {
          phone,
          name: displayName,
          nameChangeCount: 0,
          role: isAdminPhone ? ADMIN_ROLE : "user",
        },
      });
    } else if (getAdminPhones().includes(phone) && user.role !== ADMIN_ROLE) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: ADMIN_ROLE },
      });
    }

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        nameChangeCount: user.nameChangeCount,
        reputation: user.reputation,
        role: user.role,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
