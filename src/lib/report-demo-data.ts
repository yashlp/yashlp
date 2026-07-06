import { PAID_REPORTS } from "./categories";
import { getRichReportContent, type RichReportContent } from "./report-rich-content";

export type ReportProductId = (typeof PAID_REPORTS)[number]["id"];

export type ReportTier = "small" | "big";

/** Consumer pricing — India & international */
export const REPORT_PRICING = {
  small: { inr: 29, usd: 2.9, label: "Standard Report" },
  big: { inr: 59, usd: 5.9, label: "Detailed Report" },
} as const;

/** Standard ₹29 / $2.9 — area snapshot. Detailed ₹59 / $5.9 — deeper analysis. */
export const REPORT_TIER_BY_PRODUCT: Record<ReportProductId, ReportTier> = {
  "area-intelligence": "small",
  "api-access": "small",
  "real-estate": "big",
  "business-location": "big",
  "insurance-risk": "big",
  "municipal-dashboard": "big",
  "enterprise-dashboard": "big",
};

export function getReportPrice(productId: ReportProductId) {
  const tier = REPORT_TIER_BY_PRODUCT[productId];
  return { tier, ...REPORT_PRICING[tier] };
}

/** @deprecated use getReportPrice */
export const REPORT_DEMO_PRICES = Object.fromEntries(
  (PAID_REPORTS as readonly { id: ReportProductId }[]).map((r) => {
    const p = getReportPrice(r.id);
    return [r.id, { inr: p.inr, usd: p.usd }];
  })
) as Record<ReportProductId, { inr: number; usd: number }>;

export type DemoCategoryScore = { name: string; emoji: string; score: number; trend: "up" | "down" | "stable" };

export type DemoIssue = { emoji: string; title: string; confirmations: number; severity: "high" | "medium" | "low" };

export type DemoTrendPoint = { label: string; reported: number; resolved: number; positive: number };

export type IntelligenceReportData = {
  productId: ReportProductId;
  productName: string;
  emoji: string;
  tier: ReportTier;
  priceInr: number;
  priceUsd: number;
  orderRef: string;
  areaName: string;
  areaLat: number;
  areaLng: number;
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
  plainLanguageAnswers: { question: string; answer: string }[];
  areaComparisons: { name: string; score: number; note: string }[];
  heatmapZones: { zone: string; level: "high" | "medium" | "low"; issue: string }[];
  aiVerdict: string;
  aiVerdictTone: "positive" | "neutral" | "caution";
  extraSections: { title: string; items: { label: string; value: string; hint?: string }[] }[];
  richContent: RichReportContent | null;
  disclaimer: string;
};

const DISCLAIMER =
  "This report is generated from community-submitted, crowd-verified signals. It is not a legal survey, municipal audit, or certified safety assessment. CivicLens does not confirm individual accusations or guarantee accuracy.";

const BASE_ISSUES: DemoIssue[] = [
  { emoji: "🛣️", title: "Broken footpath near Linking Road junction", confirmations: 9, severity: "high" },
  { emoji: "🚻", title: "Broken public toilet — WC block 2", confirmations: 6, severity: "medium" },
  { emoji: "🏛️", title: "Long queue at government service counter", confirmations: 5, severity: "medium" },
  { emoji: "☀️", title: "No shade / heat hazard at bus stop", confirmations: 4, severity: "medium" },
  { emoji: "🛣️", title: "Pothole cluster on side street", confirmations: 4, severity: "high" },
  { emoji: "🗑️", title: "Garbage pile-up near market lane", confirmations: 3, severity: "medium" },
  { emoji: "💡", title: "Street light out on residential lane", confirmations: 3, severity: "low" },
  { emoji: "🛣️", title: "Uneven road after patch work", confirmations: 2, severity: "low" },
];

const BASE_IMPROVEMENTS: DemoIssue[] = [
  { emoji: "🍲", title: "Trusted street food spot — Carter Road", confirmations: 12, severity: "low" },
  { emoji: "🚻", title: "Clean public toilet maintained", confirmations: 7, severity: "low" },
  { emoji: "🛣️", title: "Road resurfacing completed", confirmations: 8, severity: "low" },
  { emoji: "🌳", title: "Park cleanliness improved", confirmations: 6, severity: "low" },
  { emoji: "🍲", title: "New hygiene-rated food stall cluster", confirmations: 5, severity: "low" },
  { emoji: "💡", title: "LED lighting upgraded on main road", confirmations: 4, severity: "low" },
];

const PLAIN_LANGUAGE: IntelligenceReportData["plainLanguageAnswers"] = [
  {
    question: "Is this area safe for families?",
    answer:
      "Mostly yes for daytime activity — lighting scores are improving. Watch footpaths near Linking Road at night; several high-confirmation reports mention uneven walkways.",
  },
  {
    question: "Is it getting better or worse?",
    answer:
      "Improving over the last 30 days. More positive signals (clean toilets, road repairs) than new high-severity issues.",
  },
  {
    question: "Biggest daily-life problem?",
    answer: "Footpaths and government-service queues — both show repeated community confirmations.",
  },
  {
    question: "Best thing about this area?",
    answer: "Street food trust scores and park cleanliness are well above the city average.",
  },
];

