export type CategoryDefinition = {
  slug: string;
  name: string;
  emoji: string;
  type: "issue" | "positive";
  photoRequired: boolean;
  description: string;
  pairedSlug?: string;
};

const ISSUE_CATEGORIES: Omit<CategoryDefinition, "type">[] = [
  { slug: "pothole", name: "Pothole", emoji: "🕳️", photoRequired: true, description: "Road surface hole or depression", pairedSlug: "pothole-repaired" },
  { slug: "road-damage", name: "Road Damage", emoji: "🛣️", photoRequired: true, description: "Cracks, uneven pavement, or surface deterioration", pairedSlug: "road-resurfaced" },
  { slug: "broken-sidewalk", name: "Broken Sidewalk", emoji: "🚶", photoRequired: true, description: "Cracked, lifted, or hazardous walkway", pairedSlug: "sidewalk-repaired" },
  { slug: "streetlight-out", name: "Streetlight Out", emoji: "💡", photoRequired: false, description: "Non-functioning street lighting", pairedSlug: "streetlight-fixed" },
  { slug: "traffic-signal", name: "Traffic Signal Issue", emoji: "🚦", photoRequired: true, description: "Broken or malfunctioning traffic signal", pairedSlug: "signal-working" },
  { slug: "street-flooding", name: "Street Flooding", emoji: "🌊", photoRequired: true, description: "Standing water blocking road or sidewalk", pairedSlug: "drainage-cleared" },
  { slug: "damaged-signage", name: "Damaged Signage", emoji: "🪧", photoRequired: true, description: "Missing, fallen, or unreadable signs", pairedSlug: "signage-restored" },
  { slug: "illegal-parking", name: "Illegal Parking", emoji: "🚗", photoRequired: true, description: "Vehicle blocking access or violating rules", pairedSlug: "parking-improved" },
  { slug: "abandoned-vehicle", name: "Abandoned Vehicle", emoji: "🚙", photoRequired: true, description: "Long-term unattended vehicle", pairedSlug: "vehicle-removed" },
  { slug: "graffiti", name: "Graffiti", emoji: "🎨", photoRequired: true, description: "Unauthorized markings on public property", pairedSlug: "graffiti-removed" },
  { slug: "illegal-dumping", name: "Illegal Dumping", emoji: "🗑️", photoRequired: true, description: "Unauthorized waste disposal", pairedSlug: "cleanup-completed" },
  { slug: "overflowing-trash", name: "Overflowing Trash", emoji: "🗃️", photoRequired: true, description: "Full or overflowing public bins", pairedSlug: "clean-street" },
  { slug: "missed-pickup", name: "Missed Garbage Pickup", emoji: "♻️", photoRequired: false, description: "Scheduled collection did not occur", pairedSlug: "garbage-collected" },
  { slug: "pest-infestation", name: "Pest Infestation", emoji: "🐀", photoRequired: true, description: "Rodents or pests in public areas", pairedSlug: "pest-resolved" },
  { slug: "water-leak", name: "Water Leak", emoji: "💧", photoRequired: true, description: "Leaking pipe, hydrant, or water main", pairedSlug: "water-leak-fixed" },
  { slug: "sewage-issue", name: "Sewage Issue", emoji: "🚽", photoRequired: true, description: "Sewage overflow or smell", pairedSlug: "sewage-repaired" },
  { slug: "power-outage", name: "Power Outage", emoji: "⚡", photoRequired: false, description: "Localized electrical outage", pairedSlug: "power-restored" },
  { slug: "utility-pole", name: "Damaged Utility Pole", emoji: "🏗️", photoRequired: true, description: "Leaning, broken, or hazardous pole", pairedSlug: "pole-repaired" },
  { slug: "broken-bench", name: "Broken Bench", emoji: "🪑", photoRequired: true, description: "Damaged public seating", pairedSlug: "bench-restored" },
  { slug: "playground-damage", name: "Damaged Playground", emoji: "🛝", photoRequired: true, description: "Broken or unsafe play equipment", pairedSlug: "playground-upgraded" },
  { slug: "park-maintenance", name: "Park Maintenance", emoji: "🌳", photoRequired: true, description: "Overgrown or poorly maintained park area", pairedSlug: "park-beautified" },
  { slug: "tree-hazard", name: "Tree Hazard", emoji: "🌲", photoRequired: true, description: "Fallen branch or dangerous tree", pairedSlug: "tree-maintained" },
  { slug: "noise-pollution", name: "Noise Pollution", emoji: "🔊", photoRequired: false, description: "Excessive or disruptive noise", pairedSlug: "quiet-neighborhood" },
  { slug: "air-quality", name: "Air Quality Concern", emoji: "😷", photoRequired: false, description: "Smoke, dust, or pollution affecting air", pairedSlug: "fresh-air-area" },
  { slug: "unsafe-crosswalk", name: "Unsafe Crosswalk", emoji: "🚸", photoRequired: true, description: "Faded markings or dangerous crossing", pairedSlug: "safe-crosswalk" },
  { slug: "bike-lane-blocked", name: "Bike Lane Obstruction", emoji: "🚲", photoRequired: true, description: "Blocked or unusable bike lane", pairedSlug: "clear-bike-lane" },
  { slug: "restroom-issue", name: "Public Restroom Issue", emoji: "🚻", photoRequired: true, description: "Unsanitary or broken public restroom", pairedSlug: "clean-restroom" },
  { slug: "vandalism", name: "Vandalism", emoji: "🔨", photoRequired: true, description: "Intentional damage to public property", pairedSlug: "vandalism-repaired" },
  { slug: "community-support", name: "Community Support Need", emoji: "🤝", photoRequired: false, description: "Area needing community assistance", pairedSlug: "community-supported" },
  { slug: "wildlife-hazard", name: "Wildlife Hazard", emoji: "🦝", photoRequired: true, description: "Dangerous wildlife in public space", pairedSlug: "wildlife-protected" },
  { slug: "construction-hazard", name: "Construction Hazard", emoji: "🚧", photoRequired: true, description: "Unsafe construction zone", pairedSlug: "safe-construction" },
  { slug: "snow-ice-hazard", name: "Snow/Ice Hazard", emoji: "❄️", photoRequired: true, description: "Uncleared ice or snow on walkway", pairedSlug: "clear-walkways" },
  { slug: "fire-hazard", name: "Fire Hazard", emoji: "🔥", photoRequired: true, description: "Condition posing fire risk", pairedSlug: "fire-risk-reduced" },
  { slug: "accessibility-barrier", name: "Accessibility Barrier", emoji: "♿", photoRequired: true, description: "Barrier for wheelchair or mobility access", pairedSlug: "accessibility-improved" },
  { slug: "public-safety", name: "Public Safety Concern", emoji: "🛡️", photoRequired: false, description: "General safety issue in public space", pairedSlug: "safer-neighborhood" },
  { slug: "bus-stop-issue", name: "Bus Stop Issue", emoji: "🚌", photoRequired: true, description: "Damaged or inadequate bus shelter", pairedSlug: "bus-stop-improved" },
  { slug: "road-debris", name: "Road Debris", emoji: "🪨", photoRequired: true, description: "Debris blocking roadway", pairedSlug: "road-cleared" },
  { slug: "drainage-blocked", name: "Drainage Blockage", emoji: "🕳️", photoRequired: true, description: "Blocked storm drain or gutter", pairedSlug: "drainage-working" },
  { slug: "other-infrastructure", name: "Other Infrastructure", emoji: "🏙️", photoRequired: false, description: "Other civic infrastructure issue", pairedSlug: "infrastructure-improved" },
];

