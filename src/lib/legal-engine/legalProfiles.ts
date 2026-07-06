import type { LegalProfile, LegalProfileId } from "./types";

export const LEGAL_DOCUMENT_VERSION = "2026.07.06";

export const LEGAL_PROFILES: Record<LegalProfileId, LegalProfile> = {
  IN_STANDARD: {
    id: "IN_STANDARD",
    name: "India Standard",
    region: "Asia",
    countries: ["IN"],
    governingLaw: "Republic of India",
    dataPrivacy: {
      framework: "Digital Personal Data Protection Act, 2023 (DPDP) and IT Act",
      storageRules:
        "Personal data may be stored on servers in India or compliant cross-border locations with appropriate safeguards.",
      consentRequired: true,
      rightToDelete: true,
      dataRetentionDays: 365,
      crossBorderTransfer: "Permitted with user consent and lawful basis under DPDP.",
      dpoRequired: false,
    },
    contentLiability: {
      defamationRiskLevel: "high",
      platformLiabilityModel:
        "Intermediary safe harbour under IT Act Section 79 when due diligence is followed.",
      userResponsibilityModel: "Users are solely responsible for the truth and legality of submissions.",
      safeHarborProtection: true,
      businessDisputeRights: true,
    },
    geoLocation: {
      trackingConsentRequired: true,
      sensitiveLocationRestrictions:
        "Do not report precise locations of courts, military installations, or protected facilities without lawful purpose.",
      precisionLimitMeters: 100,
    },
    contentModeration: {
      hateSpeechLevel: "strict",
      sensitiveCategories: ["corruption-bribery", "harassment-points", "child-labor-exploitation"],
      abuseReportingProcess: "Report via in-app dispute; review within 72 hours.",
      politicalContentHandling:
        "Corruption and governance reports are community signals, not verified legal findings.",
    },
    disputeProcess:
      "Users and businesses may dispute content. CivicLens does not adjudicate guilt; community verification and review apply.",
    businessProtection: [
      "Businesses may claim profiles and request review of reputation-affecting reports.",
      "No automatic assumption of guilt for named entities.",
      "Takedown review available for clearly false or abusive reports.",
    ],
  },

  UK_GDPR: {
    id: "UK_GDPR",
    name: "United Kingdom GDPR",
    region: "Europe",
    countries: ["GB"],
    governingLaw: "England and Wales",
    dataPrivacy: {
      framework: "UK GDPR and Data Protection Act 2018",
      storageRules: "Data processed lawfully with documented legal basis; UK/EU adequacy considerations apply.",
      consentRequired: true,
      rightToDelete: true,
      dataRetentionDays: 730,
      crossBorderTransfer: "International transfers require appropriate safeguards (SCCs or adequacy).",
      dpoRequired: true,
    },
    contentLiability: {
      defamationRiskLevel: "high",
      platformLiabilityModel:
        "Defamation Act 2013 and Online Safety Act considerations; platform acts as host of user content.",
      userResponsibilityModel: "Users must not publish defamatory statements of fact about identifiable persons.",
      safeHarborProtection: true,
      businessDisputeRights: true,
    },
    geoLocation: {
      trackingConsentRequired: true,
      sensitiveLocationRestrictions: "Location precision may be reduced for sensitive sites.",
      precisionLimitMeters: 50,
    },
    contentModeration: {
      hateSpeechLevel: "strict",
      sensitiveCategories: ["corruption-bribery", "harassment-points"],
      abuseReportingProcess: "UK-compliant complaint and removal process within statutory timelines.",
      politicalContentHandling: "Opinion and community reporting distinguished from verified facts.",
    },
    disputeProcess:
      "Defamation complaints reviewed under UK law; users may respond and content may be geo-restricted pending review.",
    businessProtection: [
      "Business dispute and correction mechanism available.",
      "Reputation reports require community validation before full visibility.",
    ],
  },

  EU_GDPR_STRICT: {
    id: "EU_GDPR_STRICT",
    name: "European Union GDPR (Strict)",
    region: "Europe",
    countries: ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL", "SE", "IE", "PT", "FI", "DK"],
    governingLaw: "European Union member state law",
    dataPrivacy: {
      framework: "EU GDPR (Regulation 2016/679)",
      storageRules: "Data minimisation, purpose limitation, and storage limitation principles apply.",
      consentRequired: true,
      rightToDelete: true,
      dataRetentionDays: 365,
      crossBorderTransfer: "Transfers outside EEA require adequacy decision or Standard Contractual Clauses.",
      dpoRequired: true,
    },
    contentLiability: {
      defamationRiskLevel: "high",
      platformLiabilityModel: "DSA host obligations; no general monitoring obligation.",
      userResponsibilityModel: "Users warrant lawful content and indemnify platform for unlawful submissions.",
      safeHarborProtection: true,
      businessDisputeRights: true,
    },
    geoLocation: {
      trackingConsentRequired: true,
      sensitiveLocationRestrictions: "Explicit consent required for precise geolocation tracking.",
      precisionLimitMeters: 50,
    },
    contentModeration: {
      hateSpeechLevel: "enhanced",
      sensitiveCategories: ["corruption-bribery", "harassment-points", "substance-abuse-hotspots"],
      abuseReportingProcess: "DSA-compliant notice-and-action mechanism.",
      politicalContentHandling: "Sensitive governance content flagged for enhanced review.",
    },
    disputeProcess:
      "EU users may lodge complaints with supervisory authority; CivicLens provides transparent moderation decisions.",
    businessProtection: [
      "Trusted flagger and business dispute pathways.",
      "Statement of reasons provided for significant moderation decisions where required.",
    ],
  },

  US_CDA_SAFE_HARBOR: {
    id: "US_CDA_SAFE_HARBOR",
    name: "United States (Section 230)",
    region: "North America",
    countries: ["US"],
    governingLaw: "State of Delaware, United States",
    dataPrivacy: {
      framework: "State privacy laws (CCPA/CPRA, etc.) where applicable",
      storageRules: "Notice at collection; opt-out of sale/sharing where required by state law.",
      consentRequired: false,
      rightToDelete: true,
      dataRetentionDays: 1095,
      crossBorderTransfer: "Domestic processing preferred; international users subject to local law.",
      dpoRequired: false,
    },
    contentLiability: {
      defamationRiskLevel: "medium",
      platformLiabilityModel:
        "Section 230(c) — platform not treated as publisher of user-generated content.",
      userResponsibilityModel: "Users liable for their own speech; platform may remove content at discretion.",
      safeHarborProtection: true,
      businessDisputeRights: true,
    },
    geoLocation: {
      trackingConsentRequired: false,
      sensitiveLocationRestrictions: "Sensitive government facility reporting discouraged.",
    },
    contentModeration: {
      hateSpeechLevel: "standard",
      sensitiveCategories: ["corruption-bribery"],
      abuseReportingProcess: "DMCA and defamation counter-notice process available.",
      politicalContentHandling: "Protected speech considerations; community verification still required.",
    },
    disputeProcess:
      "Counter-notification process for wrongful takedowns; arbitration clause may apply per state law.",
    businessProtection: [
      "Business profile claim and dispute resolution.",
      "No liability for user opinions classified as community reports.",
    ],
  },

  CA_PIPEDA: {
    id: "CA_PIPEDA",
    name: "Canada PIPEDA",
    region: "North America",
    countries: ["CA"],
    governingLaw: "Province of Ontario, Canada",
    dataPrivacy: {
      framework: "PIPEDA and applicable provincial privacy laws",
      storageRules: "Meaningful consent for collection, use, and disclosure of personal information.",
      consentRequired: true,
      rightToDelete: true,
      dataRetentionDays: 730,
      crossBorderTransfer: "Users informed when data may be processed outside Canada.",
      dpoRequired: false,
    },
    contentLiability: {
      defamationRiskLevel: "medium",
      platformLiabilityModel: "Common law defamation; platform as intermediary.",
      userResponsibilityModel: "Users responsible for accuracy of factual claims.",
      safeHarborProtection: true,
      businessDisputeRights: true,
    },
    geoLocation: {
      trackingConsentRequired: true,
      sensitiveLocationRestrictions: "Location data is personal information requiring consent.",
    },
    contentModeration: {
      hateSpeechLevel: "strict",
      sensitiveCategories: ["corruption-bribery", "harassment-points"],
      abuseReportingProcess: "Complaints reviewed per PIPEDA and platform policy.",
      politicalContentHandling: "Community intelligence framing; not official findings.",
    },
    disputeProcess: "Privacy Commissioner complaints pathway; content disputes via platform review.",
    businessProtection: [
      "Business dispute and correction rights.",
      "Community validation before verified visibility.",
    ],
  },

  AU_PRIVACY_ACT: {
    id: "AU_PRIVACY_ACT",
    name: "Australia Privacy Act",
    region: "Oceania",
    countries: ["AU", "NZ"],
    governingLaw: "Commonwealth of Australia",
    dataPrivacy: {
      framework: "Privacy Act 1988 (Cth) and APPs",
      storageRules: "Australian Privacy Principles govern collection and use of personal information.",
      consentRequired: true,
      rightToDelete: true,
      dataRetentionDays: 730,
      crossBorderTransfer: "Cross-border disclosure only with appropriate protections.",
      dpoRequired: false,
    },
    contentLiability: {
      defamationRiskLevel: "high",
      platformLiabilityModel: "Defamation law reform considerations; host liability framework.",
      userResponsibilityModel: "Users must not publish seriously harmful defamatory content.",
      safeHarborProtection: true,
      businessDisputeRights: true,
    },
    geoLocation: {
      trackingConsentRequired: true,
      sensitiveLocationRestrictions: "Sensitive location reporting subject to review.",
    },
    contentModeration: {
      hateSpeechLevel: "strict",
      sensitiveCategories: ["corruption-bribery", "harassment-points"],
      abuseReportingProcess: "eSafety and platform abuse reporting pathways.",
      politicalContentHandling: "Governance reports labelled as unverified community intelligence.",
    },
    disputeProcess: "OAIC privacy complaints; defamation concerns escalated per Australian law.",
    businessProtection: [
      "Business may challenge false reports.",
      "AI and community validation before verified status.",
    ],
  },

  GLOBAL_DEFAULT: {
    id: "GLOBAL_DEFAULT",
    name: "Global Default",
    region: "International",
    countries: ["*"],
    governingLaw: "International commercial law with local compliance where applicable",
    dataPrivacy: {
      framework: "Globally recognised privacy principles",
      storageRules: "Data processed with consent and legitimate purpose.",
      consentRequired: true,
      rightToDelete: true,
      dataRetentionDays: 365,
      crossBorderTransfer: "Transfers subject to applicable local requirements.",
      dpoRequired: false,
    },
    contentLiability: {
      defamationRiskLevel: "medium",
      platformLiabilityModel: "Platform hosts user content; not a publisher of user statements.",
      userResponsibilityModel: "Users solely responsible for content they submit.",
      safeHarborProtection: true,
      businessDisputeRights: true,
    },
    geoLocation: {
      trackingConsentRequired: true,
      sensitiveLocationRestrictions: "Avoid reporting sensitive facilities at high precision.",
    },
    contentModeration: {
      hateSpeechLevel: "standard",
      sensitiveCategories: ["corruption-bribery", "harassment-points"],
      abuseReportingProcess: "In-app reporting and review.",
      politicalContentHandling: "Community reports are not verified legal or official findings.",
    },
    disputeProcess: "Global dispute process with local law escalation where required.",
    businessProtection: [
      "Business profile claim available.",
      "Dispute and takedown review for abusive content.",
    ],
  },
};

