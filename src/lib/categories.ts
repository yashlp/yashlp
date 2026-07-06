export type PhotoRule = "required" | "optional" | "allowed";

export type CategoryDefinition = {
  slug: string;
  name: string;
  emoji: string;
  type: "issue" | "positive";
  group: string;
  photoRule: PhotoRule;
  description: string;
  /** Pins auto-expire after N days (daily-use categories). Omit = permanent. */
  ttlDays?: number;
};

export const MAX_PHOTOS_PER_REPORT = 2;

/** 39 civic issue categories — exact CivicLens taxonomy */
export const ISSUE_CATEGORIES: CategoryDefinition[] = [
  // Roads & Transportation (5)
  { slug: "potholes-bad-roads", name: "Potholes & Bad Roads", emoji: "🕳️", type: "issue", group: "Roads & Transportation", photoRule: "required", description: "Damaged road surface, potholes, or poor road condition" },
  { slug: "illegal-parking", name: "Illegal Parking", emoji: "🚗", type: "issue", group: "Roads & Transportation", photoRule: "required", description: "Vehicle parked illegally or blocking access" },
  { slug: "damaged-traffic-signals", name: "Damaged Traffic Signals", emoji: "🚦", type: "issue", group: "Roads & Transportation", photoRule: "required", description: "Broken or malfunctioning traffic signals" },
  { slug: "no-street-lights", name: "No Street Lights", emoji: "💡", type: "issue", group: "Roads & Transportation", photoRule: "required", description: "Missing or non-functioning street lighting" },
  { slug: "missing-speed-breakers", name: "Missing Speed Breakers", emoji: "🚧", type: "issue", group: "Roads & Transportation", photoRule: "optional", description: "Area needs speed breakers or traffic calming" },

  // Water & Sanitation (5)
  { slug: "water-logging-flooding", name: "Water Logging / Flooding", emoji: "💧", type: "issue", group: "Water & Sanitation", photoRule: "required", description: "Standing water or flooding on roads or public areas" },
  { slug: "open-sewage", name: "Open Sewage", emoji: "🚫", type: "issue", group: "Water & Sanitation", photoRule: "required", description: "Open sewage or wastewater in public areas" },
  { slug: "water-scarcity", name: "Water Scarcity", emoji: "🏜️", type: "issue", group: "Water & Sanitation", photoRule: "allowed", description: "Lack of water supply in the area" },
  { slug: "contaminated-water", name: "Contaminated Water", emoji: "☠️", type: "issue", group: "Water & Sanitation", photoRule: "required", description: "Unsafe or contaminated water supply" },
  { slug: "broken-drainage", name: "Broken Drainage", emoji: "🌊", type: "issue", group: "Water & Sanitation", photoRule: "required", description: "Blocked or broken drainage system" },

  // Electricity & Power (4)
  { slug: "power-outages", name: "Power Outages", emoji: "⚡", type: "issue", group: "Electricity & Power", photoRule: "optional", description: "Frequent or prolonged electricity outages" },
  { slug: "unsafe-wiring", name: "Unsafe Wiring", emoji: "⚠️", type: "issue", group: "Electricity & Power", photoRule: "required", description: "Exposed or dangerous electrical wiring" },
  { slug: "high-electricity-bills", name: "High Electricity Bills", emoji: "💰", type: "issue", group: "Electricity & Power", photoRule: "allowed", description: "Service complaint about excessive electricity charges" },
  { slug: "broken-street-lights-power", name: "Broken Street Lights (Power)", emoji: "💡", type: "issue", group: "Electricity & Power", photoRule: "optional", description: "Street lights not working due to power issues" },

  // Garbage & Waste (3)
  { slug: "garbage-pile-up", name: "Garbage Pile Up", emoji: "🗑️", type: "issue", group: "Garbage & Waste", photoRule: "required", description: "Accumulated garbage not being collected" },
  { slug: "illegal-dumping", name: "Illegal Dumping", emoji: "☠️", type: "issue", group: "Garbage & Waste", photoRule: "required", description: "Unauthorized waste dumping in public areas" },
  { slug: "plastic-litter", name: "Plastic Litter", emoji: "🥤", type: "issue", group: "Garbage & Waste", photoRule: "optional", description: "Plastic waste littering streets or public spaces" },

  // Corruption & Governance (3)
  { slug: "corruption-bribery", name: "Corruption / Bribery", emoji: "🐵", type: "issue", group: "Corruption & Governance", photoRule: "allowed", description: "Report corruption or bribery (text + location, no photo required)" },
  { slug: "encroachments", name: "Encroachments", emoji: "🚫", type: "issue", group: "Corruption & Governance", photoRule: "allowed", description: "Illegal occupation of public land or sidewalks" },
  { slug: "non-functional-public-services", name: "Non-Functional Public Services", emoji: "❌", type: "issue", group: "Corruption & Governance", photoRule: "optional", description: "Government or public services not functioning" },

  // Health & Sanitation (4)
  { slug: "unhygienic-restaurant", name: "Unhygienic Food / Restaurant", emoji: "🍽️", type: "issue", group: "Health & Sanitation", photoRule: "required", description: "Unsanitary conditions at a restaurant or food establishment" },
  { slug: "unhygienic-street-vendor", name: "Unhygienic Street Vendor", emoji: "🍢", type: "issue", group: "Health & Sanitation", photoRule: "required", description: "Unsanitary street food vendor conditions" },
  { slug: "hospital-facility-issues", name: "Hospital Facility Issues", emoji: "🏥", type: "issue", group: "Health & Sanitation", photoRule: "required", description: "Poor conditions at hospitals or clinics" },
  { slug: "pest-infestation", name: "Pest Infestation", emoji: "🐀", type: "issue", group: "Health & Sanitation", photoRule: "required", description: "Rodents, insects, or pest problems in public areas" },

  // Pollution & Environment (3)
  { slug: "air-pollution-smog", name: "Air Pollution / Smog", emoji: "💨", type: "issue", group: "Pollution & Environment", photoRule: "optional", description: "Poor air quality or visible smog" },
  { slug: "industrial-pollution", name: "Industrial Pollution", emoji: "🏭", type: "issue", group: "Pollution & Environment", photoRule: "optional", description: "Pollution from industrial sources" },
  { slug: "environmental-damage", name: "Environmental Damage", emoji: "🌳", type: "issue", group: "Pollution & Environment", photoRule: "optional", description: "Deforestation, land damage, or environmental harm" },

  // Women's Safety (2)
  { slug: "unsafe-unlit-areas", name: "Unsafe / Unlit Areas", emoji: "🌙", type: "issue", group: "Women's Safety", photoRule: "optional", description: "Poorly lit or unsafe areas especially at night" },
  { slug: "harassment-points", name: "Harassment Points", emoji: "⚠️", type: "issue", group: "Women's Safety", photoRule: "optional", description: "Locations known for harassment or safety concerns" },

  // Animal Welfare (2)
  { slug: "stray-dog-packs", name: "Stray Dog Packs", emoji: "🐕", type: "issue", group: "Animal Welfare", photoRule: "required", description: "Aggressive or dangerous stray dog packs" },
  { slug: "animal-cruelty", name: "Animal Cruelty", emoji: "🚫", type: "issue", group: "Animal Welfare", photoRule: "required", description: "Animal abuse or cruelty in public" },

  // Building & Infrastructure (2)
  { slug: "unsafe-buildings", name: "Unsafe Buildings", emoji: "🏢", type: "issue", group: "Building & Infrastructure", photoRule: "required", description: "Structurally unsafe or dilapidated buildings" },
  { slug: "fire-safety-issues", name: "Fire Safety Issues", emoji: "🔥", type: "issue", group: "Building & Infrastructure", photoRule: "required", description: "Fire hazards or missing safety measures" },

  // Digital Infrastructure (1)
  { slug: "poor-internet-network", name: "Poor Internet / Network Issues", emoji: "📡", type: "issue", group: "Digital Infrastructure", photoRule: "allowed", description: "Poor mobile or internet connectivity in the area" },

  // Transportation Services (2)
  { slug: "bad-bus-auto-service", name: "Bad Bus / Auto Service", emoji: "🚌", type: "issue", group: "Transportation Services", photoRule: "optional", description: "Poor public transport or auto-rickshaw service" },
  { slug: "overcharging-auto-taxi", name: "Overcharging by Auto / Taxi", emoji: "💰", type: "issue", group: "Transportation Services", photoRule: "allowed", description: "Drivers overcharging passengers" },

  // Education (1)
  { slug: "poor-school-infrastructure", name: "Poor School Infrastructure", emoji: "🏫", type: "issue", group: "Education", photoRule: "optional", description: "Dilapidated or inadequate school facilities" },

  // Social Issues (2)
  { slug: "child-labor-exploitation", name: "Child Labor / Exploitation", emoji: "🚫", type: "issue", group: "Social Issues", photoRule: "optional", description: "Child labor or exploitation observed in the area" },
  { slug: "substance-abuse-hotspots", name: "Substance Abuse Hotspots", emoji: "⚠️", type: "issue", group: "Social Issues", photoRule: "optional", description: "Areas with visible substance abuse activity" },

  // Daily Life (30-day pins — high-frequency daily use)
  { slug: "broken-footpath-sidewalk", name: "Broken Footpath / Sidewalk", emoji: "🚶", type: "issue", group: "Daily Life", photoRule: "optional", description: "Cracked, uneven, or blocked walking path", ttlDays: 30 },
  { slug: "broken-public-toilet", name: "Broken Public Toilet", emoji: "🚻", type: "issue", group: "Daily Life", photoRule: "required", description: "Unusable or unsanitary public restroom", ttlDays: 30 },
  { slug: "long-queue-government-office", name: "Long Queue at Government Office", emoji: "⏳", type: "issue", group: "Daily Life", photoRule: "optional", description: "Excessive wait times at a government office or service center", ttlDays: 30 },
  { slug: "no-shade-heat-hazard", name: "No Shade / Heat Hazard", emoji: "🌡️", type: "issue", group: "Daily Life", photoRule: "optional", description: "No tree cover or shade in hot public areas", ttlDays: 30 },
];

