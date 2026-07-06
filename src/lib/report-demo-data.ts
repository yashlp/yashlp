import { PAID_REPORTS } from "./categories";
import {
  aiAnswersFor,
  BUSINESS_LENS,
  executiveSummaryFor,
  PROPERTY_LENS,
  SHARED_ANALYSIS,
  SHARED_TREND_WINDOWS,
  verdictForProduct,
  VISITOR_BRIEF,
  type AdvancedPreset,
} from "./report-structure";
import { getRichReportContent, type RichReportContent } from "./report-rich-content";

export type ReportProductId = (typeof PAID_REPORTS)[number]["id"];

export type ReportTier = "small" | "big";

export const REPORT_PRICING = {
  small: { inr: 29, usd: 2.9, label: "Standard Report" },
  big: { inr: 59, usd: 5.9, label: "Detailed Report" },
} as const;

export const REPORT_TIER_BY_PRODUCT: Record<ReportProductId, ReportTier> = {
  "area-insight": "small",
  "area-comparison": "small",
  "property-due-diligence": "big",
  "business-location": "big",
  "advanced-report": "big",
};

/** Map old demo URLs to new product IDs */
export const LEGACY_REPORT_IDS: Record<string, ReportProductId> = {
  "area-intelligence": "area-insight",
  "real-estate": "property-due-diligence",
  "insurance-risk": "property-due-diligence",
  "api-access": "area-insight",
  "municipal-dashboard": "area-insight",
  "enterprise-dashboard": "area-insight",
};

export function resolveReportProductId(id: string): ReportProductId | null {
  if (PAID_REPORTS.some((r) => r.id === id)) return id as ReportProductId;
  return LEGACY_REPORT_IDS[id] ?? null;
}

export function getReportProduct(id: string) {
  const resolved = resolveReportProductId(id);
  return resolved ? PAID_REPORTS.find((r) => r.id === resolved) : undefined;
}

export function getReportPrice(productId: ReportProductId) {
  const tier = REPORT_TIER_BY_PRODUCT[productId];
  return { tier, ...REPORT_PRICING[tier] };
}

export type DemoIssue = { emoji: string; title: string; confirmations: number; severity: "high" | "medium" | "low" };
export type DemoTrendPoint = { label: string; reported: number; resolved: number; positive: number };

export type IntelligenceReportData = {
  productId: ReportProductId;
  productName: string;
  emoji: string;
  customerQuestion: string;
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
  executiveSummary: string;
  engagementLevel: "high" | "medium" | "low";
  analysisBlocks: typeof SHARED_ANALYSIS;
  trendWindows: typeof SHARED_TREND_WINDOWS;
  visitorBrief: typeof VISITOR_BRIEF | null;
  aiNineQuestions: { question: string; answer: string }[];
  topIssues: DemoIssue[];
  topImprovements: DemoIssue[];
  trends: DemoTrendPoint[];
  heatmapZones: { zone: string; level: "high" | "medium" | "low"; issue: string }[];
  aiVerdict: string;
  aiVerdictTone: "positive" | "neutral" | "caution";
  verdictBadges: { type: "positive" | "caution"; text: string }[];
  propertyLens: typeof PROPERTY_LENS | null;
  businessLens: typeof BUSINESS_LENS | null;
  richContent: RichReportContent | null;
  advancedPreset: AdvancedPreset | null;
  disclaimer: string;
};

export type ComparisonDimension = {
  name: string;
  emoji: string;
  scoreA: number;
  scoreB: number;
};

export type ComparisonReportData = {
  productId: "area-comparison";
  productName: string;
  emoji: string;
  customerQuestion: string;
  tier: ReportTier;
  orderRef: string;
  generatedAt: string;
  areaA: { name: string; score: number; lat: number; lng: number };
  areaB: { name: string; score: number; lat: number; lng: number };
  dimensions: ComparisonDimension[];
  winner: "a" | "b";
  winnerName: string;
  aiReasons: string[];
  aiWeaknessesA: string[];
  aiWeaknessesB: string[];
  bestFor: { audience: string; pick: "a" | "b"; reason: string }[];
  aiSummary: string;
  disclaimer: string;
};

const DISCLAIMER =
  "This report is generated from community-submitted, crowd-verified signals. It is not a legal survey, municipal audit, or certified safety assessment. AI outlook sections are trend-based estimates, not guarantees. CivicLens does not confirm individual accusations.";

const BASE_ISSUES: DemoIssue[] = [
  { emoji: "🛣️", title: "Broken footpath near Linking Road junction", confirmations: 9, severity: "high" },
  { emoji: "🚻", title: "Broken public toilet — WC block 2", confirmations: 6, severity: "medium" },
  { emoji: "🏛️", title: "Long queue at government service counter", confirmations: 5, severity: "medium" },
  { emoji: "☀️", title: "No shade / heat hazard at bus stop", confirmations: 4, severity: "medium" },
  { emoji: "🗑️", title: "Garbage pile-up near market lane", confirmations: 3, severity: "medium" },
];

