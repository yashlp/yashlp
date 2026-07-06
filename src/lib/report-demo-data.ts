import { PAID_REPORTS } from "./categories";

export type ReportProductId = (typeof PAID_REPORTS)[number]["id"];

export const REPORT_DEMO_PRICES: Record<ReportProductId, { inr: number; usd: number }> = {
  "area-intelligence": { inr: 399, usd: 9 },
  "real-estate": { inr: 1499, usd: 29 },
  "business-location": { inr: 1499, usd: 29 },
  "insurance-risk": { inr: 3999, usd: 79 },
  "municipal-dashboard": { inr: 25000, usd: 499 },
  "enterprise-dashboard": { inr: 50000, usd: 999 },
  "api-access": { inr: 999, usd: 19 },
};

export type DemoCategoryScore = { name: string; emoji: string; score: number; trend: "up" | "down" | "stable" };

export type DemoIssue = { emoji: string; title: string; confirmations: number; severity: "high" | "medium" | "low" };

export type DemoTrendPoint = { label: string; reported: number; resolved: number; positive: number };

export type IntelligenceReportData = {
  productId: ReportProductId;
  productName: string;
  emoji: string;
  areaName: string;
  radiusM: number;
  generatedAt: string;
  overallScore: number;
  confidence: number;
  incidentCount: number;
  trendDirection: "improving" | "declining" | "stable";
  categoryScores: DemoCategoryScore[];
  topIssues: DemoIssue[];
  topImprovements: DemoIssue[];
  trends: DemoTrendPoint[];
  engagementLevel: "high" | "medium" | "low";
  aiVerdict: string;
  aiVerdictTone: "positive" | "neutral" | "caution";
  extraSections: { title: string; items: { label: string; value: string; hint?: string }[] }[];
  disclaimer: string;
};

const DISCLAIMER =
  "This report is generated from community-submitted, crowd-verified signals. It is not a legal survey, municipal audit, or certified safety assessment. CivicLens does not confirm individual accusations or guarantee accuracy.";

const MUMBAI_DEMO: Omit<IntelligenceReportData, "productId" | "productName" | "emoji" | "extraSections" | "aiVerdict" | "aiVerdictTone"> = {
  areaName: "Bandra West, Mumbai, India",
  radiusM: 800,
  generatedAt: new Date().toISOString(),
  overallScore: 62,
  confidence: 0.78,
  incidentCount: 47,
  trendDirection: "improving",
  engagementLevel: "high",
  categoryScores: [
    { name: "Roads & Footpaths", emoji: "🛣️", score: 48, trend: "down" },
    { name: "Cleanliness", emoji: "🗑️", score: 55, trend: "stable" },
    { name: "Public Toilets", emoji: "🚻", score: 58, trend: "up" },
    { name: "Safety & Lighting", emoji: "💡", score: 71, trend: "up" },
    { name: "Government Services", emoji: "🏛️", score: 44, trend: "down" },
    { name: "Street Food & Daily Life", emoji: "🍲", score: 82, trend: "up" },
  ],
  topIssues: [
    { emoji: "🛣️", title: "Broken footpath near Linking Road junction", confirmations: 9, severity: "high" },
    { emoji: "🚻", title: "Broken public toilet — WC block 2", confirmations: 6, severity: "medium" },
    { emoji: "🏛️", title: "Long queue at government service counter", confirmations: 5, severity: "medium" },
    { emoji: "☀️", title: "No shade / heat hazard at bus stop", confirmations: 4, severity: "medium" },
    { emoji: "🛣️", title: "Pothole cluster on side street", confirmations: 4, severity: "high" },
  ],
  topImprovements: [
    { emoji: "🍲", title: "Trusted street food spot — Carter Road", confirmations: 12, severity: "low" },
    { emoji: "🚻", title: "Clean public toilet maintained", confirmations: 7, severity: "low" },
    { emoji: "🛣️", title: "Road resurfacing completed", confirmations: 8, severity: "low" },
    { emoji: "🌳", title: "Park cleanliness improved", confirmations: 6, severity: "low" },
  ],
  trends: [
    { label: "W1", reported: 8, resolved: 2, positive: 3 },
    { label: "W2", reported: 11, resolved: 3, positive: 4 },
    { label: "W3", reported: 9, resolved: 5, positive: 5 },
    { label: "W4", reported: 7, resolved: 4, positive: 6 },
  ],
  disclaimer: DISCLAIMER,
};