const COMPARISONS: IntelligenceReportData["areaComparisons"] = [
  { name: "Bandra West (this area)", score: 62, note: "Your selected location" },
  { name: "Khar West", score: 58, note: "Similar footpath issues" },
  { name: "Juhu", score: 71, note: "Cleaner, fewer queue reports" },
  { name: "Mumbai city average", score: 65, note: "Benchmark" },
];

const HEATMAP: IntelligenceReportData["heatmapZones"] = [
  { zone: "Linking Road junction", level: "high", issue: "Footpath & pothole cluster" },
  { zone: "Carter Road promenade", level: "low", issue: "Strong positive food & cleanliness" },
  { zone: "RTO / service lane", level: "medium", issue: "Queue & wait-time reports" },
  { zone: "Residential lanes (west)", level: "medium", issue: "Lighting & shade gaps" },
  { zone: "Market street (north)", level: "high", issue: "Garbage & cleanliness spikes" },
];

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
            { label: "Rent vs buy signal", value: "Rent-friendly", hint: "Lifestyle strong; infra still catching up" },
          ],
        },
        {
          title: "Should you live here?",
          items: [
            { label: "Young professionals", value: "Good fit", hint: "Connectivity & social life" },
            { label: "Families with kids", value: "Mixed", hint: "Check footpaths near school routes" },
            { label: "Senior citizens", value: "Caution", hint: "Heat & walkway hazards reported" },
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
            { label: "Best categories", value: "F&B, cafés, experience retail" },
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
          title: "Your API Starter Pack Includes",
          items: [
            { label: "GET /v1/health", value: "Area health score" },
            { label: "GET /v1/incidents", value: "Verified incident feed" },
            { label: "GET /v1/trends", value: "30-day aggregates" },
            { label: "Daily quota", value: "1,000 requests" },
            { label: "Sample export", value: "JSON attached to this report" },
          ],
        },
      ];
    default:
      return [
        {
          title: "Quick Takeaways",
          items: [
            { label: "Overall vibe", value: "Improving", hint: "Trending up 30 days" },
            { label: "vs city average", value: "Slightly below", hint: "62 vs 65" },
            { label: "Data strength", value: "High", hint: "47 verified signals" },
          ],
        },
      ];
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
          "Moderate composite risk: seasonal waterlogging and road-quality reports elevate property exposure. No cluster of fire or crime-proxy signals in the last 90 days.",
        aiVerdictTone: "caution",
      };
    case "municipal-dashboard":
      return {
        aiVerdict:
          "Ward shows active community engagement with resolution lag on roads and sanitation. Prioritize footpath repairs and queue management at service counters.",
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
          "Your starter API key is ready for prototype apps. Use health + incidents endpoints for location widgets; upgrade when you need historical backfill.",
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
  const pricing = getReportPrice(productId);
  const isBig = pricing.tier === "big";
  const { aiVerdict, aiVerdictTone } = verdictFor(productId);

  return {
    productId,
    productName: product.name,
    emoji: product.emoji,
    tier: pricing.tier,
    priceInr: pricing.inr,
    priceUsd: pricing.usd,
    orderRef: `CL-${Date.now().toString(36).toUpperCase().slice(-8)}`,
    areaName: "Bandra West, Mumbai, India",
    areaLat: 19.0596,
    areaLng: 72.8295,
    radiusM: isBig ? 1200 : 800,
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
    topIssues: isBig ? BASE_ISSUES : BASE_ISSUES.slice(0, 5),
    topImprovements: isBig ? BASE_IMPROVEMENTS : BASE_IMPROVEMENTS.slice(0, 4),
    trends: isBig
      ? [
          { label: "W1", reported: 8, resolved: 2, positive: 3 },
          { label: "W2", reported: 11, resolved: 3, positive: 4 },
          { label: "W3", reported: 9, resolved: 5, positive: 5 },
          { label: "W4", reported: 7, resolved: 4, positive: 6 },
          { label: "W5", reported: 6, resolved: 5, positive: 7 },
          { label: "W6", reported: 5, resolved: 4, positive: 6 },
        ]
      : [
          { label: "W1", reported: 8, resolved: 2, positive: 3 },
          { label: "W2", reported: 11, resolved: 3, positive: 4 },
          { label: "W3", reported: 9, resolved: 5, positive: 5 },
          { label: "W4", reported: 7, resolved: 4, positive: 6 },
        ],
    plainLanguageAnswers: isBig ? PLAIN_LANGUAGE : PLAIN_LANGUAGE.slice(0, 2),
    areaComparisons: isBig ? COMPARISONS : COMPARISONS.slice(0, 2),
    heatmapZones: isBig ? HEATMAP : HEATMAP.slice(0, 3),
    extraSections: extraForProduct(productId),
    richContent: getRichReportContent(productId, isBig),
    aiVerdict,
    aiVerdictTone,
    disclaimer: DISCLAIMER,
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
