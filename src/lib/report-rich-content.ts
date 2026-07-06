export type ReportProductId =
  | "area-insight"
  | "property-due-diligence"
  | "business-location"
  | "area-comparison"
  | "advanced-report";

export type RichReportContent = {
  sectionCount: number;
  executiveSummary: string;
  verdictBadge: { label: string; sub: string; tone: "positive" | "neutral" | "caution" };
  scoreHistory: { month: string; score: number }[];
  livabilityIndex: { label: string; emoji: string; score: number }[];
  bestStreets: { street: string; score: number; why: string }[];
  worstStreets: { street: string; score: number; why: string }[];
  amenities: { name: string; emoji: string; score: number; distance: string; note: string }[];
  seasonalRisks: { season: string; level: "high" | "medium" | "low"; detail: string }[];
  recentTimeline: { date: string; title: string; type: "issue" | "positive" | "resolved" }[];
  communityThemes: { theme: string; mentions: number; quote: string }[];
  weekdayPattern: { day: string; issues: number }[];
  decisionChecklist: { item: string; result: string; status: "pass" | "warn" | "fail" }[];
  rentalSignals: { label: string; value: string }[];
  investmentSignals: { label: string; value: string }[];
  methodology: { label: string; value: string }[];
};

const REAL_ESTATE_RICH: RichReportContent = {
  sectionCount: 22,
  executiveSummary:
    "Bandra West scores 62/100 — below Mumbai average (65) but improving month-on-month. Strong lifestyle signals (food, social life, connectivity) make it attractive for young renters. Infrastructure gaps — especially footpaths, monsoon waterlogging near Linking Road, and government-service queues — are the main risks for families and seniors. If you are renting for 1–2 years, this area works. If buying, negotiate price factoring in civic infra lag.",
  verdictBadge: {
    label: "Rent — Good",
    sub: "Buy — Only with 10–15% discount vs premium pockets",
    tone: "neutral",
  },
  scoreHistory: [
    { month: "Aug", score: 54 },
    { month: "Sep", score: 55 },
    { month: "Oct", score: 53 },
    { month: "Nov", score: 56 },
    { month: "Dec", score: 57 },
    { month: "Jan", score: 58 },
    { month: "Feb", score: 59 },
    { month: "Mar", score: 57 },
    { month: "Apr", score: 60 },
    { month: "May", score: 61 },
    { month: "Jun", score: 62 },
    { month: "Jul", score: 62 },
  ],
  livabilityIndex: [
    { label: "Walkability", emoji: "🚶", score: 74 },
    { label: "Night safety", emoji: "🌙", score: 68 },
    { label: "Public transport", emoji: "🚆", score: 81 },
    { label: "Food & daily needs", emoji: "🍽️", score: 88 },
    { label: "Green space", emoji: "🌳", score: 62 },
    { label: "Air & noise", emoji: "💨", score: 58 },
    { label: "Water & drainage", emoji: "💧", score: 52 },
    { label: "Child-friendly", emoji: "👶", score: 55 },
  ],
  bestStreets: [
    { street: "Carter Road promenade", score: 84, why: "Clean, well-lit, strong positive food signals" },
    { street: "16th Road (north block)", score: 76, why: "Recent road repair, low dispute count" },
    { street: "Hill Road (east stretch)", score: 72, why: "Active community reporting, fast resolutions" },
  ],
  worstStreets: [
    { street: "Linking Road junction", score: 41, why: "Footpath + pothole cluster, 9 confirmations" },
    { street: "RTO service lane", score: 38, why: "Queue & service-delay reports" },
    { street: "Market lane (north)", score: 44, why: "Garbage spikes, shade gaps at bus stop" },
  ],
  amenities: [
    { name: "Schools (proxy)", emoji: "🏫", score: 74, distance: "800m avg", note: "Based on nearby positive education signals" },
    { name: "Hospitals / clinics", emoji: "🏥", score: 71, distance: "1.2 km", note: "No major negative health-access reports" },
    { name: "Metro / rail", emoji: "🚇", score: 85, distance: "Bandstand 900m", note: "High connectivity score" },
    { name: "Parks & recreation", emoji: "🌳", score: 68, distance: "Multiple", note: "Improving cleanliness trend" },
    { name: "Markets & groceries", emoji: "🛒", score: 90, distance: "Walkable", note: "Strong daily-life positive density" },
    { name: "Police / safety posts", emoji: "🚔", score: 66, distance: "1.5 km", note: "Lighting upgrades reported 2026" },
  ],
  seasonalRisks: [
    { season: "Monsoon (Jun–Sep)", level: "high", detail: "3 waterlogging reports last season near Linking Rd; check ground-floor units" },
    { season: "Summer (Mar–May)", level: "medium", detail: "Heat & shade hazards at 4 bus stops; peak afternoon discomfort" },
    { season: "Festival season", level: "low", detail: "Temporary noise & waste spikes; usually resolved within 1 week" },
    { season: "Winter (Nov–Feb)", level: "low", detail: "Best period — highest resolution rate, fewest new issues" },
  ],
  recentTimeline: [
    { date: "2 Jul 2026", title: "Footpath damage confirmed by 9 residents", type: "issue" },
    { date: "28 Jun 2026", title: "Road resurfacing marked resolved", type: "resolved" },
    { date: "22 Jun 2026", title: "Trusted street food cluster re-verified", type: "positive" },
    { date: "15 Jun 2026", title: "Public toilet maintenance improved", type: "positive" },
    { date: "8 Jun 2026", title: "Queue delay at service counter flagged", type: "issue" },
    { date: "1 Jun 2026", title: "LED street lighting upgrade completed", type: "resolved" },
    { date: "25 May 2026", title: "Monsoon prep — drainage cleared (partial)", type: "resolved" },
    { date: "18 May 2026", title: "Garbage pile-up near market reported", type: "issue" },
  ],
  communityThemes: [
    { theme: "Footpaths unsafe", mentions: 14, quote: "Multiple residents cite uneven walkways near main junction" },
    { theme: "Great food scene", mentions: 19, quote: "Street food trust scores highest in west Mumbai sample" },
    { theme: "Queues at offices", mentions: 8, quote: "Government service wait times recurring theme" },
    { theme: "Getting cleaner", mentions: 11, quote: "Toilet & park improvements noted since April" },
  ],
  weekdayPattern: [
    { day: "Mon", issues: 6 },
    { day: "Tue", issues: 5 },
    { day: "Wed", issues: 7 },
    { day: "Thu", issues: 8 },
    { day: "Fri", issues: 9 },
    { day: "Sat", issues: 11 },
    { day: "Sun", issues: 10 },
  ],
  decisionChecklist: [
    { item: "Safe to walk at night?", result: "Mostly yes on main roads; caution on side lanes", status: "warn" },
    { item: "Kid-friendly footpaths?", result: "Below average — check school route", status: "fail" },
    { item: "Monsoon flood risk?", result: "Moderate — avoid ground floor near Linking Rd", status: "warn" },
    { item: "Daily needs within 10 min walk?", result: "Excellent — markets, food, transport", status: "pass" },
    { item: "Improving or declining?", result: "+8 pts over 12 months", status: "pass" },
    { item: "Community actively reports?", result: "High — 47 verified signals in radius", status: "pass" },
  ],
  rentalSignals: [
    { label: "1BHK rent pressure", value: "High demand pocket" },
    { label: "Tenant turnover proxy", value: "Moderate" },
    { label: "Landlord dispute signals", value: "Low (2 reports)" },
    { label: "Best value streets", value: "16th Rd, Carter Rd adj." },
    { label: "Streets to avoid", value: "Linking junction, RTO lane" },
  ],
  investmentSignals: [
    { label: "5-yr score change", value: "+6 points" },
    { label: "Infra catch-up needed", value: "Footpaths, drainage" },
    { label: "Lifestyle premium", value: "Above city avg." },
    { label: "Price negotiation lever", value: "Civic infra gap" },
    { label: "Hold horizon", value: "3+ yrs if infra improves" },
  ],
  methodology: [
    { label: "Data sources", value: "47 verified community reports" },
    { label: "Radius analysed", value: "1,200 metres" },
    { label: "Time window", value: "12 months + 30-day pulse" },
    { label: "Confirmation threshold", value: "3+ for seed, 10+ for verified" },
    { label: "AI layer", value: "Aggregation only — no individual accusations" },
    { label: "Last updated", value: "Live at generation" },
  ],
};

