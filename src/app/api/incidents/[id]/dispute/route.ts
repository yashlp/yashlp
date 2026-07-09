import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { addTimelineEvent, recalculateIncident } from "@/lib/incident-service";
import { rewardValidDispute } from "@/lib/compliance/trustService";
import { INCIDENT_STATUSES } from "@/lib/constants";
import { sanitizePublicIncident } from "@/lib/photo-approval";

const schema = z.object({
  reason: z.string().min(10).max(500),
  counterEvidence: z.string().optional(),
});

/** Business / institution / community dispute of a report */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in to dispute" }, { status: 401 });

  const { id } = await params;
  const data = schema.parse(await req.json());

  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.contentDispute.upsert({
    where: { incidentId_userId: { incidentId: id, userId: user.id } },
    update: { reason: data.reason, counterEvidence: data.counterEvidence, status: "pending" },
    create: {
      incidentId: id,
      userId: user.id,
      reason: data.reason,
      counterEvidence: data.counterEvidence,
      status: "pending",
    },
  });

  await prisma.incident.update({
    where: { id },
    data: {
      status: INCIDENT_STATUSES.DISPUTED,
      underLegalReview: true,
      complianceAction: "under_review",
    },
  });

  await addTimelineEvent(id, "content_disputed", user.id, { reason: data.reason });
  await rewardValidDispute(user.id);

  const updated = await recalculateIncident(id);
  return NextResponse.json({ incident: sanitizePublicIncident(updated) });
}
