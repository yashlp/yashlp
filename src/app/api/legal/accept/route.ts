import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { LEGAL_DOCUMENT_VERSION } from "@/lib/legal-engine";

const schema = z.object({
  countryCode: z.string().length(2).optional(),
  legalProfile: z.string().optional(),
  termsVersion: z.string().default(LEGAL_DOCUMENT_VERSION),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = schema.parse(await req.json());

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        countryCode: body.countryCode?.toUpperCase() ?? user.countryCode,
        legalProfile: body.legalProfile ?? user.legalProfile,
        termsAcceptedAt: new Date(),
        termsVersion: body.termsVersion,
      },
    });
  }

  return NextResponse.json({
    accepted: true,
    termsVersion: body.termsVersion,
    acceptedAt: new Date().toISOString(),
  });
}
