import { getCountryName } from "./legal-engine/legalProfiles";

/** Countries supported in location search (ISO 3166-1 alpha-2) */
export const SEARCH_COUNTRIES = [
  "IN",
  "US",
  "GB",
  "CA",
  "AU",
  "DE",
  "FR",
  "JP",
  "BR",
  "NG",
  "AE",
  "SG",
  "ZA",
  "MX",
  "IT",
  "ES",
  "NL",
  "SE",
  "NZ",
  "IE",
  "PL",
  "PT",
  "BE",
  "AT",
  "CH",
  "KR",
  "TH",
  "MY",
  "PH",
  "ID",
  "PK",
  "BD",
  "LK",
  "KE",
  "EG",
  "SA",
  "QA",
  "INT",
] as const;

export type SearchCountryCode = (typeof SEARCH_COUNTRIES)[number];

export function countrySelectOptions() {
  return SEARCH_COUNTRIES.map((code) => ({
    code,
    name: code === "INT" ? "International (no country filter)" : getCountryName(code),
  }));
}

export function isValidSearchCountry(code: string): code is SearchCountryCode {
  return (SEARCH_COUNTRIES as readonly string[]).includes(code.toUpperCase());
}

/** Pincode / postal patterns by country */
export function looksLikePincode(query: string, countryCode: string): boolean {
  const q = query.trim();
  const c = countryCode.toUpperCase();
  if (c === "IN") return /^\d{6}$/.test(q);
  if (c === "US") return /^\d{5}(-\d{4})?$/.test(q);
  if (c === "GB") return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(q);
  if (c === "CA") return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(q);
  if (c === "AU") return /^\d{4}$/.test(q);
  if (c === "DE" || c === "FR" || c === "ES" || c === "IT") return /^\d{4,5}$/.test(q);
  if (c === "BR") return /^\d{5}-?\d{3}$/.test(q);
  return /^\d{4,6}$/.test(q);
}
