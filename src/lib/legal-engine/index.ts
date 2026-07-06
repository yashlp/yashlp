export * from "./types";
export {
  LEGAL_DOCUMENT_VERSION,
  LEGAL_PROFILES,
  getLegalProfile,
  resolveProfileForCountry,
  getCountryName,
} from "./legalProfiles";
export {
  detectCountry,
  getIpCountryFromHeaders,
  inferCountryFromPhone,
  type DetectionInput,
} from "./countryDetector";
export { generateTerms } from "./termsGenerator";
export { generatePrivacyPolicy } from "./privacyGenerator";
export {
  generateContentPolicy,
  assessLegalRisk,
  generateAllLegalDocuments,
  type LegalContentInput,
} from "./contentPolicyEngine";

import { getLegalProfile } from "./legalProfiles";
import { generateAllLegalDocuments } from "./contentPolicyEngine";
import type { UserRole } from "./types";

export function buildLegalPackage(
  legalProfileId: string,
  countryCode: string,
  role: UserRole = "user"
) {
  const profile = getLegalProfile(legalProfileId as Parameters<typeof getLegalProfile>[0]);
  const docs = generateAllLegalDocuments(profile, countryCode, role);
  return { profile, docs, detection: { countryCode, legalProfile: profile.id } };
}
