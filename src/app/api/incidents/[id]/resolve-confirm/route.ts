import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { confirmResolution } from "@/lib/incident-service";

const schema = z.object({ confirm: z.boolean() });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { confirm } = schema.parse(await req.json());

  const resolution = await prisma.resolutionUpdate.findFirst({
    where: { incidentId: id, status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  if (!resolution) {
    return NextResponse.json({ error: "No pending resolution" }, { status: 400 });
  }

  await confirmResolution(resolution.id, user.id, confirm);
  return NextResponse.json({ ok: true });
}