const COUNTRY_TO_PROFILE: Record<string, LegalProfileId> = {};
for (const profile of Object.values(LEGAL_PROFILES)) {
  for (const code of profile.countries) {
    if (code !== "*") COUNTRY_TO_PROFILE[code] = profile.id;
  }
}

export function getLegalProfile(id: LegalProfileId): LegalProfile {
  return LEGAL_PROFILES[id];
}

export function resolveProfileForCountry(countryCode: string): LegalProfileId {
  const code = countryCode.toUpperCase();
  if (COUNTRY_TO_PROFILE[code]) return COUNTRY_TO_PROFILE[code];
  if (["EU"].includes(code)) return "EU_GDPR_STRICT";
  return "GLOBAL_DEFAULT";
}

export function getCountryName(countryCode: string): string {
  const names: Record<string, string> = {
    IN: "India",
    GB: "United Kingdom",
    US: "United States",
    CA: "Canada",
    AU: "Australia",
    NZ: "New Zealand",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    NL: "Netherlands",
    BE: "Belgium",
    AT: "Austria",
    PL: "Poland",
    SE: "Sweden",
    IE: "Ireland",
    PT: "Portugal",
    FI: "Finland",
    DK: "Denmark",
    JP: "Japan",
    BR: "Brazil",
    NG: "Nigeria",
  };
  return names[countryCode.toUpperCase()] ?? countryCode;
}
