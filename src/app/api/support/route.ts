import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/api-security";
import { sendSupportEmail } from "@/lib/email";

const schema = z.object({
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "support-email", 5, 60 * 60 * 1000);
  if (limited) return limited;

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to contact support" }, { status: 401 });
  }

  try {
    const data = schema.parse(await req.json());
    const result = await sendSupportEmail({
      fromName: user.name,
      fromPhone: user.phone,
      subject: data.subject,
      message: data.message,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }
}
