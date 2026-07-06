import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addTimelineEvent, recalculateIncident } from "@/lib/incident-service";

const schema = z.object({
  description: z.string().optional(),
  photoUrl: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = schema.parse(await req.json());

  const resolution = await prisma.resolutionUpdate.create({
    data: {
      incidentId: id,
      userId: user.id,
      description: data.description,
      photoUrl: data.photoUrl,
      status: "pending",
    },
  });

  await addTimelineEvent(id, "resolution_submitted", user.id);
  await recalculateIncident(id);

  return NextResponse.json({ resolution });
}