/** 17 positive community signals */
export const POSITIVE_CATEGORIES: CategoryDefinition[] = [
  // Infrastructure Improvements (7)
  { slug: "road-repaired", name: "Road Repaired", emoji: "🛣️", type: "positive", group: "Infrastructure Improvements", photoRule: "optional", description: "Road has been repaired or resurfaced" },
  { slug: "street-lights-fixed", name: "Street Lights Fixed", emoji: "💡", type: "positive", group: "Infrastructure Improvements", photoRule: "optional", description: "Street lighting restored or installed" },
  { slug: "clean-water-restored", name: "Clean Water Restored", emoji: "🚰", type: "positive", group: "Infrastructure Improvements", photoRule: "optional", description: "Clean water supply restored to the area" },
  { slug: "drainage-fixed", name: "Drainage Fixed", emoji: "🌊", type: "positive", group: "Infrastructure Improvements", photoRule: "optional", description: "Drainage system repaired and working" },
  { slug: "clean-area-maintained", name: "Clean Area Maintained", emoji: "🗑️", type: "positive", group: "Infrastructure Improvements", photoRule: "optional", description: "Area is being kept clean and maintained" },
  { slug: "building-safety-improved", name: "Building Safety Improved", emoji: "🏢", type: "positive", group: "Infrastructure Improvements", photoRule: "optional", description: "Building safety has been improved" },
  { slug: "traffic-system-improved", name: "Traffic System Improved", emoji: "🚦", type: "positive", group: "Infrastructure Improvements", photoRule: "optional", description: "Traffic signals or flow improved" },

  // Community & Social Positives (5)
  { slug: "local-festival", name: "Local Festival", emoji: "🎉", type: "positive", group: "Community & Social", photoRule: "optional", description: "Community festival or cultural event" },
  { slug: "blood-donation-camp", name: "Blood Donation Camp", emoji: "🩸", type: "positive", group: "Community & Social", photoRule: "optional", description: "Blood donation drive in the community" },
  { slug: "volunteer-activity", name: "Volunteer Activity", emoji: "🤝", type: "positive", group: "Community & Social", photoRule: "optional", description: "Community volunteer work or cleanup" },
  { slug: "community-education-program", name: "Community Education Program", emoji: "📚", type: "positive", group: "Community & Social", photoRule: "optional", description: "Educational program benefiting the community" },
  { slug: "community-help-hero", name: "Community Help / Hero Action", emoji: "❤️", type: "positive", group: "Community & Social", photoRule: "optional", description: "Notable act of community help or heroism" },

  // Public Good / Clean Environment (5)
  { slug: "clean-park", name: "Clean Park", emoji: "🌳", type: "positive", group: "Public Good", photoRule: "optional", description: "Well-maintained and clean park area" },
  { slug: "excellent-public-service", name: "Excellent Public Service", emoji: "⭐", type: "positive", group: "Public Good", photoRule: "optional", description: "Outstanding public service in the area" },
  { slug: "clean-street-market", name: "Clean Street / Market Area", emoji: "🧹", type: "positive", group: "Public Good", photoRule: "optional", description: "Clean and well-kept street or market" },
  { slug: "safe-drinking-water-area", name: "Safe Drinking Water Area", emoji: "🚰", type: "positive", group: "Public Good", photoRule: "optional", description: "Area with reliable safe drinking water" },
  { slug: "safe-walking-zone", name: "Safe Walking Zone", emoji: "🚶", type: "positive", group: "Public Good", photoRule: "optional", description: "Safe and walkable area for pedestrians" },

  // Daily Life positives (30-day freshness)
  { slug: "clean-public-toilet", name: "Clean Public Toilet", emoji: "✨", type: "positive", group: "Daily Life", photoRule: "optional", description: "Public restroom is clean and well-maintained", ttlDays: 30 },
  { slug: "trusted-street-food-spot", name: "Trusted Street Food Spot", emoji: "🍛", type: "positive", group: "Daily Life", photoRule: "optional", description: "Reliable, hygienic street food vendor recommended by community", ttlDays: 30 },
  { slug: "footpath-repaired", name: "Footpath Repaired", emoji: "🦶", type: "positive", group: "Daily Life", photoRule: "optional", description: "Sidewalk or footpath recently repaired", ttlDays: 30 },
];

