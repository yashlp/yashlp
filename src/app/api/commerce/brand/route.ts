import { NextResponse } from "next/server";
import { getBrandSettings } from "@/lib/commerce/brand-settings";

export async function GET() {
  try {
    const brand = await getBrandSettings();
    return NextResponse.json({ brand });
  } catch {
    return NextResponse.json({
      brand: {
        siteName: "Only Aesthetic",
        companyName: "Only Aesthetic",
        supportEmail: "yash.shah.lp2@gmail.com",
        supportPhone: "",
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://onlyaesthetic.in",
      },
    });
  }
}
