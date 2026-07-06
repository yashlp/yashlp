import { headers } from "next/headers";
import {
  buildLegalPackage,
  detectCountry,
  getIpCountryFromHeaders,
} from "@/lib/legal-engine";
import { LegalDocumentView } from "@/components/legal-document-view";

export const metadata = {
  title: "Privacy Policy — CivicLens",
};

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const params = await searchParams;
  const hdrs = await headers();
  const detection = detectCountry({
    ipCountryHeader: getIpCountryFromHeaders(hdrs),
    deviceCountry: params.country,
    acceptLanguage: hdrs.get("accept-language"),
  });

  const { docs } = buildLegalPackage(
    detection.legalProfile,
    detection.countryCode === "INT" ? "US" : detection.countryCode
  );

  return <LegalDocumentView document={docs.privacy} />;
}
