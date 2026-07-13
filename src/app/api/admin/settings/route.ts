import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/lib/commerce/services/content.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";
import { z } from "zod";

const schema = z.object({
  settings: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      group: z.string().optional(),
    })
  ),
});

export async function GET() {
  try {
    const settings = await withAdminAuth("settings:read", () => settingsService.list());
    return NextResponse.json({ settings });
  } catch (error) {
    return commerceApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const settings = await withAdminAuth("settings:write", (admin) =>
      settingsService.upsertMany(body.settings, admin.id)
    );
    return NextResponse.json({ settings });
  } catch (error) {
    return commerceApiError(error);
  }
}
