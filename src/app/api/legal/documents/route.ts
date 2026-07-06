import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSessionUser } from "@/lib/auth";
import {
  buildLegalPackage,
  detectCountry,
  getIpCountryFromHeaders,
} from "@/lib/legal-engine";
import type { UserRole } from "@/lib/legal-engine";

export async function GET(req: Request) {
  const hdrs = await headers();
  const { searchParams } = new URL(req.url);
  const user = await getSessionUser();

  const detection = detectCountry({
    ipCountryHeader: getIpCountryFromHeaders(hdrs),
    deviceCountry: searchParams.get("country"),
    profileCountry: user?.countryCode ?? undefined,
    phone: user?.phone,
    acceptLanguage: hdrs.get("accept-language"),
  });

  const role = (searchParams.get("role") as UserRole) ?? "user";
  const countryCode =
    detection.countryCode === "INT"
      ? (searchParams.get("country")?.toUpperCase() ?? "US")
      : detection.countryCode;

  const { profile, docs } = buildLegalPackage(detection.legalProfile, countryCode, role);

  return NextResponse.json({
    detection,
    profile: {
      id: profile.id,
      name: profile.name,
      region: profile.region,
      governingLaw: profile.governingLaw,
      dataPrivacy: profile.dataPrivacy,
      contentLiability: profile.contentLiability,
      geoLocation: profile.geoLocation,
      contentModeration: profile.contentModeration,
    },
    documents: docs,
  });
}
