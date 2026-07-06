import { prisma } from "./db";
import {
  SEED_CONFIRMATION_THRESHOLD,
  VERIFIED_CONFIRMATION_THRESHOLD,
  DISPUTE_REOPEN_THRESHOLD,
  DUPLICATE_RADIUS_METERS,
  AREA_RECOGNITION_DEDUP_RADIUS_METERS,
  INCIDENT_STATUSES,
  RESOLUTION_CONFIRM_THRESHOLD,
  VISIBILITY,
  VISIBILITY_STAGE,
} from "./constants";
import { isAreaRecognitionCategory } from "./categories";
import { haversineDistance } from "./utils";
import { buildAggregationSummary } from "./compliance";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function calculateConfidence(
  confirmationCount: number,
  visibilityStage: string,
  reporterReliability: number,
  aiVerified?: boolean | null,
  aiCategoryMatch?: number | null,
  isPositive?: boolean
): number {
  const aiBoost = (aiVerified ? 0.05 : 0) + ((aiCategoryMatch ?? 0.5) > 0.7 ? 0.05 : 0);
  const reliability = reporterReliability * 0.1;

  if (visibilityStage === VISIBILITY_STAGE.PRIVATE) {
    return Math.min(0.35, 0.1 + confirmationCount * 0.05 + reliability);
  }
  if (visibilityStage === VISIBILITY_STAGE.SEED) {
    const base = 0.4 + confirmationCount * 0.04 + reliability + aiBoost;
    return Math.min(0.65, Math.max(0.35, base));
  }
  const base = isPositive ? 0.88 : 0.85;
  const confirmBoost = Math.min(0.1, confirmationCount * 0.005);
  return Math.min(0.98, Math.max(0.7, base + confirmBoost + aiBoost));
}

function deriveVisibilityStage(
  confirmationCount: number,
  status: string,
  disputeCount: number,
  underLegalReview: boolean,
  complianceAction: string | null
): string {
  if (status === INCIDENT_STATUSES.RESOLVED) {
    return VISIBILITY_STAGE.VERIFIED;
  }
  let stage: string = VISIBILITY_STAGE.PRIVATE;
  if (
    confirmationCount >= VERIFIED_CONFIRMATION_THRESHOLD &&
    disputeCount < DISPUTE_REOPEN_THRESHOLD &&
    !underLegalReview &&
    complianceAction !== "limit_visibility" &&
    complianceAction !== "under_review"
  ) {
    stage = VISIBILITY_STAGE.VERIFIED;
  } else if (confirmationCount >= SEED_CONFIRMATION_THRESHOLD) {
    stage = VISIBILITY_STAGE.SEED;
  }
  return stage;
}

function mapVisibilityFromStage(stage: string): string {
  if (stage === VISIBILITY_STAGE.VERIFIED) return VISIBILITY.PUBLIC;
  if (stage === VISIBILITY_STAGE.SEED) return VISIBILITY.SEED;
  return VISIBILITY.HIDDEN;
}

