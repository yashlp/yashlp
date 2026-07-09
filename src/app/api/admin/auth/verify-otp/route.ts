import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { ADMIN_ROLE } from "@/lib/admin";
import { getPrimaryAdminPhone } from "@/lib/admin-phone";
import { rateLimitKey, rateLimitResponse } from "@/lib/api-security";
import { verifyOtp } from "@/lib/otp";
import { getPublicSiteConfig } from "@/lib/site-settings";

const schema = z.object({
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "admin-verify-otp", 10, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const phone = getPrimaryAdminPhone();
    const data = schema.parse(await req.json());

    const phoneLimited = rateLimitKey("admin-verify-otp-phone", phone, 8, 15 * 60 * 1000);
    if (phoneLimited) return phoneLimited;

    const valid = await verifyOtp(phone, data.otp);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    const config = await getPublicSiteConfig();
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          email: config.contactEmail,
          name: "CivicLens Admin",
          nameChangeCount: 2,
          role: ADMIN_ROLE,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: ADMIN_ROLE,
          email: config.contactEmail,
        },
      });
    }

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Admin verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
