import { prisma } from "./db";
import { haversineDistance } from "./utils";
import type { ReportTier } from "./report-demo-data";

/** Search radius for report data — matches area health score on the map home page. */
export const REPORT_DATA_RADIUS_M = 800;

/**
 * Minimum community data before selling a report.
 *
 * Small (₹29): enough for a neighbourhood snapshot — score, top themes, light trends.
 * Big (₹59): enough for due-diligence depth — category breakdowns, comparisons, richer narrative.
 */
export const REPORT_DATA_REQUIREMENTS = {
  small: {
    label: "Standard report",
    minTotalPins: 8,
    minVerifiedPins: 4,
    minCategories: 2,
    minConfidence: 0.25,
  },
  big: {
    label: "Detailed report",
    minTotalPins: 20,
    minVerifiedPins: 12,
    minCategories: 5,
    minConfidence: 0.45,
  },
} as const;

export type AreaReportDataStats = {
  radiusM: number;
  totalPins: number;
  verifiedPins: number;
  seedPins: number;
  categoryCount: number;
  issuePins: number;
  positivePins: number;
  confidence: number;
  categories: string[];
};

export type ReportDataReadiness = {
  ready: boolean;
  tier: ReportTier;
  stats: AreaReportDataStats;
  requirements: (typeof REPORT_DATA_REQUIREMENTS)[ReportTier];
  gaps: string[];
  message: string;
};

function isVerifiedPin(inc: {
  visibilityStage: string;
  confidenceScore: number;
  status: string;
}): boolean {
  return (
    inc.visibilityStage === "verified" &&
    inc.confidenceScore >= 0.5 &&
    inc.status !== "disputed"
  );
}

function isPublicMapPin(inc: {
  visibilityStage: string;
  underLegalReview: boolean;
}): boolean {
  return (
    !inc.underLegalReview &&
    (inc.visibilityStage === "seed" || inc.visibilityStage === "verified")
  );
}

export async function getAreaReportDataStats(
  latitude: number,
  longitude: number,
  radiusM = REPORT_DATA_RADIUS_M
): Promise<AreaReportDataStats> {
  const incidents = await prisma.incident.findMany({
    where: {
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      latitude: { gte: latitude - 0.02, lte: latitude + 0.02 },
      longitude: { gte: longitude - 0.02, lte: longitude + 0.02 },
    },
    include: { category: true },
  });

  const nearby = incidents.filter(
    (i) =>
      isPublicMapPin(i) &&
      haversineDistance(latitude, longitude, i.latitude, i.longitude) <= radiusM
  );

  const verifiedPins = nearby.filter(isVerifiedPin);
  const seedPins = nearby.filter(
    (i) => i.visibilityStage === "seed" && i.status !== "disputed"
  );
  const categories = new Set(nearby.map((i) => i.category.slug));

  const confidence =
    verifiedPins.length === 0
      ? nearby.length > 0
        ? Math.min(nearby.length / 10, 1) * 0.3
        : 0
      : Math.min(verifiedPins.length / 10, 1) * 0.4 + 0.3;

  return {
    radiusM,
    totalPins: nearby.length,
    verifiedPins: verifiedPins.length,
    seedPins: seedPins.length,
    categoryCount: categories.size,
    issuePins: nearby.filter((i) => !i.isPositive && i.status !== "resolved").length,
    positivePins: nearby.filter((i) => i.isPositive).length,
    confidence: Math.round(confidence * 100) / 100,
    categories: [...categories],
  };
}

export function evaluateReportDataReadiness(
  tier: ReportTier,
  stats: AreaReportDataStats
): ReportDataReadiness {
  const requirements = REPORT_DATA_REQUIREMENTS[tier];
  const gaps: string[] = [];

  if (stats.totalPins < requirements.minTotalPins) {
    gaps.push(
      `${requirements.minTotalPins - stats.totalPins} more community pin(s) needed (${stats.totalPins}/${requirements.minTotalPins})`
    );
  }
  if (stats.verifiedPins < requirements.minVerifiedPins) {
    gaps.push(
      `${requirements.minVerifiedPins - stats.verifiedPins} more verified pin(s) needed (${stats.verifiedPins}/${requirements.minVerifiedPins})`
    );
  }
  if (stats.categoryCount < requirements.minCategories) {
    gaps.push(
      `${requirements.minCategories - stats.categoryCount} more report category type(s) needed (${stats.categoryCount}/${requirements.minCategories})`
    );
  }
  if (stats.confidence < requirements.minConfidence) {
    gaps.push(
      `higher community confidence needed (${Math.round(stats.confidence * 100)}% / ${Math.round(requirements.minConfidence * 100)}% minimum)`
    );
  }

  const ready = gaps.length === 0;

  const message = ready
    ? `This area has enough community data for a ${requirements.label.toLowerCase()}.`
    : `Not enough community data near this location yet for a ${requirements.label.toLowerCase()}. Reports need real neighbourhood pins from CivicLens users — check back as more people report and confirm issues nearby.`;

  return {
    ready,
    tier,
    stats,
    requirements,
    gaps,
    message,
  };
}

export async function checkReportDataReadinessForProduct(
  tier: ReportTier,
  latitude: number,
  longitude: number
): Promise<ReportDataReadiness> {
  const stats = await getAreaReportDataStats(latitude, longitude);
  return evaluateReportDataReadiness(tier, stats);
}
