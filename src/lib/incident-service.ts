import { prisma } from "./db";
import {
  CONFIRMATION_THRESHOLD,
  DUPLICATE_RADIUS_METERS,
  INCIDENT_STATUSES,
  RESOLUTION_CONFIRM_THRESHOLD,
  VISIBILITY,
} from "./constants";
import { haversineDistance } from "./utils";

export function calculateConfidence(
  confirmationCount: number,
  reporterReliability: number,
  aiVerified?: boolean | null,
  aiCategoryMatch?: number | null
): number {
  const base = Math.min(confirmationCount / CONFIRMATION_THRESHOLD, 1) * 0.6;
  const reliability = reporterReliability * 0.2;
  const aiBoost =
    (aiVerified ? 0.1 : 0) + ((aiCategoryMatch ?? 0.5) > 0.7 ? 0.1 : 0);
  return Math.min(Math.round((base + reliability + aiBoost) * 100) / 100, 1);
}

export async function findNearbyDuplicate(
  latitude: number,
  longitude: number,
  categoryId: string,
  isPositive: boolean
) {
  const incidents = await prisma.incident.findMany({
    where: {
      categoryId,
      isPositive,
      status: { in: [INCIDENT_STATUSES.PENDING, INCIDENT_STATUSES.ACTIVE] },
    },
    include: { category: true, reporter: { select: { name: true, reliabilityScore: true } } },
  });

  return incidents.find(
    (inc) =>
      haversineDistance(latitude, longitude, inc.latitude, inc.longitude) <=
      DUPLICATE_RADIUS_METERS
  );
}

export async function recalculateIncident(incidentId: string) {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      reporter: true,
      confirmations: true,
      resolutionUpdates: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!incident) return null;

  const confirmationCount = incident.confirmations.length;
  const confidence = calculateConfidence(
    confirmationCount,
    incident.reporter.reliabilityScore,
    incident.aiImageVerified,
    incident.aiCategoryMatch
  );

  let status = incident.status;
  let visibility = incident.visibility;
  let resolvedAt = incident.resolvedAt;

  const latestResolution = incident.resolutionUpdates[0];
  if (latestResolution?.status === "confirmed") {
    status = INCIDENT_STATUSES.RESOLVED;
    resolvedAt = latestResolution.createdAt;
    visibility = VISIBILITY.PUBLIC;
  } else if (latestResolution?.status === "disputed") {
    status = INCIDENT_STATUSES.DISPUTED;
  } else if (confirmationCount >= CONFIRMATION_THRESHOLD) {
    status = INCIDENT_STATUSES.ACTIVE;
    visibility = VISIBILITY.PUBLIC;
  } else if (confirmationCount > 0) {
    status = INCIDENT_STATUSES.PENDING;
  }

  return prisma.incident.update({
    where: { id: incidentId },
    data: {
      confirmationCount,
      confidenceScore: confidence,
      status,
      visibility,
      resolvedAt,
    },
    include: {
      category: true,
      reporter: { select: { id: true, name: true, reputation: true } },
      confirmations: { include: { user: { select: { name: true } } } },
      comments: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      timelineEvents: { orderBy: { createdAt: "desc" }, take: 20 },
      photos: true,
      resolutionUpdates: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function addTimelineEvent(
  incidentId: string,
  action: string,
  userId?: string,
  metadata?: Record<string, unknown>
) {
  return prisma.timelineEvent.create({
    data: {
      incidentId,
      userId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

export async function confirmResolution(resolutionId: string, userId: string, confirm: boolean) {
  const resolution = await prisma.resolutionUpdate.findUnique({
    where: { id: resolutionId },
    include: { incident: true },
  });
  if (!resolution) throw new Error("Resolution not found");

  const data = confirm
    ? { confirmationCount: { increment: 1 } }
    : { disputeCount: { increment: 1 } };

  const updated = await prisma.resolutionUpdate.update({
    where: { id: resolutionId },
    data,
  });

  let status = updated.status;
  if (updated.confirmationCount >= RESOLUTION_CONFIRM_THRESHOLD) {
    status = "confirmed";
  } else if (updated.disputeCount >= RESOLUTION_CONFIRM_THRESHOLD) {
    status = "disputed";
  }

  await prisma.resolutionUpdate.update({
    where: { id: resolutionId },
    data: { status },
  });

  await addTimelineEvent(
    resolution.incidentId,
    confirm ? "resolution_confirmed" : "resolution_disputed",
    userId
  );

  await recalculateIncident(resolution.incidentId);
  return updated;
}

export const incidentInclude = {
  category: true,
  reporter: { select: { id: true, name: true, reputation: true, reliabilityScore: true } },
  confirmations: { include: { user: { select: { name: true } } } },
  comments: {
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
  timelineEvents: { orderBy: { createdAt: "desc" as const }, take: 30 },
  photos: true,
  resolutionUpdates: {
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
};