export async function findNearbyDuplicate(
  latitude: number,
  longitude: number,
  categoryId: string,
  isPositive: boolean,
  categorySlug?: string
) {
  const now = new Date();
  const radiusMeters =
    categorySlug && isAreaRecognitionCategory(categorySlug)
      ? AREA_RECOGNITION_DEDUP_RADIUS_METERS
      : DUPLICATE_RADIUS_METERS;

  const incidents = await prisma.incident.findMany({
    where: {
      categoryId,
      isPositive,
      status: {
        in: [
          INCIDENT_STATUSES.PENDING,
          INCIDENT_STATUSES.ACTIVE,
          INCIDENT_STATUSES.POSITIVE_ACTIVE,
          INCIDENT_STATUSES.RESOLUTION_PENDING,
          INCIDENT_STATUSES.DISPUTED,
          INCIDENT_STATUSES.UNDER_REVIEW,
        ],
      },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    include: { category: true, reporter: { select: { name: true, reliabilityScore: true } } },
  });

  return incidents.find(
    (inc) =>
      haversineDistance(latitude, longitude, inc.latitude, inc.longitude) <= radiusMeters
  );
}

export async function recalculateIncident(incidentId: string) {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      category: true,
      reporter: true,
      confirmations: true,
      contentDisputes: true,
      resolutionUpdates: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!incident) return null;

  const confirmationCount = incident.confirmations.length;
  const contentDisputeCount = incident.contentDisputes.length;
  const latestResolution = incident.resolutionUpdates[0];
  const resolutionDisputes = latestResolution?.disputeCount ?? 0;
  const totalDisputes = resolutionDisputes + contentDisputeCount;

  let underLegalReview = incident.underLegalReview;
  let complianceAction = incident.complianceAction;

  if (
    underLegalReview &&
    confirmationCount >= VERIFIED_CONFIRMATION_THRESHOLD &&
    (incident.contentRiskScore ?? 100) < 40 &&
    contentDisputeCount === 0
  ) {
    underLegalReview = false;
    complianceAction = "publish";
  }

  let status = incident.status;
  let resolvedAt = incident.resolvedAt;

  if (contentDisputeCount > 0 && status !== INCIDENT_STATUSES.RESOLVED) {
    status = INCIDENT_STATUSES.DISPUTED;
    underLegalReview = true;
  } else if (latestResolution?.status === "pending") {
    status = INCIDENT_STATUSES.RESOLUTION_PENDING;
    if (latestResolution.confirmationCount >= RESOLUTION_CONFIRM_THRESHOLD) {
      status = INCIDENT_STATUSES.RESOLVED;
      resolvedAt = new Date();
    } else if (latestResolution.disputeCount >= DISPUTE_REOPEN_THRESHOLD) {
      status = INCIDENT_STATUSES.ACTIVE;
      resolvedAt = null;
    }
  } else if (latestResolution?.status === "confirmed") {
    status = INCIDENT_STATUSES.RESOLVED;
    resolvedAt = latestResolution.createdAt;
  } else if (latestResolution?.status === "disputed") {
    status = INCIDENT_STATUSES.DISPUTED;
  } else if (resolutionDisputes >= DISPUTE_REOPEN_THRESHOLD && status === INCIDENT_STATUSES.RESOLVED) {
    status = INCIDENT_STATUSES.ACTIVE;
    resolvedAt = null;
  } else if (confirmationCount >= SEED_CONFIRMATION_THRESHOLD) {
    status =
      underLegalReview
        ? INCIDENT_STATUSES.UNDER_REVIEW
        : incident.isPositive
          ? INCIDENT_STATUSES.POSITIVE_ACTIVE
          : INCIDENT_STATUSES.ACTIVE;
  } else if (confirmationCount > 0) {
    status = underLegalReview ? INCIDENT_STATUSES.UNDER_REVIEW : INCIDENT_STATUSES.PENDING;
  } else {
    status = underLegalReview ? INCIDENT_STATUSES.UNDER_REVIEW : INCIDENT_STATUSES.PENDING;
  }

  const visibilityStage = deriveVisibilityStage(
    confirmationCount,
    status,
    totalDisputes,
    underLegalReview,
    complianceAction
  );
  const visibility = mapVisibilityFromStage(visibilityStage);
  const confidenceScore = calculateConfidence(
    confirmationCount,
    visibilityStage,
    incident.reporter.reliabilityScore,
    incident.aiImageVerified,
    incident.aiCategoryMatch,
    incident.isPositive
  );

  const displayLabel =
    incident.displayLabel ?? `${incident.category.emoji} ${incident.category.name}`;
  const aggregationText = buildAggregationSummary(
    displayLabel,
    confirmationCount,
    incident.category.slug
  );

  return prisma.incident.update({
    where: { id: incidentId },
    data: {
      confirmationCount,
      confidenceScore,
      status,
      visibility,
      visibilityStage,
      resolvedAt,
      underLegalReview,
      complianceAction,
      aggregationText,
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

  let resStatus = updated.status;
  if (updated.confirmationCount >= RESOLUTION_CONFIRM_THRESHOLD) {
    resStatus = "confirmed";
  } else if (updated.disputeCount >= DISPUTE_REOPEN_THRESHOLD) {
    resStatus = "disputed";
  }

  await prisma.resolutionUpdate.update({
    where: { id: resolutionId },
    data: { status: resStatus },
  });

  await addTimelineEvent(
    resolution.incidentId,
    confirm ? "resolution_confirmed" : "resolution_disputed",
    userId
  );

  await recalculateIncident(resolution.incidentId);
  return updated;
}

export function getExpiresAtForCategory(category: { ttlDays: number | null }): Date | null {
  if (!category.ttlDays) return null;
  return addDays(new Date(), category.ttlDays);
}

export function filterMapIncidents<T extends {
  visibilityStage: string;
  status: string;
  expiresAt: Date | string | null;
}>(
  incidents: T[],
  options: { zoom: number; streetLevelZoom?: number; includePrivate?: boolean }
): T[] {
  const { zoom, streetLevelZoom = 12, includePrivate = false } = options;
  const now = new Date();

  return incidents.filter((inc) => {
    if (inc.expiresAt && new Date(inc.expiresAt) < now) return false;
    if (includePrivate) return true;

    if (inc.visibilityStage === VISIBILITY_STAGE.PRIVATE) return false;

    if (zoom < streetLevelZoom && inc.visibilityStage === VISIBILITY_STAGE.SEED) {
      return false;
    }

    return true;
  });
}

export function getVisibilityLabel(stage: string): string {
  switch (stage) {
    case VISIBILITY_STAGE.PRIVATE:
      return "Pending Verification";
    case VISIBILITY_STAGE.SEED:
      return "Community Report (Unverified)";
    case VISIBILITY_STAGE.VERIFIED:
      return "Verified";
    default:
      return "Unknown";
  }
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
  contentDisputes: {
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
};
