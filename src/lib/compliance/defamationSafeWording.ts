import type { ComplianceInput } from "./types";

type TransformRule = {
  pattern: RegExp;
  replacement: string | ((match: string) => string);
};

const CATEGORY_SAFE_PREFIX: Record<string, string> = {
  "potholes-bad-roads": "Multiple users reported potholes at this location",
  "broken-footpath-sidewalk": "Community reports indicate footpath issues at this location",
  "garbage-pile-up": "Reports indicate accumulated waste at this location",
  "illegal-parking": "Reports indicate recurring parking activity in this area",
  "unhygienic-restaurant": "Community reports suggest possible hygiene concerns at this location",
  "unhygienic-street-vendor": "Community reports suggest possible hygiene concerns at this vendor location",
  "corruption-bribery": "Users have submitted allegations related to service irregularities at this location",
  "long-queue-government-office": "Community reports indicate extended wait times at this service location",
  "broken-public-toilet": "Reports indicate facility issues at this public restroom location",
  "no-shade-heat-hazard": "Community reports indicate limited shade coverage in this area",
};

const UNSAFE_TO_SAFE: TransformRule[] = [
  { pattern: /\b(is|are)\s+dangerous\b/gi, replacement: "have been reported as potentially hazardous by community members" },
  { pattern: /\b(is|are)\s+unhygienic\b/gi, replacement: "may have hygiene concerns according to community reports" },
  { pattern: /\b(bribery|bribe)\s+(occurs|happens|exists)\s+here\b/gi, replacement: "allegations related to service irregularities have been reported at this location" },
  { pattern: /\b(officer|police|clerk)\s+(took|asked|demanded)\s+(a\s+)?bribe\b/gi, replacement: "allegations of irregular service practices reported at this public service location" },
  { pattern: /\b(stole|stealing|thief)\b/gi, replacement: "reported irregular activity" },
  { pattern: /\b(definitely|certainly|proven|confirmed)\s+(corrupt|guilty|illegal)\b/gi, replacement: "allegedly irregular according to community reports" },
  { pattern: /\billegal parking problem exists\b/gi, replacement: "reports indicate recurring parking activity in this area" },
  { pattern: /\broad is dangerous\b/gi, replacement: "multiple users reported potholes and road surface issues at this location" },
  { pattern: /\brestaurant is unhygienic\b/gi, replacement: "community reports suggest possible hygiene concerns" },
];

const NAMED_ENTITY_PATTERNS = [
  /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/,
  /\b(mr|mrs|ms|dr)\.?\s+[A-Z][a-z]+/i,
];

export function transformToSafeWording(input: ComplianceInput): {
  sanitizedTitle: string;
  sanitizedDescription: string;
  transformations: string[];
  namedEntityRisk: boolean;
} {
  const transformations: string[] = [];
  let title = input.title ?? "";
  let description = input.description ?? "";

  for (const rule of UNSAFE_TO_SAFE) {
    const before = description;
    if (typeof rule.replacement === "string") {
      description = description.replace(rule.pattern, rule.replacement);
      title = title.replace(rule.pattern, rule.replacement);
    } else {
      description = description.replace(rule.pattern, rule.replacement);
      title = title.replace(rule.pattern, rule.replacement);
    }
    if (before !== description) transformations.push(`sanitized: ${rule.pattern.source}`);
  }

  const prefix = CATEGORY_SAFE_PREFIX[input.categorySlug];
  if (prefix && description.length > 0 && !description.toLowerCase().startsWith("community")) {
    description = `${prefix}. ${description}`;
    transformations.push("category_safe_prefix");
  } else if (prefix && description.length === 0) {
    description = `${prefix}.`;
    transformations.push("category_default_wording");
  }

  if (!title || title === input.title) {
    const catName = input.categorySlug.replace(/-/g, " ");
    title = `Community report: ${catName}`;
  }

  const namedEntityRisk = NAMED_ENTITY_PATTERNS.some(
    (p) => p.test(description) || p.test(title)
  );
  if (namedEntityRisk) transformations.push("named_entity_detected");

  return {
    sanitizedTitle: title.trim(),
    sanitizedDescription: description.trim(),
    transformations,
    namedEntityRisk,
  };
}

export function confidenceLabelFromScore(score: number): "Low" | "Medium" | "High" {
  if (score >= 0.7) return "High";
  if (score >= 0.4) return "Medium";
  return "Low";
}

export function statusLabelForIncident(status: string, visibilityStage?: string): string {
  if (status === "under_review") return "⚖️ Under Review";
  if (status === "resolution_pending") return "🟡 Resolution Pending";
  if (status === "resolved") return "🟢 Resolved";
  if (status === "disputed") return "🟡 Disputed";
  if (visibilityStage === "verified") return "🔴 Active Issue";
  if (visibilityStage === "seed") return "🔵 Community Report";
  return "🟡 Unverified Report";
}
