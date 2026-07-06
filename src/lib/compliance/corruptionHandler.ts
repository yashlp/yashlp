import type { CorruptionIssueType, ComplianceInput } from "./types";
import {
  CORRUPTION_ISSUE_LABELS,
  getInstitutionLabel,
  inferInstitutionFromText,
} from "./institutions";

const CORRUPTION_SLUG = "corruption-bribery";

const FORBIDDEN_INDIVIDUAL_PATTERNS = [
  /\b(officer|constable|inspector|clerk|official|agent|employee)\s+[A-Z][a-z]+/i,
  /\b(mr|mrs|ms|dr|shri|smt)\.?\s+[A-Z][a-z]+/i,
  /\bbadge\s*(no|number|#)?\s*\d+/i,
  /\b(name is|called|known as)\s+[A-Z][a-z]+/i,
  /\b(he|she|they)\s+(took|asked|demanded|accepted)\b/i,
  /\bthis\s+(man|woman|person|guy)\b/i,
];

const ISSUE_TYPE_PATTERNS: [RegExp, CorruptionIssueType][] = [
  [/\b(bribe|bribery|money|cash|under.?table|kickback)\b/i, "bribery_allegation"],
  [/\b(delay|waiting|queue|hours|days)\b/i, "service_delay"],
  [/\b(misconduct|harassment|rude|abuse)\b/i, "misconduct_pattern"],
  [/\b(irregular|unofficial|illegal fee|extra charge)\b/i, "irregular_practices"],
];

export type CorruptionProcessResult = {
  isCorruption: boolean;
  blocked: boolean;
  blockReason?: string;
  flags: string[];
  institutionType?: string;
  servicePoint?: string;
  corruptionIssueType?: string;
  sanitizedText: string;
  displayLabel: string;
  aggregationText: string;
  title: string;
};

export function isCorruptionCategory(slug: string): boolean {
  return slug === CORRUPTION_SLUG;
}

export function processCorruptionReport(input: ComplianceInput): CorruptionProcessResult {
  const text = `${input.description ?? ""} ${input.servicePoint ?? ""}`.trim();
  const flags: string[] = [];

  if (!isCorruptionCategory(input.categorySlug)) {
    return {
      isCorruption: false,
      blocked: false,
      flags: [],
      sanitizedText: text,
      displayLabel: input.title ?? "",
      aggregationText: "",
      title: input.title ?? "",
    };
  }

  for (const pattern of FORBIDDEN_INDIVIDUAL_PATTERNS) {
    if (pattern.test(text) || pattern.test(input.description ?? "")) {
      return {
        isCorruption: true,
        blocked: true,
        blockReason:
          "Corruption reports must be location-based only. Do not name individuals, badge numbers, or personal identities. Report the institution or service point instead.",
        flags: ["individual_targeting_forbidden"],
        sanitizedText: "",
        displayLabel: "",
        aggregationText: "",
        title: "",
      };
    }
  }

  const institutionType =
    input.institutionType ??
    inferInstitutionFromText(text) ??
    "other_public_service";

  if (!input.institutionType && !inferInstitutionFromText(text)) {
    flags.push("institution_inferred");
  }

  let corruptionIssueType = input.corruptionIssueType as CorruptionIssueType | undefined;
  if (!corruptionIssueType) {
    for (const [pattern, type] of ISSUE_TYPE_PATTERNS) {
      if (pattern.test(text)) {
        corruptionIssueType = type;
        break;
      }
    }
  }
  corruptionIssueType = corruptionIssueType ?? "irregular_practices";

  const institutionLabel = getInstitutionLabel(institutionType);
  const issueLabel = CORRUPTION_ISSUE_LABELS[corruptionIssueType] ?? "service integrity reports";
  const servicePoint = input.servicePoint?.trim();

  const sanitizedText = buildCorruptionSafeText(institutionLabel, servicePoint, corruptionIssueType);
  const displayLabel = `${institutionLabel} – Service Integrity Reports`;
  const aggregationText = servicePoint
    ? `Multiple users reported ${issueLabel} related to ${servicePoint} at ${institutionLabel}.`
    : `Multiple users reported ${issueLabel} at ${institutionLabel}.`;

  return {
    isCorruption: true,
    blocked: false,
    flags: ["corruption_location_based", ...flags],
    institutionType,
    servicePoint: servicePoint ?? undefined,
    corruptionIssueType,
    sanitizedText,
    displayLabel,
    aggregationText,
    title: displayLabel,
  };
}

function buildCorruptionSafeText(
  institution: string,
  servicePoint: string | undefined,
  issueType: string
): string {
  const issuePhrase =
    issueType === "bribery_allegation"
      ? "allegations of irregular service practices"
      : issueType === "service_delay"
        ? "reports of service delays"
        : issueType === "misconduct_pattern"
          ? "reports of possible misconduct patterns"
          : "reports of service irregularities";

  if (servicePoint) {
    return `Community members have submitted ${issuePhrase} at ${servicePoint}, ${institution}.`;
  }
  return `Community members have submitted ${issuePhrase} at ${institution}.`;
}
