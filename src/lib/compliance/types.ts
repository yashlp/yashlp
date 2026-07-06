export type InstitutionType =
  | "government_office"
  | "police_station"
  | "rto_office"
  | "municipality"
  | "public_hospital"
  | "transport_office"
  | "passport_office"
  | "licensing_desk"
  | "other_public_service";

export type CorruptionIssueType =
  | "bribery_allegation"
  | "service_delay"
  | "misconduct_pattern"
  | "irregular_practices";

export type ComplianceAction =
  | "publish"
  | "limit_visibility"
  | "under_review"
  | "block";

export type ComplianceInput = {
  categorySlug: string;
  title?: string;
  description?: string;
  institutionType?: InstitutionType | string;
  servicePoint?: string;
  corruptionIssueType?: CorruptionIssueType | string;
  hasPhoto?: boolean;
  userTrustScore?: number;
  legalProfileId?: string;
  countryCode?: string;
};

export type ComplianceResult = {
  action: ComplianceAction;
  contentRiskScore: number;
  legalRiskScore: number;
  underReview: boolean;
  flags: string[];
  sanitizedTitle: string;
  sanitizedDescription: string;
  displayLabel: string;
  institutionType?: string;
  servicePoint?: string;
  corruptionIssueType?: string;
  aggregationText?: string;
  legalDisclaimer: string;
  originalBlocked: boolean;
  blockReason?: string;
  transformations: string[];
};

export const LEGAL_DISCLAIMER =
  "Content is user-generated and not independently verified. This information reflects community-submitted reports regarding service experiences and does not accuse any individual or confirm wrongdoing.";

export const CORRUPTION_DISCLAIMER =
  "This information is based on community-submitted reports regarding service experiences and does not accuse any individual or confirm wrongdoing.";
