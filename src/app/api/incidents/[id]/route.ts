import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { publicIncidentInclude } from "@/lib/incident-service";
import { sanitizePublicIncident } from "@/lib/photo-approval";
import { VISIBILITY_STAGE } from "@/lib/constants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incident = await prisma.incident.findUnique({
    where: { id },
    include: publicIncidentInclude,
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getSessionUser();
  const isOwner = user?.id === incident.reporterId;
  const isStaff = isAdmin(user);
  const isPublicStage =
    (incident.visibilityStage === VISIBILITY_STAGE.SEED ||
      incident.visibilityStage === VISIBILITY_STAGE.VERIFIED) &&
    !incident.underLegalReview;

  if (!isPublicStage && !isOwner && !isStaff) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ incident: sanitizePublicIncident(incident) });
}
