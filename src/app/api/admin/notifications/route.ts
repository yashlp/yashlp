import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { settingsService } from "@/lib/commerce/services/content.service";
import { commerceApiError, withAdminAuth } from "@/lib/commerce/api-utils";

const KEYS = [
  "notify_slack_webhook",
  "notify_whatsapp_enabled",
  "notify_email_enabled",
  "notify_push_enabled",
  "notify_on_low_stock",
  "notify_on_new_order",
  "notify_on_failed_payment",
] as const;

export async function GET() {
  try {
    const settings = await withAdminAuth("settings:read", () => settingsService.list("notifications"));
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json({
      channels: {
        slackWebhook: map.notify_slack_webhook || "",
        whatsapp: map.notify_whatsapp_enabled === "true",
        email: map.notify_email_enabled !== "false",
        push: map.notify_push_enabled === "true",
      },
      triggers: {
        lowStock: map.notify_on_low_stock !== "false",
        newOrder: map.notify_on_new_order !== "false",
        failedPayment: map.notify_on_failed_payment !== "false",
      },
    });
  } catch (error) {
    return commerceApiError(error);
  }
}

const schema = z.object({
  slackWebhook: z.string().optional(),
  whatsapp: z.boolean().optional(),
  email: z.boolean().optional(),
  push: z.boolean().optional(),
  lowStock: z.boolean().optional(),
  newOrder: z.boolean().optional(),
  failedPayment: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const entries: { key: string; value: string; group: string }[] = [];
    if (body.slackWebhook !== undefined)
      entries.push({ key: "notify_slack_webhook", value: body.slackWebhook, group: "notifications" });
    if (body.whatsapp !== undefined)
      entries.push({
        key: "notify_whatsapp_enabled",
        value: String(body.whatsapp),
        group: "notifications",
      });
    if (body.email !== undefined)
      entries.push({
        key: "notify_email_enabled",
        value: String(body.email),
        group: "notifications",
      });
    if (body.push !== undefined)
      entries.push({
        key: "notify_push_enabled",
        value: String(body.push),
        group: "notifications",
      });
    if (body.lowStock !== undefined)
      entries.push({
        key: "notify_on_low_stock",
        value: String(body.lowStock),
        group: "notifications",
      });
    if (body.newOrder !== undefined)
      entries.push({
        key: "notify_on_new_order",
        value: String(body.newOrder),
        group: "notifications",
      });
    if (body.failedPayment !== undefined)
      entries.push({
        key: "notify_on_failed_payment",
        value: String(body.failedPayment),
        group: "notifications",
      });

    await withAdminAuth("settings:write", () => settingsService.upsertMany(entries));
    void KEYS;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return commerceApiError(error);
  }
}
