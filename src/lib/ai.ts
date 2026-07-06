import { prisma } from "./db";
import { getAreaHealthScore } from "./health-score";

export async function askAI(
  question: string,
  latitude: number,
  longitude: number
): Promise<{ answer: string; sources: string[] }> {
  const health = await getAreaHealthScore(latitude, longitude);
  const incidents = await prisma.incident.findMany({
    where: {
      visibilityStage: "verified",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      latitude: { gte: latitude - 0.015, lte: latitude + 0.015 },
      longitude: { gte: longitude - 0.015, lte: longitude + 0.015 },
    },
    include: { category: true },
    take: 20,
    orderBy: { confidenceScore: "desc" },
  });

  const activeIssues = incidents.filter((i) => i.status === "active" && !i.isPositive);
  const resolved = incidents.filter((i) => i.status === "resolved");
  const positive = incidents.filter((i) => i.isPositive);

  const q = question.toLowerCase();
  const sources: string[] = [];

  if (q.includes("safe") || q.includes("safety")) {
    const safetyIssues = activeIssues.filter((i) =>
      ["public-safety", "unsafe-crosswalk", "streetlight-out", "fire-hazard"].includes(
        i.category.slug
      )
    );
    sources.push(`${incidents.length} verified incidents analyzed`);
    if (safetyIssues.length === 0) {
      return {
        answer: `Based on ${health.incidentCount} verified community reports near this location, no major active safety issues are currently flagged. The Community Health Score is ${health.overallScore}/100 (${health.confidence >= 0.6 ? "moderate to high" : "limited"} confidence).`,
        sources,
      };
    }
    return {
      answer: `There are ${safetyIssues.length} active safety-related incident(s) nearby, including ${safetyIssues.map((i) => i.category.name).join(", ")}. Community Health Score: ${health.overallScore}/100. Review individual pins on the map for evidence and confirmation counts.`,
      sources,
    };
  }

  if (q.includes("clean") || q.includes("trash") || q.includes("garbage")) {
    const cleanIssues = activeIssues.filter((i) =>
      ["overflowing-trash", "illegal-dumping", "missed-pickup"].includes(i.category.slug)
    );
    sources.push("Cleanliness category analysis");
    return {
      answer:
        cleanIssues.length > 0
          ? `${cleanIssues.length} active cleanliness issue(s) reported nearby. ${positive.length} positive community signals also recorded in this area.`
          : `No active trash or dumping issues reported nearby. ${positive.filter((p) => p.category.slug === "clean-street").length} "clean street" positive signals on record.`,
      sources,
    };
  }

  if (q.includes("road") || q.includes("pothole") || q.includes("infrastructure")) {
    const roadIssues = activeIssues.filter((i) =>
      ["pothole", "road-damage", "broken-sidewalk", "drainage-blocked"].includes(i.category.slug)
    );
    sources.push("Infrastructure incident data");
    return {
      answer: `${roadIssues.length} active infrastructure issue(s) near this location. ${resolved.length} incidents have been community-verified as resolved in this area, showing improvement over time.`,
      sources,
    };
  }

  if (q.includes("score") || q.includes("health")) {
    sources.push("Community Health Score engine");
    return {
      answer: `The Community Health Score for this area is **${health.overallScore}/100** with ${Math.round(health.confidence * 100)}% confidence, based on ${health.incidentCount} verified incidents. Scores factor in active issues (negative), resolved items and positive signals (positive), weighted by community confidence.`,
      sources,
    };
  }

  if (q.includes("trend") || q.includes("improving") || q.includes("worse")) {
    sources.push("Historical incident timeline");
    const improving = resolved.length > activeIssues.length;
    return {
      answer: `This area shows ${resolved.length} resolved incidents vs ${activeIssues.length} active issues. Trend appears **${improving ? "improving" : activeIssues.length > resolved.length ? "needs attention" : "stable"}** based on community-verified data.`,
      sources,
    };
  }

  sources.push(`${incidents.length} public incidents`, "Community Health Score");
  return {
    answer: `Near this location: ${activeIssues.length} active issues, ${resolved.length} resolved, ${positive.length} positive signals. Community Health Score: ${health.overallScore}/100. Ask about safety, cleanliness, roads, trends, or the health score for more detail.`,
    sources,
  };
}

export function mockAIVerify(categorySlug: string, hasPhoto = false) {
  const categoryKeywords: Record<string, string[]> = {
    pothole: ["road", "hole", "asphalt", "pavement"],
    graffiti: ["wall", "paint", "marking"],
    "overflowing-trash": ["trash", "bin", "garbage"],
  };

  const keywords = categoryKeywords[categorySlug] ?? ["street", "public"];
  const match = 0.75 + Math.random() * 0.2;
  const verified = hasPhoto ? Math.random() > 0.1 : Math.random() > 0.4;

  return {
    aiCategoryMatch: match,
    aiImageVerified: verified,
    aiNotes: verified
      ? `Image appears consistent with ${categorySlug} (${keywords.join(", ")})`
      : hasPhoto
        ? "Image could not be fully verified — flagged for community review"
        : "No photo submitted — awaiting community verification",
  };
}
