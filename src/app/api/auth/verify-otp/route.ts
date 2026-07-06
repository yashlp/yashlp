import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, normalizePhone } from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";

const schema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6),
  name: z.string().min(2).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const phone = normalizePhone(data.phone);

    const valid = await verifyOtp(phone, data.otp);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      const displayName = data.name?.trim() || `User ${phone.slice(-4)}`;
      user = await prisma.user.create({
        data: { phone, name: displayName },
      });
    } else if (data.name?.trim() && user.name.startsWith("User ")) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: data.name.trim() },
      });
    }

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        reputation: user.reputation,
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
