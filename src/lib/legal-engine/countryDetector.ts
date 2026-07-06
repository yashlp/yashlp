import type { CountryDetectionResult } from "./types";
import { getCountryName, resolveProfileForCountry } from "./legalProfiles";

const PHONE_PREFIX_TO_COUNTRY: Record<string, string> = {
  "91": "IN",
  "44": "GB",
  "1": "US",
  "61": "AU",
  "64": "NZ",
  "49": "DE",
  "33": "FR",
  "39": "IT",
  "34": "ES",
  "31": "NL",
  "32": "BE",
  "43": "AT",
  "48": "PL",
  "46": "SE",
  "353": "IE",
  "351": "PT",
  "358": "FI",
  "45": "DK",
  "81": "JP",
  "55": "BR",
  "234": "NG",
};

export function inferCountryFromPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  for (const len of [3, 2, 1]) {
    const prefix = digits.slice(0, len);
    if (PHONE_PREFIX_TO_COUNTRY[prefix]) return PHONE_PREFIX_TO_COUNTRY[prefix];
  }
  return null;
}

export function inferCountryFromAcceptLanguage(header?: string | null): string | null {
  if (!header) return null;
  const match = header.match(/^[a-z]{2}-([A-Z]{2})/i) ?? header.match(/,([a-z]{2}-([A-Z]{2}))/i);
  if (match) {
    const part = (match[2] ?? match[1]).toUpperCase();
    if (part.length === 2) return part;
  }
  return null;
}

export type DetectionInput = {
  ipCountryHeader?: string | null;
  deviceCountry?: string | null;
  profileCountry?: string | null;
  phone?: string | null;
  acceptLanguage?: string | null;
};

export function detectCountry(input: DetectionInput): CountryDetectionResult {
  const ipCode = input.ipCountryHeader?.trim().toUpperCase();
  if (ipCode && ipCode.length === 2 && ipCode !== "XX" && ipCode !== "T1") {
    const legalProfile = resolveProfileForCountry(ipCode);
    return {
      country: getCountryName(ipCode),
      countryCode: ipCode,
      region: getLegalProfileRegion(legalProfile),
      legalProfile,
      detectionSource: "ip",
    };
  }

  const deviceCode = input.deviceCountry?.trim().toUpperCase();
  if (deviceCode && deviceCode.length === 2) {
    const legalProfile = resolveProfileForCountry(deviceCode);
    return {
      country: getCountryName(deviceCode),
      countryCode: deviceCode,
      region: getLegalProfileRegion(legalProfile),
      legalProfile,
      detectionSource: "device",
    };
  }

  const profileCode = input.profileCountry?.trim().toUpperCase();
  if (profileCode && profileCode.length === 2) {
    const legalProfile = resolveProfileForCountry(profileCode);
    return {
      country: getCountryName(profileCode),
      countryCode: profileCode,
      region: getLegalProfileRegion(legalProfile),
      legalProfile,
      detectionSource: "profile",
    };
  }

  const phoneCode = inferCountryFromPhone(input.phone);
  if (phoneCode) {
    const legalProfile = resolveProfileForCountry(phoneCode);
    return {
      country: getCountryName(phoneCode),
      countryCode: phoneCode,
      region: getLegalProfileRegion(legalProfile),
      legalProfile,
      detectionSource: "phone",
    };
  }

  const langCode = inferCountryFromAcceptLanguage(input.acceptLanguage);
  if (langCode) {
    const legalProfile = resolveProfileForCountry(langCode);
    return {
      country: getCountryName(langCode),
      countryCode: langCode,
      region: getLegalProfileRegion(legalProfile),
      legalProfile,
      detectionSource: "device",
    };
  }

  return {
    country: "International",
    countryCode: "INT",
    region: "International",
    legalProfile: "GLOBAL_DEFAULT",
    detectionSource: "fallback",
  };
}

function getLegalProfileRegion(profileId: string): string {
  const regions: Record<string, string> = {
    IN_STANDARD: "Asia",
    UK_GDPR: "Europe",
    EU_GDPR_STRICT: "Europe",
    US_CDA_SAFE_HARBOR: "North America",
    CA_PIPEDA: "North America",
    AU_PRIVACY_ACT: "Oceania",
    GLOBAL_DEFAULT: "International",
  };
  return regions[profileId] ?? "International";
}

export function getIpCountryFromHeaders(headers: Headers): string | null {
  return (
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code") ??
    headers.get("x-appengine-country") ??
    null
  );
}
