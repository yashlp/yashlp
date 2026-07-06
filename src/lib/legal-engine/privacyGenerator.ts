import type { LegalDocument, LegalProfile } from "./types";
import { LEGAL_DOCUMENT_VERSION } from "./legalProfiles";
import { getCountryName } from "./legalProfiles";

export function generatePrivacyPolicy(
  profile: LegalProfile,
  countryCode: string
): LegalDocument {
  const country = getCountryName(countryCode);
  const dp = profile.dataPrivacy;

  return {
    type: "privacy",
    title: `Privacy Policy — ${country}`,
    version: LEGAL_DOCUMENT_VERSION,
    lastUpdated: "July 6, 2026",
    country,
    legalProfile: profile.id,
    jurisdictionNote: `Compliant with ${dp.framework}`,
    sections: [
      {
        id: "overview",
        title: "1. Overview",
        body: `CivicLens ("we") processes personal data in accordance with ${dp.framework} for users in ${country}. This policy explains what we collect, why, and your rights.`,
      },
      {
        id: "data-collected",
        title: "2. Data We Collect",
        body: "Account information (phone number, name), location data (GPS coordinates with reports), user-generated content (reports, photos, comments), device and usage data, and legal acceptance records including country and terms version.",
      },
      {
        id: "legal-basis",
        title: "3. Legal Basis & Consent",
        body: dp.consentRequired
          ? "We rely on your explicit consent for location tracking, content submission, and cross-border processing where required. You may withdraw consent through account settings or by contacting us."
          : "We process data based on consent, contractual necessity, and legitimate interests in operating a community platform, subject to applicable opt-out rights.",
      },
      {
        id: "storage",
        title: "4. Data Storage & Retention",
        body: `${dp.storageRules} Standard retention: up to ${dp.dataRetentionDays} days unless longer retention is required by law or for active disputes. Daily-use category pins expire after 30 days.`,
      },
      {
        id: "cross-border",
        title: "5. Cross-Border Transfers",
        body: dp.crossBorderTransfer,
      },
      {
        id: "rights",
        title: "6. Your Rights",
        body: dp.rightToDelete
          ? "You have the right to access, correct, export, and delete your personal data. Submit requests to privacy@civiclens.app. We respond within applicable statutory timelines."
          : "You may request access to and correction of your personal data by contacting privacy@civiclens.app.",
      },
      {
        id: "dpo",
        title: "7. Data Protection Contact",
        body: dp.dpoRequired
          ? "A Data Protection Officer can be reached at dpo@civiclens.app for GDPR/UK GDPR related inquiries."
          : "Privacy inquiries: privacy@civiclens.app",
      },
      {
        id: "children",
        title: "8. Children's Privacy",
        body: "CivicLens is not intended for users under 13. We do not knowingly collect data from children.",
      },
      {
        id: "security",
        title: "9. Security",
        body: "We implement technical and organisational measures to protect your data. No system is 100% secure; report concerns to security@civiclens.app.",
      },
      {
        id: "changes",
        title: "10. Policy Changes",
        body: "We may update this policy. Material changes will be notified through the app with an opportunity to review.",
      },
    ],
  };
}
