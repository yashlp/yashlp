import { NextRequest, NextResponse } from "next/server";
import { commerceApiError } from "@/lib/commerce/api-utils";
import { contentService } from "@/lib/commerce/services/content.service";
import { DEFAULT_POLICY_CONTENT } from "@/lib/aesthetics/policy-content";

type Props = { params: Promise<{ key: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { key } = await params;
    const fallback = DEFAULT_POLICY_CONTENT[key];
    const row = await contentService.getByKey(key);

    if (row?.isPublished && (row.body || row.title)) {
      return NextResponse.json({
        key,
        title: row.title || fallback?.title || key,
        body: row.body || fallback?.body || "",
      });
    }

    if (fallback) {
      return NextResponse.json({ key, title: fallback.title, body: fallback.body });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return commerceApiError(error);
  }
}