const BUSINESS_RICH: RichReportContent = {
  ...REAL_ESTATE_RICH,
  sectionCount: 20,
  executiveSummary:
    "Bandra West shows strong commercial footfall potential (78/100 proxy) with evening and weekend peaks. F&B and experience retail fit best. Parking stress and frontage cleanliness add operating cost. Avoid late-night solo retail on side streets.",
  verdictBadge: { label: "Open F&B / café", sub: "Avoid warehouse or low-footfall retail", tone: "positive" },
};

const INSURANCE_RICH: RichReportContent = {
  ...REAL_ESTATE_RICH,
  sectionCount: 18,
  executiveSummary:
    "Composite property risk 58/100. Seasonal waterlogging elevates ground-floor exposure. No fire or crime clusters in 90 days. Stable claims trend — price premiums for monsoon months.",
  verdictBadge: { label: "Moderate risk", sub: "Seasonal flood loading recommended", tone: "caution" },
};

function trimRichForGeneric(rich: RichReportContent): RichReportContent {
  return {
    ...rich,
    sectionCount: 14,
    bestStreets: rich.bestStreets.slice(0, 2),
    worstStreets: rich.worstStreets.slice(0, 2),
    recentTimeline: rich.recentTimeline.slice(0, 5),
  };
}

export function getRichReportContent(productId: ReportProductId, isBig: boolean): RichReportContent | null {
  if (!isBig) return null;

  switch (productId) {
    case "property-due-diligence":
      return REAL_ESTATE_RICH;
    case "business-location":
      return BUSINESS_RICH;
    case "advanced-report":
      return trimRichForGeneric(REAL_ESTATE_RICH);
    default:
      return null;
  }
}
