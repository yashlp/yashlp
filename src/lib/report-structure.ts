export type AnalysisBlock = {
  title: string;
  emoji: string;
  metrics: { label: string; score: number; trend?: "up" | "down" | "stable" }[];
  strengths: string[];
  weaknesses: string[];
  trendNote: string;
};

export type TrendWindow = {
  window: "30 days" | "90 days" | "1 year";
  direction: "improving" | "declining" | "stable";
  summary: string;
};

export type VisitorBrief = {
  nightSafety: string;
  publicTransport: string;
  foodHygiene: string;
  streetsToAvoid: string[];
  bestVisitingHours: string;
  emergencyNote: string;
};

export type RadiusRing = {
  radius: string;
  schools: string;
  hospitals: string;
  transport: string;
  parks: string;
  majorIssues: string;
  positives: string;
};

export type PropertyLens = {
  radiusRings: RadiusRing[];
  risks: { label: string; value: string; level: "high" | "medium" | "low" }[];
  timeline: { period: string; event: string }[];
  buyRecommendation: {
    recommend: boolean;
    headline: string;
    pros: string[];
    cons: string[];
    riskLevel: string;
    futureOutlook: string;
  };
};

export type BusinessLens = {
  accessibility: { label: string; score: number }[];
  cleanliness: { label: string; score: number }[];
  infrastructure: { label: string; score: number }[];
  customerEnv: { label: string; score: number }[];
  nearbyRisks: string[];
  engagement: string;
  suitability: { type: string; score: number; fit: "excellent" | "good" | "mixed" | "poor" }[];
  overallBusinessScore: number;
};

export type AdvancedPreset = "family" | "business" | "safety";

export const ADVANCED_PRESETS: { id: AdvancedPreset; label: string; emoji: string; description: string }[] = [
  { id: "family", label: "Family focus", emoji: "👨‍👩‍👧", description: "Schools, safety, footpaths, parks, child-friendly signals" },
  { id: "business", label: "Business focus", emoji: "🏪", description: "Footfall, parking, cleanliness, commercial viability" },
  { id: "safety", label: "Safety focus", emoji: "🛡️", description: "Lighting, night safety, fire, buildings, stray dogs" },
];

export const AI_NINE_QUESTIONS = [
  "What is happening?",
  "Why is it happening?",
  "Is it improving?",
  "How serious is it?",
  "Should I worry?",
  "What are the biggest strengths?",
  "What are the biggest weaknesses?",
  "How does it compare with nearby areas?",
  "What changed recently?",
] as const;

export const SHARED_ANALYSIS: AnalysisBlock[] = [
  {
    title: "Infrastructure Analysis",
    emoji: "🛣️",
    metrics: [
      { label: "Roads & footpaths", score: 48, trend: "down" },
      { label: "Drainage", score: 52, trend: "stable" },
      { label: "Street lights", score: 71, trend: "up" },
      { label: "Traffic signals", score: 68, trend: "stable" },
      { label: "Electricity reliability", score: 74, trend: "up" },
      { label: "Water supply", score: 61, trend: "stable" },
    ],
    strengths: ["Main roads recently resurfaced", "LED lighting upgrades on Hill Road"],
    weaknesses: ["Footpath damage cluster at Linking Road junction (9 confirmations)", "Patch-work uneven on side streets"],
    trendNote: "Infrastructure improving slowly — lighting and roads up; footpaths lag behind.",
  },
  {
    title: "Safety Analysis",
    emoji: "🛡️",
    metrics: [
      { label: "Night lighting", score: 71, trend: "up" },
      { label: "Unsafe / unlit areas", score: 58, trend: "stable" },
      { label: "Fire safety", score: 76, trend: "up" },
      { label: "Building safety", score: 69, trend: "stable" },
      { label: "Stray dogs", score: 72, trend: "up" },
    ],
    strengths: ["Carter Road promenade well-lit with high evening activity", "No fire-safety clusters in 90 days"],
    weaknesses: ["Residential lanes west report shade/lighting gaps", "Caution on uneven footpaths after dark"],
    trendNote: "Safe during the day on main roads; use caution on side lanes at night.",
  },
  {
    title: "Hygiene Analysis",
    emoji: "🧹",
    metrics: [
      { label: "Garbage & waste", score: 55, trend: "stable" },
      { label: "Sewage & drainage", score: 52, trend: "down" },
      { label: "Water contamination", score: 78, trend: "up" },
      { label: "Restaurant hygiene", score: 74, trend: "up" },
      { label: "Street vendors", score: 82, trend: "up" },
    ],
    strengths: ["Trusted street food cluster on Carter Road (12 confirmations)", "Public toilet maintenance improving"],
    weaknesses: ["Market lane north sees periodic garbage spikes", "Monsoon drainage stress near Linking Road"],
    trendNote: "Food hygiene strong; waste collection inconsistent in market lanes.",
  },
  {
    title: "Community Analysis",
    emoji: "🤝",
    metrics: [
      { label: "Festivals & events", score: 85, trend: "up" },
      { label: "Volunteer activity", score: 72, trend: "up" },
      { label: "Blood donation / health camps", score: 68, trend: "stable" },
      { label: "Education programs", score: 64, trend: "stable" },
      { label: "Engagement score", score: 88, trend: "up" },
    ],
    strengths: ["High community reporting — 47 verified signals", "Active volunteer cleanups reported monthly"],
    weaknesses: ["Government service queue complaints persist at RTO lane"],
    trendNote: "Engaged, active community — one of the area's strongest signals.",
  },
];

