import { prisma } from "./db";
import { inferCountryCode } from "./country-from-coords";
import { getCountryName } from "./countries";
import { haversineDistance } from "./utils";

type IncidentForScore = {
  id: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  isPositive: boolean;
  confidenceScore: number;
  status: string;
  visibilityStage?: string;
  category: { slug: string; name: string; type: string };
};

export function computeHealthScore(incidents: IncidentForScore[]) {
  const active = incidents.filter((i) => i.status !== "disputed");
  const verified = active.filter(
    (i) => i.visibilityStage === "verified" && i.confidenceScore >= 0.5
  );
  const issueCount = active.filter(
    (i) => !i.isPositive && i.status !== "resolved" && i.status !== "positive_active"
  ).length;
  const totalInArea = active.length;

  if (verified.length === 0) {
    return {
      overallScore: 75,
      confidence: totalInArea > 0 ? Math.min(totalInArea / 10, 1) * 0.3 : 0.2,
      categoryScores: {} as Record<string, number>,
      incidentCount: verified.length,
      issueCount,
      totalInArea,
    };
  }

  let penalty = 0;
  let bonus = 0;
  const categoryImpact: Record<string, number> = {};

  for (const inc of verified) {
    const weight = inc.confidenceScore;
    const slug = inc.category.slug;

    if (inc.isPositive || inc.status === "resolved") {
      const boost = inc.category.slug === "great-community-area" ? 5 : 3;
      bonus += boost * weight;
      categoryImpact[slug] = (categoryImpact[slug] ?? 0) + boost * weight;
    } else if (inc.status === "active" || inc.status === "pending") {
      penalty += 5 * weight;
      categoryImpact[slug] = (categoryImpact[slug] ?? 0) - 5 * weight;
    }
  }

  const rawScore = 75 - penalty + bonus;
  const overallScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const confidence = Math.min(verified.length / 10, 1) * 0.4 + 0.3;

  const categoryScores: Record<string, number> = {};
  for (const [slug, impact] of Object.entries(categoryImpact)) {
    categoryScores[slug] = Math.max(0, Math.min(100, Math.round(75 + impact)));
  }

  return {
    overallScore,
    confidence: Math.round(confidence * 100) / 100,
    categoryScores,
    incidentCount: verified.length,
    issueCount,
    totalInArea,
  };
}

export async function getAreaHealthScore(
  latitude: number,
  longitude: number,
  radiusM = 800
) {
  const incidents = await prisma.incident.findMany({
    where: {
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      latitude: { gte: latitude - 0.02, lte: latitude + 0.02 },
      longitude: { gte: longitude - 0.02, lte: longitude + 0.02 },
    },
    include: { category: true },
  });

  const nearby = incidents.filter(
    (i) => haversineDistance(latitude, longitude, i.latitude, i.longitude) <= radiusM
  );

  return computeHealthScore(nearby);
}

export async function getPopularCategoriesInArea(
  latitude: number,
  longitude: number,
  type: "issue" | "positive",
  radiusM = 800,
  limit = 6
) {
  const incidents = await prisma.incident.findMany({
    where: {
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      latitude: { gte: latitude - 0.02, lte: latitude + 0.02 },
      longitude: { gte: longitude - 0.02, lte: longitude + 0.02 },
      category: { type },
    },
    include: { category: true },
  });

  const counts = new Map<string, number>();
  for (const inc of incidents) {
    if (haversineDistance(latitude, longitude, inc.latitude, inc.longitude) > radiusM) continue;
    const slug = inc.category.slug;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  const slugs = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);

  return { slugs, counts: Object.fromEntries(counts) };
}

export async function getCountryRankings(limit = 20) {
  const incidents = await prisma.incident.findMany({
    where: {
      visibilityStage: { in: ["verified", "seed"] },
      underLegalReview: false,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    include: { category: true },
  });

  const byCountry = new Map<string, IncidentForScore[]>();

  for (const inc of incidents) {
    const code =
      inc.countryCode ??
      inferCountryCode(inc.latitude, inc.longitude, inc.address);
    if (!code) continue;

    const bucket = byCountry.get(code) ?? [];
    bucket.push(inc);
    byCountry.set(code, bucket);
  }

  const rankings = Array.from(byCountry.entries()).map(([countryCode, countryIncidents]) => {
    const score = computeHealthScore(countryIncidents);
    return {
      countryCode,
      name: getCountryName(countryCode),
      pinCount: countryIncidents.length,
      ...score,
    };
  });

  return rankings
    .filter((r) => r.pinCount > 0)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);
}

/** @deprecated Use getCountryRankings — area rankings replaced by country score rankings */
export async function getRankings(limit = 10) {
  return getCountryRankings(limit);
}

export async function getTrends(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const incidents = await prisma.incident.findMany({
    where: { createdAt: { gte: since } },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  const byDay = new Map<string, { reported: number; resolved: number; positive: number }>();

  for (const inc of incidents) {
    const day = inc.createdAt.toISOString().slice(0, 10);
    const entry = byDay.get(day) ?? { reported: 0, resolved: 0, positive: 0 };
    entry.reported += 1;
    if (inc.isPositive) entry.positive += 1;
    if (inc.status === "resolved") entry.resolved += 1;
    byDay.set(day, entry);
  }

  return Array.from(byDay.entries()).map(([date, stats]) => ({ date, ...stats }));
}
