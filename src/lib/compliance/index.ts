export * from "./types";
export * from "./institutions";
export * from "./corruptionHandler";
export * from "./defamationSafeWording";
export * from "./sanitizationEngine";
export * from "./contentRiskEngine";
export * from "./evidenceEngine";
export * from "./trustService";
export { processCompliance } from "./compliancePipeline";

export function buildAggregationSummary(
  displayLabel: string,
  confirmationCount: number,
  categorySlug: string
): string {
  if (categorySlug === "corruption-bribery") {
    return confirmationCount > 1
      ? `Multiple users reported service-related concerns at ${displayLabel.replace(" – Service Integrity Reports", "")}.`
      : `A community member reported service-related concerns at ${displayLabel.replace(" – Service Integrity Reports", "")}.`;
  }
  if (confirmationCount > 3) {
    return `High frequency of community reports in this zone (${confirmationCount} confirmations).`;
  }
  if (confirmationCount > 1) {
    return `Multiple users reported issues related to this location.`;
  }
  return "Single community report — awaiting additional confirmations.";
}
