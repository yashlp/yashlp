import type { ComplianceInput } from "./types";
import { processCorruptionReport, isCorruptionCategory } from "./corruptionHandler";
import { transformToSafeWording } from "./defamationSafeWording";

export function sanitizeContent(input: ComplianceInput): {
  sanitizedTitle: string;
  sanitizedDescription: string;
  transformations: string[];
  corruptionMeta?: ReturnType<typeof processCorruptionReport>;
} {
  if (isCorruptionCategory(input.categorySlug)) {
    const corruption = processCorruptionReport(input);
    if (corruption.blocked) {
      return {
        sanitizedTitle: "",
        sanitizedDescription: "",
        transformations: ["corruption_blocked"],
        corruptionMeta: corruption,
      };
    }
    return {
      sanitizedTitle: corruption.title,
      sanitizedDescription: corruption.sanitizedText,
      transformations: ["corruption_location_sanitized"],
      corruptionMeta: corruption,
    };
  }

  const wording = transformToSafeWording(input);
  return {
    sanitizedTitle: wording.sanitizedTitle,
    sanitizedDescription: wording.sanitizedDescription,
    transformations: wording.transformations,
  };
}