export const SHARED_TREND_WINDOWS: TrendWindow[] = [
  { window: "30 days", direction: "improving", summary: "+4 net positive signals; footpath issue stable, not worsening." },
  { window: "90 days", direction: "improving", summary: "+8 score points; more resolutions than new high-severity issues." },
  { window: "1 year", direction: "improving", summary: "+6 pts YoY; lighting and food hygiene drove most gains." },
];

export const VISITOR_BRIEF: VisitorBrief = {
  nightSafety: "Main roads and Carter Road promenade are fine until ~11pm. Avoid unlit side lanes near Linking junction after dark.",
  publicTransport: "Bandstand station ~900m; buses frequent on Hill Road. Auto availability good evenings.",
  foodHygiene: "Carter Road food cluster has strong trust scores — stick to high-confirmation stalls.",
  streetsToAvoid: ["Linking Road junction footpath (uneven)", "RTO service lane at peak queue hours"],
  bestVisitingHours: "Weekday mornings 8–11am or evenings 5–9pm for best walkability and lighting.",
  emergencyNote: "Hospitals/clinics within ~1.2 km proxy; no major health-access gaps reported.",
};

export const PROPERTY_LENS: PropertyLens = {
  radiusRings: [
    {
      radius: "250m",
      schools: "2 within walk (proxy)",
      hospitals: "1 clinic",
      transport: "Bus stop 120m",
      parks: "Small green patch",
      majorIssues: "1 footpath report",
      positives: "Quiet residential lane",
    },
    {
      radius: "500m",
      schools: "4 (proxy scores 74)",
      hospitals: "2 clinics, 1 diagnostic",
      transport: "Metro access 700m",
      parks: "Carter Road edge",
      majorIssues: "Linking junction cluster",
      positives: "Food & market walkable",
    },
    {
      radius: "1km",
      schools: "8+ (proxy)",
      hospitals: "Multi-specialty 1.2km",
      transport: "Bandstand station 900m",
      parks: "3 parks, promenade",
      majorIssues: "2 flood-risk zones (seasonal)",
      positives: "Strong lifestyle amenities",
    },
  ],
  risks: [
    { label: "Flood / waterlogging", value: "Moderate — 3 monsoon reports", level: "medium" },
    { label: "Garbage recurrence", value: "Market lane — weekly spikes", level: "medium" },
    { label: "Road repair frequency", value: "Improving — 2 resolved this quarter", level: "low" },
    { label: "Safety issues", value: "Footpath-led, not crime-led", level: "low" },
  ],
  timeline: [
    { period: "2024", event: "Score 54 — footpath complaints peak" },
    { period: "2025 H1", event: "Lighting upgrades; score 58" },
    { period: "2025 H2", event: "Road resurfacing; food trust rises" },
    { period: "Today", event: "Score 62 — improving trend continues" },
  ],
  buyRecommendation: {
    recommend: true,
    headline: "Buy with caution — negotiate on infra gap",
    pros: ["Lifestyle & connectivity premium", "Improving 12-month trend", "Strong rental demand proxy"],
    cons: ["Footpath safety on school routes", "Monsoon waterlogging near Linking Rd", "Below city avg. on roads"],
    riskLevel: "Moderate",
    futureOutlook: "Improving — community engagement high; expect gradual infra catch-up over 2–3 years.",
  },
};

export const BUSINESS_LENS: BusinessLens = {
  accessibility: [
    { label: "Road access", score: 72 },
    { label: "Parking", score: 42 },
    { label: "Public transport", score: 81 },
    { label: "Walk-in footfall proxy", score: 78 },
  ],
  cleanliness: [
    { label: "Street cleanliness", score: 55 },
    { label: "Drainage", score: 52 },
    { label: "Vendor hygiene", score: 82 },
  ],
  infrastructure: [
    { label: "Electricity", score: 74 },
    { label: "Internet / network", score: 68 },
    { label: "Street lighting", score: 71 },
  ],
  customerEnv: [
    { label: "Safety perception", score: 71 },
    { label: "Community activity", score: 88 },
    { label: "Positive events", score: 85 },
  ],
  nearbyRisks: ["Waterlogging monsoon — check ground floor", "Parking stress on Hill Road peak hours", "Occasional construction noise"],
  engagement: "High — 47 verified signals; active evening street life Thu–Sun.",
  suitability: [
    { type: "Restaurant / café", score: 88, fit: "excellent" },
    { type: "Salon / beauty", score: 76, fit: "good" },
    { type: "Medical store", score: 72, fit: "good" },
    { type: "Retail / boutique", score: 70, fit: "good" },
    { type: "Office / co-working", score: 58, fit: "mixed" },
    { type: "Warehouse", score: 28, fit: "poor" },
  ],
  overallBusinessScore: 78,
};