export const ALL_CATEGORIES: CategoryDefinition[] = [
  ...ISSUE_CATEGORIES,
  ...POSITIVE_CATEGORIES,
];

export const DAILY_LIFE_TTL_DAYS = 30;

/** Slugs that expire after 30 days — kept in sync with category ttlDays */
export function getCategoryTtlDays(cat: CategoryDefinition): number | null {
  return cat.ttlDays ?? null;
}

export function getIssueCategories() {
  return ISSUE_CATEGORIES;
}

export function getPositiveCategories() {
  return POSITIVE_CATEGORIES;
}

export function getCategoriesByGroup(type: "issue" | "positive") {
  const cats = type === "issue" ? ISSUE_CATEGORIES : POSITIVE_CATEGORIES;
  const groups = new Map<string, CategoryDefinition[]>();
  for (const cat of cats) {
    const list = groups.get(cat.group) ?? [];
    list.push(cat);
    groups.set(cat.group, list);
  }
  return groups;
}

export function isPhotoRequired(rule: PhotoRule): boolean {
  return rule === "required";
}

export function photoRuleLabel(rule: PhotoRule): string {
  if (rule === "required") return "Photo required";
  if (rule === "optional") return "Photo optional";
  return "Photo not required";
}

/** Paid intelligence report products — consumer catalog */
export const PAID_REPORTS = [
  {
    id: "area-insight",
    name: "Area Insight Report",
    emoji: "📊",
    audience: "Renters, families, anyone asking “Is this area good?”",
    customerQuestion: "Is this area good?",
    features: [
      "Executive summary + CivicLens Score",
      "Infrastructure, safety, hygiene & community analysis",
      "30 / 90 / 365-day trend analysis",
      "Visitor & travel brief (included)",
      "AI verdict — strengths, weaknesses, what to watch",
    ],
  },
  {
    id: "property-due-diligence",
    name: "Property Due Diligence Report",
    emoji: "🏠",
    audience: "Home buyers & investors",
    customerQuestion: "Should I buy this house?",
    features: [
      "Everything in Area Insight",
      "Radius analysis: 250m · 500m · 1km",
      "Schools, hospitals, transport & parks (proximity proxy)",
      "Flood, waterlogging & safety risk timeline",
      "AI buy recommendation + future outlook (estimate)",
    ],
  },
  {
    id: "business-location",
    name: "Business Location Report",
    emoji: "🏢",
    audience: "Shops, cafés, salons, franchises",
    customerQuestion: "Should I open my business here?",
    features: [
      "Accessibility, parking & transport",
      "Cleanliness & customer environment",
      "Nearby risks (waterlogging, traffic, construction)",
      "Community engagement score",
      "AI suitability by business type + overall score",
    ],
  },
  {
    id: "area-comparison",
    name: "Area Comparison Report",
    emoji: "⚖️",
    audience: "Anyone shortlisting two neighbourhoods",
    customerQuestion: "Which area is better?",
    features: [
      "Side-by-side: Area A vs Area B",
      "Infrastructure, safety, cleanliness, community, transport",
      "Overall score comparison",
      "AI winner + reasons",
      "Best for families, students, business, seniors",
    ],
  },
  {
    id: "advanced-report",
    name: "Advanced Area Report",
    emoji: "⚙️",
    audience: "Power users who want a focused deep-dive",
    customerQuestion: "Build me a custom analysis",
    features: [
      "Choose preset: Family · Business · Safety focus",
      "Pick area, radius & time window",
      "Full core analysis + preset-specific AI lens",
      "Custom PDF export",
      "Same depth as premium reports",
    ],
  },
] as const;

export const FREE_FEATURES = [
  "Map & worldwide place search",
  "Reporting & confirming incidents",
  "Photo upload (max 2 per report)",
  "Viewing pins & timelines",
  "Basic Community Health Score",
  "Comments & disputes",
  "Ask AI (limited queries)",
];