const BASE_IMPROVEMENTS: DemoIssue[] = [
  { emoji: "🍲", title: "Trusted street food spot — Carter Road", confirmations: 12, severity: "low" },
  { emoji: "🛣️", title: "Road resurfacing completed", confirmations: 8, severity: "low" },
  { emoji: "🚻", title: "Clean public toilet maintained", confirmations: 7, severity: "low" },
  { emoji: "🌳", title: "Park cleanliness improved", confirmations: 6, severity: "low" },
];

const HEATMAP = [
  { zone: "Linking Road junction", level: "high" as const, issue: "Footpath & pothole cluster" },
  { zone: "Carter Road promenade", level: "low" as const, issue: "Strong positive food & cleanliness" },
  { zone: "RTO / service lane", level: "medium" as const, issue: "Queue & wait-time reports" },
];

export function buildDemoReport(
  productId: ReportProductId,
  options?: { preset?: AdvancedPreset }
): IntelligenceReportData {
  const product = PAID_REPORTS.find((r) => r.id === productId)!;
  const pricing = getReportPrice(productId);
  const isBig = pricing.tier === "big";
  const { aiVerdict, aiVerdictTone, badges } = verdictForProduct(productId);

  return {
    productId,
    productName: product.name,
    emoji: product.emoji,
    customerQuestion: product.customerQuestion,
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
    executiveSummary: executiveSummaryFor(productId),
    engagementLevel: "high",
    analysisBlocks: SHARED_ANALYSIS,
    trendWindows: SHARED_TREND_WINDOWS,
    visitorBrief: productId === "area-insight" ? VISITOR_BRIEF : null,
    aiNineQuestions: aiAnswersFor(productId),
    topIssues: BASE_ISSUES,
    topImprovements: BASE_IMPROVEMENTS,
    trends: [
      { label: "W1", reported: 8, resolved: 2, positive: 3 },
      { label: "W2", reported: 11, resolved: 3, positive: 4 },
      { label: "W3", reported: 9, resolved: 5, positive: 5 },
      { label: "W4", reported: 7, resolved: 4, positive: 6 },
    ],
    heatmapZones: HEATMAP,
    aiVerdict,
    aiVerdictTone,
    verdictBadges: badges,
    propertyLens: productId === "property-due-diligence" ? PROPERTY_LENS : null,
    businessLens: productId === "business-location" ? BUSINESS_LENS : null,
    richContent: getRichReportContent(productId, isBig),
    advancedPreset: productId === "advanced-report" ? (options?.preset ?? "family") : null,
    disclaimer: DISCLAIMER,
  };
}

export function buildComparisonDemoReport(): ComparisonReportData {
  return {
    productId: "area-comparison",
    productName: "Area Comparison Report",
    emoji: "⚖️",
    customerQuestion: "Which area is better?",
    tier: "small",
    orderRef: `CL-${Date.now().toString(36).toUpperCase().slice(-8)}`,
    generatedAt: new Date().toISOString(),
    areaA: { name: "Bandra West", score: 62, lat: 19.0596, lng: 72.8295 },
    areaB: { name: "Khar West", score: 58, lat: 19.0717, lng: 72.8347 },
    dimensions: [
      { name: "Infrastructure", emoji: "🛣️", scoreA: 52, scoreB: 48 },
      { name: "Safety", emoji: "🛡️", scoreA: 71, scoreB: 64 },
      { name: "Cleanliness", emoji: "🧹", scoreA: 55, scoreB: 51 },
      { name: "Community", emoji: "🤝", scoreA: 88, scoreB: 72 },
      { name: "Transport", emoji: "🚆", scoreA: 81, scoreB: 76 },
      { name: "Environment", emoji: "🌳", scoreA: 62, scoreB: 59 },
      { name: "Public services", emoji: "🏛️", scoreA: 44, scoreB: 46 },
    ],
    winner: "a",
    winnerName: "Bandra West",
    aiReasons: [
      "Higher overall score (62 vs 58) with stronger improving trend",
      "Better community engagement and food-scene positives",
      "Superior connectivity and evening safety on main roads",
    ],
    aiWeaknessesA: ["Footpaths still weak at Linking junction", "Government queue reports at RTO"],
    aiWeaknessesB: ["Similar footpath issues, fewer positive resolutions", "Lower engagement — thinner data"],
    bestFor: [
      { audience: "Families", pick: "a", reason: "Better parks access and improving toilets" },
      { audience: "Students", pick: "a", reason: "Stronger transport and social life" },
      { audience: "Businesses", pick: "a", reason: "Higher footfall proxy on Hill/Carter roads" },
      { audience: "Senior citizens", pick: "b", reason: "Slightly quieter lanes, but both need footpath caution" },
    ],
    aiSummary:
      "Bandra West wins on community, transport, and trend momentum. Khar West is comparable on price-sensitive rent but lags on verified positive signals. Choose Bandra for lifestyle; Khar if budget is tight and you accept similar infra gaps.",
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
