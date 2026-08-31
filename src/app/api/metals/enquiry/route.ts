import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitResponse } from "@/lib/api-security";
import { sendCommerceEmail } from "@/lib/commerce/commerce-email";
import { company } from "@/lib/metals/company";

export const runtime = "nodejs";

const schema = z.object({
  companyName: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  note: z.string().trim().max(4000).optional().default(""),
  grandTotal: z.number().optional(),
  lines: z
    .array(
      z.object({
        grade: z.string(),
        shape: z.string(),
        weightKg: z.number().optional(),
        total: z.number().optional(),
        inStock: z.boolean().optional(),
        dims: z
          .object({
            diameter: z.string().optional(),
            side: z.string().optional(),
            thickness: z.string().optional(),
            width: z.string().optional(),
            length: z.string().optional(),
            qty: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(req: NextRequest) {
  const limited = rateLimitResponse(req, "metals-enquiry", 8, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = schema.parse(await req.json());
    const lineText =
      body.lines.length === 0
        ? "(contact form — no quote lines)"
        : body.lines
            .map((l, i) => {
              const d = l.dims;
              const size = d
                ? [d.diameter && `Ø${d.diameter}`, d.side && `□${d.side}`, d.thickness && `${d.thickness}x${d.width}`, d.length && `L${d.length}`, d.qty && `qty ${d.qty}`]
                    .filter(Boolean)
                    .join(" ")
                : "";
              return `${i + 1}. ${l.grade} / ${l.shape} ${size}${l.inStock ? " [stock]" : ""} — ₹${Math.round(l.total ?? 0)} (${(l.weightKg ?? 0).toFixed(2)} kg)`;
            })
            .join("\n");

    const message = [
      `Jagetiya Metals enquiry`,
      `Company: ${body.companyName}`,
      `Contact: ${body.contact}`,
      `Phone: ${body.phone}`,
      body.email ? `Email: ${body.email}` : null,
      body.grandTotal ? `Indicative total: ₹${Math.round(body.grandTotal)}` : null,
      "",
      lineText,
      "",
      body.note || "",
    ]
      .filter(Boolean)
      .join("\n");

    const to = process.env.METALS_ENQUIRY_EMAIL?.trim() || company.email;
    const result = await sendCommerceEmail({
      to,
      replyTo: body.email || undefined,
      subject: `Jagetiya Metals enquiry — ${body.companyName}`,
      text: message,
    });

    if (!result.ok) {
      // Still accept the enquiry — the floor is reachable by phone.
      return NextResponse.json({
        ok: true,
        emailed: false,
        phone: company.phonePrimary,
        whatsapp: company.whatsapp,
      });
    }
    return NextResponse.json({ ok: true, emailed: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send enquiry" }, { status: 500 });
  }
}