function extraForProduct(id: ReportProductId): IntelligenceReportData["extraSections"] {
  switch (id) {
    case "real-estate":
      return [
        {
          title: "Property & Livability Signals",
          items: [
            { label: "5-year trend", value: "+6 pts", hint: "Gradual improvement" },
            { label: "Flood / waterlogging", value: "Moderate risk", hint: "3 monsoon reports" },
            { label: "Road condition", value: "Below city avg.", hint: "Footpath issues dominate" },
            { label: "Schools & hospitals proxy", value: "72 / 100", hint: "From nearby positive signals" },
            { label: "Should you live here?", value: "Consider with caveats", hint: "Strong food & social life; infra gaps remain" },
          ],
        },
      ];
    case "business-location":
      return [
        {
          title: "Commercial Viability",
          items: [
            { label: "Footfall proxy", value: "78 / 100", hint: "High street activity" },
            { label: "Cleanliness index", value: "55 / 100" },
            { label: "Parking stress", value: "High", hint: "Dense complaints near main road" },
            { label: "Best days", value: "Thu–Sun evenings" },
            { label: "Business fit", value: "Good for F&B & retail", hint: "Avoid late-night solo retail" },
          ],
        },
      ];
    case "insurance-risk":
      return [
        {
          title: "Risk Indicators",
          items: [
            { label: "Flood probability", value: "32%", hint: "Seasonal" },
            { label: "Fire hazard proxy", value: "Low–medium" },
            { label: "Accident-prone zones", value: "2 within 1 km" },
            { label: "Property risk score", value: "58 / 100" },
            { label: "Claims trend", value: "Stable YoY" },
          ],
        },
      ];
    case "municipal-dashboard":
      return [
        {
          title: "Ward Operations Snapshot",
          items: [
            { label: "Open hotspots", value: "14 active" },
            { label: "Avg. resolution time", value: "18 days" },
            { label: "Resolution rate", value: "41%" },
            { label: "Top department", value: "Roads & sanitation" },
            { label: "Escalations", value: "3 under legal review" },
          ],
        },
      ];
    case "enterprise-dashboard":
      return [
        {
          title: "Multi-City Pulse",
          items: [
            { label: "Cities monitored", value: "6" },
            { label: "Lowest score", value: "Lagos — 54" },
            { label: "Highest score", value: "Tokyo — 81" },
            { label: "Alerts (7d)", value: "12 new hotspots" },
            { label: "Export ready", value: "CSV · JSON · API" },
          ],
        },
      ];
    case "api-access":
      return [
        {
          title: "API Sample Endpoints",
          items: [
            { label: "GET /v1/health", value: "Area health score" },
            { label: "GET /v1/incidents", value: "Verified incident feed" },
            { label: "GET /v1/trends", value: "30-day aggregates" },
            { label: "Rate limit", value: "1,000 req/day (starter)" },
            { label: "Historical export", value: "Bulk JSON / Parquet" },
          ],
        },
      ];
    default:
      return [];
  }
}

function verdictFor(id: ReportProductId): { aiVerdict: string; aiVerdictTone: IntelligenceReportData["aiVerdictTone"] } {
  switch (id) {
    case "real-estate":
      return {
        aiVerdict:
          "Bandra West shows improving daily-life signals (food, parks, toilets) but persistent infrastructure friction (footpaths, queues). Suitable for renters prioritizing connectivity and lifestyle; families should weigh footpath safety and monsoon waterlogging reports.",
        aiVerdictTone: "neutral",
      };
    case "business-location":
      return {
        aiVerdict:
          "Strong evening footfall and positive food-scene signals support F&B and experience retail. Parking and cleanliness complaints suggest higher opex for frontage maintenance. Recommended for high-traffic concepts, not warehouse or logistics.",
        aiVerdictTone: "positive",
      };
    case "insurance-risk":
      return {
        aiVerdict:
          "Moderate composite risk: seasonal waterlogging and road-quality reports elevate property exposure. No cluster of fire or crime-proxy signals in the last 90 days. Price premiums accordingly for ground-floor retail.",
        aiVerdictTone: "caution",
      };
    case "municipal-dashboard":
      return {
        aiVerdict:
          "Ward shows active community engagement with resolution lag on roads and sanitation. Prioritize footpath repairs and queue management at service counters — highest confirmation density in last 30 days.",
        aiVerdictTone: "neutral",
      };
    case "enterprise-dashboard":
      return {
        aiVerdict:
          "Portfolio view: Mumbai and Lagos drive downside risk; Sydney and Tokyo stable. Enable alerts on verified incident spikes >20% week-over-week.",
        aiVerdictTone: "neutral",
      };
    case "api-access":
      return {
        aiVerdict:
          "Starter tier suitable for prototype apps and research. Upgrade for historical backfill and sub-100m geospatial queries.",
        aiVerdictTone: "positive",
      };
    default:
      return {
        aiVerdict:
          "Area is trending improving over 30 days with high community engagement. Primary concerns are footpaths and public-service queues; strengths include street food trust signals and recent road repairs.",
        aiVerdictTone: "neutral",
      };
  }
}

export function getReportProduct(id: string) {
  return PAID_REPORTS.find((r) => r.id === id);
}

export function buildDemoReport(productId: ReportProductId): IntelligenceReportData {
  const product = getReportProduct(productId)!;
  const { aiVerdict, aiVerdictTone } = verdictFor(productId);

  return {
    productId,
    productName: product.name,
    emoji: product.emoji,
    ...MUMBAI_DEMO,
    generatedAt: new Date().toISOString(),
    extraSections: extraForProduct(productId),
    aiVerdict,
    aiVerdictTone,
  };
}

export function mergeLiveHealth(
  report: IntelligenceReportData,
  health: { overallScore: number; confidence: number; incidentCount: number }
): IntelligenceReportData {
  if (health.incidentCount === 0) return report;
  return {
    ...report,
    overallScore: health.overallScore,
    confidence: health.confidence,
    incidentCount: health.incidentCount,
  };
}
