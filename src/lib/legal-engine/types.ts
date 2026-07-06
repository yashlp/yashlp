export type LegalProfileId =
  | "IN_STANDARD"
  | "UK_GDPR"
  | "EU_GDPR_STRICT"
  | "US_CDA_SAFE_HARBOR"
  | "CA_PIPEDA"
  | "AU_PRIVACY_ACT"
  | "GLOBAL_DEFAULT";

export type UserRole = "user" | "business" | "enterprise";

export type DefamationRiskLevel = "low" | "medium" | "high";

export type LegalDocumentSection = {
  id: string;
  title: string;
  body: string;
};

export type LegalDocument = {
  type: "terms" | "privacy" | "content";
  title: string;
  version: string;
  lastUpdated: string;
  country: string;
  legalProfile: LegalProfileId;
  jurisdictionNote: string;
  sections: LegalDocumentSection[];
};

export type DataPrivacyRules = {
  framework: string;
  storageRules: string;
  consentRequired: boolean;
  rightToDelete: boolean;
  dataRetentionDays: number;
  crossBorderTransfer: string;
  dpoRequired: boolean;
};

export type ContentLiabilityRules = {
  defamationRiskLevel: DefamationRiskLevel;
  platformLiabilityModel: string;
  userResponsibilityModel: string;
  safeHarborProtection: boolean;
  businessDisputeRights: boolean;
};

export type GeoLocationRules = {
  trackingConsentRequired: boolean;
  sensitiveLocationRestrictions: string;
  precisionLimitMeters?: number;
};

export type ContentModerationRules = {
  hateSpeechLevel: "standard" | "strict" | "enhanced";
  sensitiveCategories: string[];
  abuseReportingProcess: string;
  politicalContentHandling: string;
};

export type LegalProfile = {
  id: LegalProfileId;
  name: string;
  region: string;
  countries: string[];
  governingLaw: string;
  dataPrivacy: DataPrivacyRules;
  contentLiability: ContentLiabilityRules;
  geoLocation: GeoLocationRules;
  contentModeration: ContentModerationRules;
  disputeProcess: string;
  businessProtection: string[];
};

export type CountryDetectionResult = {
  country: string;
  countryCode: string;
  region: string;
  legalProfile: LegalProfileId;
  detectionSource: "ip" | "device" | "profile" | "phone" | "fallback";
};

export type LegalSafetyResult = {
  legalRiskScore: number;
  underReview: boolean;
  flags: string[];
  recommendation: "publish" | "review" | "block";
  summary: string;
};
