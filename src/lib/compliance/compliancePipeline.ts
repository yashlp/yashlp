import type { ComplianceInput, ComplianceResult } from "./types";
import { CORRUPTION_DISCLAIMER, LEGAL_DISCLAIMER } from "./types";
import { sanitizeContent } from "./sanitizationEngine";
import { assessContentRisk, actionToUnderReview } from "./contentRiskEngine";
import { isCorruptionCategory } from "./corruptionHandler";
import { transformToSafeWording } from "./defamationSafeWording";

export function processCompliance(input: ComplianceInput): ComplianceResult {
  const sanitized = sanitizeContent(input);

  if (sanitized.corruptionMeta?.blocked) {
    return {
      action: "block",
      contentRiskScore: 100,
      legalRiskScore: 1,
      underReview: true,
      flags: sanitized.corruptionMeta.flags,
      sanitizedTitle: "",
      sanitizedDescription: "",
      displayLabel: "",
      originalBlocked: true,
      blockReason: sanitized.corruptionMeta.blockReason,
      transformations: sanitized.transformations,
      legalDisclaimer: CORRUPTION_DISCLAIMER,
    };
  }

  const wording = transformToSafeWording({
    ...input,
    description: sanitized.sanitizedDescription || input.description,
    title: sanitized.sanitizedTitle || input.title,
  });

  const risk = assessContentRisk(input, {
    namedEntityRisk: wording.namedEntityRisk,
    transformations: sanitized.transformations,
  });

  const corruption = sanitized.corruptionMeta;
  const displayLabel = corruption?.displayLabel ?? wording.sanitizedTitle ?? "Community report";

  let action = risk.action;
  if (
    isCorruptionCategory(input.categorySlug) &&
    sanitized.corruptionMeta &&
    !sanitized.corruptionMeta.blocked &&
    action === "block"
  ) {
    action = "under_review";
  }

  const disclaimer = isCorruptionCategory(input.categorySlug)
    ? CORRUPTION_DISCLAIMER
    : LEGAL_DISCLAIMER;

  return {
    action,
    contentRiskScore: risk.contentRiskScore,
    legalRiskScore: risk.contentRiskScore / 100,
    underReview: actionToUnderReview(action) || action === "under_review",
    flags: [...new Set([...risk.flags, ...sanitized.transformations])],
    sanitizedTitle: sanitized.sanitizedTitle || displayLabel,
    sanitizedDescription: sanitized.sanitizedDescription || wording.sanitizedDescription,
    displayLabel,
    institutionType: corruption?.institutionType,
    servicePoint: corruption?.servicePoint,
    corruptionIssueType: corruption?.corruptionIssueType,
    aggregationText: corruption?.aggregationText,
    legalDisclaimer: disclaimer,
    originalBlocked: false,
    transformations: sanitized.transformations,
  };
}
