import type { LegalDocument, LegalProfile, LegalSafetyResult } from "./types";
import { LEGAL_DOCUMENT_VERSION, getCountryName } from "./legalProfiles";
import { generateTerms } from "./termsGenerator";
import { generatePrivacyPolicy } from "./privacyGenerator";

const SENSITIVE_CATEGORY_SLUGS = new Set([
  "corruption-bribery",
  "harassment-points",
  "child-labor-exploitation",
  "substance-abuse-hotspots",
  "unhygienic-restaurant",
  "unhygienic-street-vendor",
]);

const DEFAMATION_PATTERNS = [
  /\b(stole|stealing|thief|criminal|fraud|scam|corrupt|bribe|bribed)\b/i,
  /\b(rapist|murderer|pedophile|terrorist)\b/i,
  /\b(illegal|unlawful)\s+(activity|business|operation)\b/i,
  /@[\w]+/,
  /\b(mr|mrs|ms|dr)\.?\s+[A-Z][a-z]+\b/,
  /\b(shop|store|restaurant|hotel)\s+["'][\w\s]+["']/i,
];

const HATE_PATTERNS = [
  /\b(kill|die|exterminate)\s+(all|every)\b/i,
  /\b(racial|religious)\s+slur\b/i,
];

export function generateContentPolicy(
  profile: LegalProfile,
  countryCode: string
): LegalDocument {
  const country = getCountryName(countryCode);
  const mod = profile.contentModeration;

  return {
    type: "content",
    title: `Content Guidelines — ${country}`,
    version: LEGAL_DOCUMENT_VERSION,
    lastUpdated: "July 6, 2026",
    country,
    legalProfile: profile.id,
    jurisdictionNote: `${mod.hateSpeechLevel} moderation · ${profile.contentLiability.defamationRiskLevel} defamation risk jurisdiction`,
    sections: [
      {
        id: "purpose",
        title: "1. Purpose",
        body: "These guidelines govern civic reporting, photos, comments, and community interactions on CivicLens. They supplement our Terms & Conditions.",
      },
      {
        id: "allowed",
        title: "2. Allowed Content",
        body: "Good-faith civic observations, infrastructure issues, positive community signals, photos of public spaces (max 2 per report), and constructive comments. Frame reports as your observation, not as proven fact about identifiable persons.",
      },
      {
        id: "prohibited",
        title: "3. Prohibited Content",
        body: "False accusations, defamatory statements about named individuals or businesses, hate speech, harassment, doxxing, copyrighted material without permission, spam, manipulated evidence, and content inciting violence.",
      },
      {
        id: "photos",
        title: "4. Photo Rules",
        body: "Maximum 2 photos per report. Some categories require photo evidence. Do not include identifiable private individuals without consent. Blur faces of bystanders where possible.",
      },
      {
        id: "sensitive",
        title: "5. Sensitive Categories",
        body: `Enhanced review applies to: ${mod.sensitiveCategories.join(", ")}. ${mod.politicalContentHandling}`,
      },
      {
        id: "business",
        title: "6. Business & Reputation Reports",
        body: "Reports affecting businesses are community signals, not verdicts. Businesses may dispute reports. AI + community validation required before verified visibility. No automatic assumption of guilt.",
      },
      {
        id: "abuse",
        title: "7. Reporting Abuse",
        body: mod.abuseReportingProcess +
          " Use in-app dispute and comment tools. Escalate legal concerns to legal@civiclens.app.",
      },
      {
        id: "ai-review",
        title: "8. AI Legal Safety Review",
        body: "Before public visibility, AI assesses defamation risk, hate speech, false accusation patterns, and sensitive political content. High-risk content is marked Under Review and withheld from verified map visibility.",
      },
      {
        id: "enforcement",
        title: "9. Enforcement",
        body: "Violations may result in content removal, reduced visibility, account warnings, or suspension. Repeat offenders lose reputation and reporting privileges.",
      },
    ],
  };
}

export type LegalContentInput = {
  categorySlug: string;
  title?: string;
  description?: string;
  legalProfile: LegalProfile;
};

export function assessLegalRisk(input: LegalContentInput): LegalSafetyResult {
  const text = `${input.title ?? ""} ${input.description ?? ""}`.trim();
  const flags: string[] = [];
  let score = 0;

  if (SENSITIVE_CATEGORY_SLUGS.has(input.categorySlug)) {
    score += 0.25;
    flags.push("sensitive_category");
  }

  if (input.legalProfile.contentLiability.defamationRiskLevel === "high") {
    score += 0.1;
  }

  for (const pattern of DEFAMATION_PATTERNS) {
    if (pattern.test(text)) {
      score += 0.2;
      flags.push("defamation_risk");
      break;
    }
  }

  for (const pattern of HATE_PATTERNS) {
    if (pattern.test(text)) {
      score += 0.35;
      flags.push("hate_speech_risk");
      break;
    }
  }

  if (input.categorySlug === "corruption-bribery") {
    score += 0.15;
    flags.push("political_sensitive");
  }

  if (/\b(guilty|proven|confirmed\s+crime|definitely\s+corrupt)\b/i.test(text)) {
    score += 0.2;
    flags.push("absolute_claim");
  }

  if (text.length > 0 && text.length < 15 && input.categorySlug === "corruption-bribery") {
    score += 0.1;
    flags.push("insufficient_context");
  }

  score = Math.min(1, Math.round(score * 100) / 100);

  let recommendation: LegalSafetyResult["recommendation"] = "publish";
  let underReview = false;

  if (score >= 0.65) {
    recommendation = "block";
    underReview = true;
  } else if (score >= 0.35) {
    recommendation = "review";
    underReview = true;
  }

  const summary = underReview
    ? "Content flagged for legal review — withheld from verified public visibility until community validation."
    : "Content passed initial legal safety screening.";

  return { legalRiskScore: score, underReview, flags, recommendation, summary };
}

export function generateAllLegalDocuments(
  profile: LegalProfile,
  countryCode: string,
  role: "user" | "business" | "enterprise" = "user"
) {
  return {
    terms: generateTerms(profile, countryCode, role),
    privacy: generatePrivacyPolicy(profile, countryCode),
    content: generateContentPolicy(profile, countryCode),
  };
}