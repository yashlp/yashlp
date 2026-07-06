import type { LegalDocument, LegalProfile, UserRole } from "./types";
import { LEGAL_DOCUMENT_VERSION } from "./legalProfiles";
import { getCountryName } from "./legalProfiles";

const CIVICLENS_CORE_DISCLAIMERS = [
  "CivicLens is a community intelligence platform using user-generated data. It is NOT a legal authority, government agency, or verified news source.",
  "All reports, pins, scores, and insights reflect community-submitted information that has NOT been independently verified as absolute truth.",
  "The platform does not guarantee the accuracy, completeness, or timeliness of any user-submitted content.",
  "CivicLens does not assume liability for claims, accusations, or reputational impact arising from user-generated reports.",
  "Verified status means community validation thresholds were met — not legal or official verification.",
];

function businessClauses(profile: LegalProfile, role: UserRole): LegalDocument["sections"] {
  if (role === "user") return [];
  return [
    {
      id: "business-claim",
      title: "Business Profile Claims",
      body: `Businesses operating in ${profile.governingLaw} may claim their CivicLens profile to receive dispute notifications and submit corrections. Claiming a profile does not imply endorsement by CivicLens.`,
    },
    {
      id: "business-dispute",
      title: "Dispute & Takedown Review",
      body: profile.businessProtection.join(" "),
    },
    {
      id: "business-no-guilt",
      title: "Presumption of Fair Reporting",
      body: "Reports about businesses remain community signals until verified through CivicLens's trust system. No automatic assumption of guilt applies to any named entity. AI and community validation are required before full public visibility.",
    },
  ];
}

export function generateTerms(
  profile: LegalProfile,
  countryCode: string,
  role: UserRole = "user"
): LegalDocument {
  const country = getCountryName(countryCode);
  const sections: LegalDocument["sections"] = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      body: `By accessing CivicLens in ${country}, you agree to these Terms & Conditions governed by the laws of ${profile.governingLaw}, adapted to ${profile.dataPrivacy.framework}. If you do not agree, do not use the Service.`,
    },
    {
      id: "service-description",
      title: "2. Description of Service",
      body: "CivicLens is a global community intelligence platform for civic reporting, positive community signals, place-based insights, and community-verified mapping. It is NOT an official government reporting channel.",
    },
    {
      id: "ugc-disclaimer",
      title: "3. User-Generated Content Disclaimer",
      body: CIVICLENS_CORE_DISCLAIMERS.join(" "),
    },
    {
      id: "user-responsibilities",
      title: "4. User Responsibilities",
      body: `You must submit good-faith reports only. Defamation risk in your jurisdiction is classified as ${profile.contentLiability.defamationRiskLevel}. ${profile.contentLiability.userResponsibilityModel} Do not submit false accusations, spam, hate speech, or content violating ${profile.contentModeration.hateSpeechLevel} moderation standards.`,
    },
    {
      id: "location",
      title: "5. Location Data",
      body: profile.geoLocation.trackingConsentRequired
        ? `Location tracking requires your consent under ${profile.dataPrivacy.framework}. ${profile.geoLocation.sensitiveLocationRestrictions}`
        : `Location data is used to place reports on the map. ${profile.geoLocation.sensitiveLocationRestrictions}`,
    },
    {
      id: "verification",
      title: "6. Community Verification System",
      body: "Reports pass through private → community seed (3+ confirmations) → verified (10+ confirmations) stages. Resolution reports require community verification. CivicLens does not guarantee accuracy at any stage.",
    },
    {
      id: "sensitive-reporting",
      title: "7. Sensitive Reporting (Corruption & Governance)",
      body: profile.contentModeration.politicalContentHandling +
        " Categories including corruption, harassment points, and governance issues receive enhanced AI legal review and may be held under review before public visibility.",
    },
    {
      id: "intellectual-property",
      title: "8. Intellectual Property",
      body: "You retain ownership of content you submit but grant CivicLens a worldwide, non-exclusive license to display, store, analyse, and aggregate your contributions for operating the Service.",
    },
    {
      id: "limitation",
      title: "9. Limitation of Liability",
      body: `CivicLens is provided "as is." ${profile.contentLiability.platformLiabilityModel} We are not liable for decisions made based on community data, map inaccuracies, or third-party services.`,
    },
    {
      id: "disputes",
      title: "10. Dispute & Removal Policy",
      body: profile.disputeProcess +
        " Users may report content as false. Businesses may challenge reports. High legal-risk content is flagged and withheld from verified visibility pending review.",
    },
    {
      id: "termination",
      title: "11. Termination",
      body: "We may suspend accounts violating these terms. You may request account and data deletion as described in our Privacy Policy.",
    },
    {
      id: "changes",
      title: "12. Changes to Terms",
      body: "We may update these terms. Material changes will be communicated. Continued use after notice constitutes acceptance of the updated version.",
    },
    {
      id: "contact",
      title: "13. Contact",
      body: "Legal inquiries: legal@civiclens.app",
    },
    ...businessClauses(profile, role),
  ];

  return {
    type: "terms",
    title: `Terms & Conditions — ${country}`,
    version: LEGAL_DOCUMENT_VERSION,
    lastUpdated: "July 6, 2026",
    country,
    legalProfile: profile.id,
    jurisdictionNote: `Adapted for ${profile.name} (${profile.dataPrivacy.framework})`,
    sections,
  };
}
