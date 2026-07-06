import type { InstitutionType } from "./types";

export const INSTITUTION_LABELS: Record<InstitutionType, string> = {
  government_office: "Government Office",
  police_station: "Police Station",
  rto_office: "RTO Office",
  municipality: "Municipality Department",
  public_hospital: "Public Hospital",
  transport_office: "Transport Office",
  passport_office: "Passport Office",
  licensing_desk: "Licensing Desk",
  other_public_service: "Public Service Location",
};

export const CORRUPTION_ISSUE_LABELS: Record<string, string> = {
  bribery_allegation: "service irregularity allegations",
  service_delay: "service delay reports",
  misconduct_pattern: "misconduct pattern reports",
  irregular_practices: "irregular practice reports",
};

export function getInstitutionLabel(type?: string): string {
  if (!type) return "Public Service Location";
  return INSTITUTION_LABELS[type as InstitutionType] ?? type.replace(/_/g, " ");
}

export function inferInstitutionFromText(text: string): InstitutionType | null {
  const lower = text.toLowerCase();
  if (/\brto\b|regional transport/i.test(lower)) return "rto_office";
  if (/\bpolice\b|than[ae]\b/i.test(lower)) return "police_station";
  if (/\bhospital\b|clinic\b/i.test(lower)) return "public_hospital";
  if (/\bmunicipal|corporation\b|ward office/i.test(lower)) return "municipality";
  if (/\bpassport\b/i.test(lower)) return "passport_office";
  if (/\btransport\b|bus depot|railway station office/i.test(lower)) return "transport_office";
  if (/\blicensing\b|permit desk/i.test(lower)) return "licensing_desk";
  if (/\bgovernment office|govt office|sarkari/i.test(lower)) return "government_office";
  return null;
}
