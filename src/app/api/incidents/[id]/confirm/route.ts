import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addTimelineEvent, recalculateIncident } from "@/lib/incident-service";
import { rewardConfirmation } from "@/lib/compliance/trustService";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const target = await prisma.incident.findUnique({
    where: { id },
    select: { reporterId: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }
  if (target.reporterId === user.id) {
    return NextResponse.json(
      { error: "You cannot confirm your own report — ask a neighbour to verify it" },
      { status: 400 }
    );
  }

  const existing = await prisma.confirmation.findUnique({
    where: { incidentId_userId: { incidentId: id, userId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already confirmed" }, { status: 400 });
  }

  await prisma.confirmation.create({
    data: { incidentId: id, userId: user.id, comment: "Confirmed by community member." },
  });

  await rewardConfirmation(user.id);

  await addTimelineEvent(id, "confirmed", user.id);
  const incident = await recalculateIncident(id);

  return NextResponse.json({ incident });
}