export function aiAnswersFor(productId: string): { question: string; answer: string }[] {
  const base: { question: string; answer: string }[] = [
    {
      question: AI_NINE_QUESTIONS[0],
      answer: "Active community reports footpath damage, queue delays, and strong food-scene positives. Infrastructure friction persists but resolutions are picking up.",
    },
    {
      question: AI_NINE_QUESTIONS[1],
      answer: "High foot traffic and aging civic infra create wear. Monsoon stresses drainage. Strong resident engagement drives faster fixes on visible issues.",
    },
    {
      question: AI_NINE_QUESTIONS[2],
      answer: "Yes — score up +6 over 12 months. More positive signals (toilets, roads, food) than new high-severity issues in the last 90 days.",
    },
    {
      question: AI_NINE_QUESTIONS[3],
      answer: "Moderate for daily life. Footpaths are the main serious friction; not a high crime or health emergency profile.",
    },
    {
      question: AI_NINE_QUESTIONS[4],
      answer: "Worry about monsoon flooding if ground floor near Linking Rd. Otherwise routine urban caution — not alarm-level.",
    },
    {
      question: AI_NINE_QUESTIONS[5],
      answer: "Street food trust, community engagement, connectivity, and improving lighting.",
    },
    {
      question: AI_NINE_QUESTIONS[6],
      answer: "Footpaths, government queues, and seasonal waterlogging.",
    },
    {
      question: AI_NINE_QUESTIONS[7],
      answer: "Slightly below Mumbai average (62 vs 65). Better than Khar West (58); behind Juhu (71) on cleanliness.",
    },
    {
      question: AI_NINE_QUESTIONS[8],
      answer: "Road resurfacing completed; LED upgrades; new hygiene-rated food cluster; footpath damage still open with 9 confirmations.",
    },
  ];

  if (productId === "property-due-diligence") {
    base[4].answer = "Worry if buying ground floor near Linking Rd without flood mitigation. Factor 10–15% negotiation for infra gap.";
    base[7].answer = "Juhu scores higher on cleanliness; this area wins on connectivity and food scene for the price point.";
  }
  if (productId === "business-location") {
    base[0].answer = "High evening footfall, parking stress, and strong F&B signals. Cleanliness mixed — frontage maintenance cost likely.";
    base[4].answer = "Low worry for F&B/café concepts; avoid warehouse or logistics — poor fit.";
  }

  return base;
}

export function executiveSummaryFor(productId: string): string {
  switch (productId) {
    case "property-due-diligence":
      return "Bandra West scores 62/100 with a clear improving trend. Lifestyle and connectivity are strengths; infrastructure — especially footpaths and monsoon drainage — is the main buyer risk. Suitable for buyers who value location premium and can negotiate on civic gaps.";
    case "business-location":
      return "Strong commercial pocket for F&B and experience retail. Evening footfall proxy 78/100. Parking and street cleanliness add operating cost — not ideal for warehouse or low-traffic retail.";
    case "advanced-report":
      return "Focused deep-dive built from your preset selection, using 47 verified community signals within the chosen radius and time window.";
    default:
      return "Bandra West scores 62/100 — below Mumbai average but improving month-on-month. Good for young renters and visitors; families should check footpaths. Watch drainage during monsoon near Linking Road.";
  }
}

export function verdictForProduct(productId: string): {
  aiVerdict: string;
  aiVerdictTone: "positive" | "neutral" | "caution";
  badges: { type: "positive" | "caution"; text: string }[];
} {
  switch (productId) {
    case "property-due-diligence":
      return {
        aiVerdict:
          "AI recommends proceeding with due diligence — not a avoid. Negotiate price for footpath and monsoon risks. Strong for lifestyle buyers; families should walk school routes at night before committing.",
        aiVerdictTone: "neutral",
        badges: [
          { type: "positive", text: "Good residential area — improving trend" },
          { type: "caution", text: "Watch drainage during monsoon near Linking Rd" },
        ],
      };
    case "business-location":
      return {
        aiVerdict:
          "Open F&B, café, or salon here — excellent fit. Retail viable with parking plan. Skip warehouse, office-heavy, or logistics — footfall pattern doesn't support it.",
        aiVerdictTone: "positive",
        badges: [
          { type: "positive", text: "Best for restaurant, café, salon" },
          { type: "caution", text: "Budget for parking & frontage cleanliness" },
        ],
      };
    case "advanced-report":
      return {
        aiVerdict: "Custom lens applied to verified community data. Interpret alongside on-ground visits — AI estimates trends, not guarantees.",
        aiVerdictTone: "neutral",
        badges: [{ type: "positive", text: "Preset analysis complete" }],
      };
    default:
      return {
        aiVerdict:
          "Good area for daily life with improving signals. Strengths: food scene, community, connectivity. Weaknesses: footpaths, queues, seasonal waterlogging. Fine for most renters; check walkways if you have mobility needs.",
        aiVerdictTone: "neutral",
        badges: [
          { type: "positive", text: "Good residential area" },
          { type: "caution", text: "Watch drainage during monsoon" },
        ],
      };
  }
}
