import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

export async function GET() {
  try {
    const campaigns = await withAdminAuth("marketing:read", () =>
      prisma.commerceCampaign.findMany({ orderBy: { updatedAt: "desc" }, take: 100 })
    );
    const giftCards = await withAdminAuth("marketing:read", () =>
      prisma.commerceGiftCard.findMany({ orderBy: { createdAt: "desc" }, take: 50 })
    );
    const referral = await withAdminAuth("marketing:read", () =>
      prisma.commerceReferralProgram.findFirst({ orderBy: { createdAt: "desc" } })
    );
    return NextResponse.json({ campaigns, giftCards, referral });
  } catch (error) {
    return commerceApiError(error);
  }
}

const campaignSchema = z.object({
  name: z.string().min(1),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "PUSH"]),
  subject: z.string().optional(),
  body: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "ENDED"]).optional(),
  audience: z.string().optional(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = campaignSchema.parse(await req.json());
    const campaign = await withAdminAuth("marketing:write", () =>
      prisma.commerceCampaign.create({
        data: {
          name: body.name,
          channel: body.channel,
          subject: body.subject,
          body: body.body,
          status: body.status || "DRAFT",
          audience: body.audience,
          startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
          endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
        },
      })
    );
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    return commerceApiError(error);
  }
}
