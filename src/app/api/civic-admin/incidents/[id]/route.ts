import { NextResponse } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { recalculateIncident } from "@/lib/incident-service";

const patchSchema = z.object({
  status: z.string().optional(),
  underLegalReview: z.boolean().optional(),
  visibilityStage: z.string().optional(),
  complianceAction: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = patchSchema.parse(await req.json());

    await prisma.incident.update({
      where: { id },
      data,
    });

    if (data.visibilityStage !== undefined || data.status !== undefined) {
      await recalculateIncident(id);
    }

    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        category: { select: { emoji: true, name: true } },
        reporter: { select: { name: true } },
      },
    });

    return NextResponse.json({ incident });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    return adminErrorResponse(e);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.incident.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return adminErrorResponse(e);
  }
}
