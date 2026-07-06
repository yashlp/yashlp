import { prisma } from "./db";
import { haversineDistance } from "./utils";

type IncidentForScore = {
  id: string;
  latitude: number;
  longitude: number;
  isPositive: boolean;
  confidenceScore: number;
  status: string;
  category: { slug: string; name: string; type: string };
};

export function computeHealthScore(incidents: IncidentForScore[]) {
  const verified = incidents.filter(
    (i) => i.confidenceScore >= 0.5 && i.status !== "disputed"
  );

  if (verified.length === 0) {
    return {
      overallScore: 75,
      confidence: 0.2,
      categoryScores: {} as Record<string, number>,
      incidentCount: 0,
    };
  }

  let penalty = 0;
  let bonus = 0;
  const categoryImpact: Record<string, number> = {};

  for (const inc of verified) {
    const weight = inc.confidenceScore;
    const slug = inc.category.slug;

    if (inc.isPositive || inc.status === "resolved") {
      bonus += 3 * weight;
      categoryImpact[slug] = (categoryImpact[slug] ?? 0) + 3 * weight;
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
  };
}

export async function getAreaHealthScore(
  latitude: number,
  longitude: number,
  radiusM = 800
) {
  const incidents = await prisma.incident.findMany({
    where: {
      visibility: "public",
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

export async function getRankings(limit = 10) {
  const incidents = await prisma.incident.findMany({
    where: { visibility: "public" },
    include: { category: true },
  });

  const grid = new Map<string, { lat: number; lng: number; incidents: IncidentForScore[] }>();

  for (const inc of incidents) {
    const key = `${inc.latitude.toFixed(2)},${inc.longitude.toFixed(2)}`;
    const cell = grid.get(key) ?? { lat: inc.latitude, lng: inc.longitude, incidents: [] };
    cell.incidents.push(inc);
    grid.set(key, cell);
  }

  const rankings = Array.from(grid.values()).map((cell) => {
    const score = computeHealthScore(cell.incidents);
    return {
      latitude: cell.lat,
      longitude: cell.lng,
      name: `Area near ${cell.lat.toFixed(3)}, ${cell.lng.toFixed(3)}`,
      ...score,
    };
  });

  return rankings.sort((a, b) => b.overallScore - a.overallScore).slice(0, limit);
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
