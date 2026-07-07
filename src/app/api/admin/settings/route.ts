import { NextResponse } from "next/server";
import { z } from "zod";
import { adminErrorResponse, requireAdmin } from "@/lib/admin";
import { getAllSiteSettings, setSiteSetting } from "@/lib/site-settings";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getAllSiteSettings();
    return NextResponse.json({ settings });
  } catch (e) {
    return adminErrorResponse(e);
  }
}

const patchSchema = z.record(z.string(), z.string().max(2000));

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = patchSchema.parse(await req.json());

    for (const [key, value] of Object.entries(body)) {
      await setSiteSetting(key, value, admin.id);
    }

    const settings = await getAllSiteSettings();
    return NextResponse.json({ settings });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    return adminErrorResponse(e);
  }
}