const POSITIVE_NAMES: Record<string, { name: string; emoji: string; description: string }> = {
  "pothole-repaired": { name: "Pothole Repaired", emoji: "✅", description: "Road surface hole has been fixed" },
  "road-resurfaced": { name: "Road Resurfaced", emoji: "🛤️", description: "Road surface recently improved" },
  "sidewalk-repaired": { name: "Sidewalk Repaired", emoji: "🦶", description: "Walkway restored to safe condition" },
  "streetlight-fixed": { name: "Streetlight Fixed", emoji: "🌟", description: "Street lighting restored" },
  "signal-working": { name: "Signal Working", emoji: "✨", description: "Traffic signal functioning properly" },
  "drainage-cleared": { name: "Drainage Cleared", emoji: "💦", description: "Flooding or standing water resolved" },
  "signage-restored": { name: "Signage Restored", emoji: "📋", description: "Public signs repaired or replaced" },
  "parking-improved": { name: "Parking Improved", emoji: "🅿️", description: "Parking situation improved" },
  "vehicle-removed": { name: "Vehicle Removed", emoji: "✔️", description: "Abandoned vehicle cleared" },
  "graffiti-removed": { name: "Graffiti Removed", emoji: "🧽", description: "Unauthorized markings cleaned" },
  "cleanup-completed": { name: "Cleanup Completed", emoji: "🧹", description: "Illegal dumping cleaned up" },
  "clean-street": { name: "Clean Street", emoji: "✨", description: "Street is clean and well-maintained" },
  "garbage-collected": { name: "Garbage Collected", emoji: "🗑️", description: "Waste collection completed" },
  "pest-resolved": { name: "Pest Issue Resolved", emoji: "🐾", description: "Pest problem addressed" },
  "water-leak-fixed": { name: "Water Leak Fixed", emoji: "🔧", description: "Water leak repaired" },
  "sewage-repaired": { name: "Sewage Repaired", emoji: "🛠️", description: "Sewage issue resolved" },
  "power-restored": { name: "Power Restored", emoji: "💡", description: "Electrical service restored" },
  "pole-repaired": { name: "Pole Repaired", emoji: "🏗️", description: "Utility pole fixed" },
  "bench-restored": { name: "Bench Restored", emoji: "🪑", description: "Public seating repaired" },
  "playground-upgraded": { name: "Playground Upgraded", emoji: "🎠", description: "Play area improved or repaired" },
  "park-beautified": { name: "Park Beautified", emoji: "🌸", description: "Park well maintained or improved" },
  "tree-maintained": { name: "Tree Maintained", emoji: "🌿", description: "Trees safely trimmed or maintained" },
  "quiet-neighborhood": { name: "Quiet Neighborhood", emoji: "🤫", description: "Area noted for peaceful conditions" },
  "fresh-air-area": { name: "Fresh Air Area", emoji: "🌬️", description: "Good air quality reported" },
  "safe-crosswalk": { name: "Safe Crosswalk", emoji: "🚶", description: "Crosswalk in good condition" },
  "clear-bike-lane": { name: "Clear Bike Lane", emoji: "🚴", description: "Bike lane open and usable" },
  "clean-restroom": { name: "Clean Restroom", emoji: "🚻", description: "Public restroom in good condition" },
  "vandalism-repaired": { name: "Vandalism Repaired", emoji: "🔨", description: "Vandalism damage fixed" },
  "community-supported": { name: "Community Supported", emoji: "❤️", description: "Community support provided" },
  "wildlife-protected": { name: "Wildlife Protected", emoji: "🦋", description: "Wildlife safely managed" },
  "safe-construction": { name: "Safe Construction Zone", emoji: "👷", description: "Construction area properly managed" },
  "clear-walkways": { name: "Clear Walkways", emoji: "☀️", description: "Walkways cleared of snow/ice" },
  "fire-risk-reduced": { name: "Fire Risk Reduced", emoji: "🧯", description: "Fire hazard addressed" },
  "accessibility-improved": { name: "Accessibility Improved", emoji: "♿", description: "Improved mobility access" },
  "safer-neighborhood": { name: "Safer Neighborhood", emoji: "🏡", description: "Area feels safer to community" },
  "bus-stop-improved": { name: "Bus Stop Improved", emoji: "🚏", description: "Bus stop upgraded or repaired" },
  "road-cleared": { name: "Road Cleared", emoji: "🛣️", description: "Road debris removed" },
  "drainage-working": { name: "Drainage Working", emoji: "🌧️", description: "Storm drainage functioning" },
  "infrastructure-improved": { name: "Infrastructure Improved", emoji: "🏗️", description: "General infrastructure improvement" },
};

export const ALL_CATEGORIES: CategoryDefinition[] = [
  ...ISSUE_CATEGORIES.map((c) => ({ ...c, type: "issue" as const })),
  ...ISSUE_CATEGORIES.map((c) => {
    const slug = c.pairedSlug!;
    const meta = POSITIVE_NAMES[slug];
    return {
      slug,
      name: meta.name,
      emoji: meta.emoji,
      type: "positive" as const,
      photoRequired: false,
      description: meta.description,
      pairedSlug: c.slug,
    };
  }),
];

export function getIssueCategories() {
  return ALL_CATEGORIES.filter((c) => c.type === "issue");
}

export function getPositiveCategories() {
  return ALL_CATEGORIES.filter((c) => c.type === "positive");
}
