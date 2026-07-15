import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { randomBytes } from "crypto";

const schema = z.object({
  amount: z.number().positive(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const code = `AES-GC-${randomBytes(4).toString("hex").toUpperCase()}`;
    const card = await withAdminAuth("marketing:write", () =>
      prisma.commerceGiftCard.create({
        data: {
          code,
          initialBalance: body.amount,
          balance: body.amount,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        },
      })
    );
    return NextResponse.json({ giftCard: card }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
