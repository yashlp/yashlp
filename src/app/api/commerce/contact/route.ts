import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitResponse } from "@/lib/api-security";
import { sendContactFormEmail } from "@/lib/commerce/commerce-email";

export const runtime = "nodejs";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Surname is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000),
});

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req, "commerce-contact", 5, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = schema.parse(await req.json());
    const result = await sendContactFormEmail(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }
}
