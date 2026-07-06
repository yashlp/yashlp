import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitResponse } from "@/lib/api-security";
import { processCompliance } from "@/lib/compliance";

const schema = z.object({
  categorySlug: z.string(),
  description: z.string().optional(),
  title: z.string().optional(),
  institutionType: z.string().optional(),
  servicePoint: z.string().optional(),
  corruptionIssueType: z.string().optional(),
});

/** Preview compliance processing before submit */
export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "compliance-preview", 30, 60 * 1000);
  if (limited) return limited;

  const data = schema.parse(await req.json());
  const result = processCompliance({
    categorySlug: data.categorySlug,
    title: data.title,
    description: data.description,
    institutionType: data.institutionType,
    servicePoint: data.servicePoint,
    corruptionIssueType: data.corruptionIssueType,
  });
  return NextResponse.json({ compliance: result });
}
