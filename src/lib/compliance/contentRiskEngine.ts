import type { ComplianceAction, ComplianceInput } from "./types";
import { transformToSafeWording } from "./defamationSafeWording";
import { isCorruptionCategory, processCorruptionReport } from "./corruptionHandler";

const DEFAMATION_PATTERNS = [
  /\b(stole|stealing|thief|criminal|fraud|scam)\b/i,
  /\b(rapist|murderer|pedophile|terrorist)\b/i,
  /\b(guilty|proven|confirmed\s+crime|definitely\s+corrupt)\b/i,
  /\b(illegal|unlawful)\s+(activity|business)\b/i,
];

const HATE_PATTERNS = [/\b(kill|exterminate)\s+(all|every)\b/i];

const ABSOLUTE_CLAIM_PATTERNS = [
  /\b(always|never|every time|100%)\b/i,
  /\b(is\s+a\s+criminal|is\s+corrupt)\b/i,
];

const SENSITIVE_CATEGORIES = new Set([
  "corruption-bribery",
  "harassment-points",
  "child-labor-exploitation",
  "unhygienic-restaurant",
  "unhygienic-street-vendor",
]);

export type RiskAssessment = {
  contentRiskScore: number;
  action: ComplianceAction;
  flags: string[];
  factors: Record<string, number>;
};

export function assessContentRisk(
  input: ComplianceInput,
  options: { namedEntityRisk?: boolean; transformations?: string[] } = {}
): RiskAssessment {
  const text = `${input.title ?? ""} ${input.description ?? ""}`.trim();
  const flags: string[] = [];
  const factors: Record<string, number> = {};
  let score = 0;

  if (SENSITIVE_CATEGORIES.has(input.categorySlug)) {
    factors.sensitive_category = 15;
    score += 15;
    flags.push("sensitive_category");
  }

  if (isCorruptionCategory(input.categorySlug)) {
    const corruption = processCorruptionReport(input);
    if (corruption.blocked) {
      return {
        contentRiskScore: 100,
        action: "block",
        flags: corruption.flags,
        factors: { individual_targeting: 100 },
      };
    }
    factors.political_sensitivity = 20;
    score += 20;
    flags.push("political_sensitive");
  }

  for (const pattern of DEFAMATION_PATTERNS) {
    if (pattern.test(text)) {
      factors.defamation = 25;
      score += 25;
      flags.push("defamation_risk");
      break;
    }
  }

  if (options.namedEntityRisk) {
    factors.named_entity = 20;
    score += 20;
    flags.push("named_entity");
  }

  for (const pattern of HATE_PATTERNS) {
    if (pattern.test(text)) {
      factors.hate_speech = 35;
      score += 35;
      flags.push("hate_speech");
      break;
    }
  }

  for (const pattern of ABSOLUTE_CLAIM_PATTERNS) {
    if (pattern.test(text)) {
      factors.false_certainty = 15;
      score += 15;
      flags.push("false_certainty");
      break;
    }
  }

  if (text.length < 10 && input.categorySlug !== "corruption-bribery") {
    factors.insufficient_context = 10;
    score += 10;
    flags.push("insufficient_context");
  }

  if ((input.userTrustScore ?? 0.5) < 0.3) {
    factors.low_trust_user = 15;
    score += 15;
    flags.push("low_trust_user");
  }

  if ((input.evidenceScore ?? 1) < 0.4) {
    factors.weak_evidence = 15;
    score += 15;
    flags.push("weak_evidence");
  }

  for (const flag of input.evidenceFlags ?? []) {
    if (flag === "gps_far" && !flags.includes("weak_evidence")) {
      factors.gps_mismatch = 10;
      score += 10;
      flags.push("gps_mismatch");
    }
  }

  if (!input.hasPhoto && ["unhygienic-restaurant", "potholes-bad-roads"].includes(input.categorySlug)) {
    factors.no_photo_evidence = 5;
    score += 5;
  }

  const wording = transformToSafeWording(input);
  if (wording.namedEntityRisk) {
    if (!flags.includes("named_entity")) {
      factors.named_entity = 20;
      score += 20;
      flags.push("named_entity");
    }
  }

  score = Math.min(100, score);

  let action: ComplianceAction = "publish";
  if (score >= 75) action = "block";
  else if (score >= 55) action = "under_review";
  else if (score >= 35) action = "limit_visibility";

  return { contentRiskScore: score, action, flags, factors };
}

export function actionToUnderReview(action: ComplianceAction): boolean {
  return action === "under_review" || action === "limit_visibility";
}
