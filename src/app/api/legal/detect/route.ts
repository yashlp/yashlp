import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSessionUser } from "@/lib/auth";
import { detectCountry, getIpCountryFromHeaders } from "@/lib/legal-engine";

export async function GET(req: Request) {
  const hdrs = await headers();
  const { searchParams } = new URL(req.url);
  const user = await getSessionUser();

  const detection = detectCountry({
    ipCountryHeader: getIpCountryFromHeaders(hdrs),
    deviceCountry: searchParams.get("country"),
    profileCountry: user?.countryCode ?? searchParams.get("profileCountry"),
    phone: user?.phone,
    acceptLanguage: hdrs.get("accept-language"),
  });

  return NextResponse.json(detection);
}
