"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

export default function NotificationsPage() {
  const [form, setForm] = useState({
    slackWebhook: "",
    whatsapp: false,
    email: true,
    push: false,
    lowStock: true,
    newOrder: true,
    failedPayment: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) =>
        setForm({
          slackWebhook: d.channels?.slackWebhook || "",
          whatsapp: Boolean(d.channels?.whatsapp),
          email: d.channels?.email !== false,
          push: Boolean(d.channels?.push),
          lowStock: d.triggers?.lowStock !== false,
          newOrder: d.triggers?.newOrder !== false,
          failedPayment: d.triggers?.failedPayment !== false,
        })
      );
  }, []);

  async function save() {
    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Notifications</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Slack · WhatsApp · Email · Push</p>

      <Card className="mt-8 space-y-4" hover={false}>
        <div>
          <p className="text-sm font-medium">Slack webhook URL</p>
          <Input
            className="mt-1"
            value={form.slackWebhook}
            onChange={(e) => setForm({ ...form, slackWebhook: e.target.value })}
            placeholder="https://hooks.slack.com/..."
          />
        </div>
        {(
          [
            ["whatsapp", "WhatsApp alerts"],
            ["email", "Email alerts"],
            ["push", "Push notifications"],
            ["lowStock", "Notify on low stock"],
            ["newOrder", "Notify on new order"],
            ["failedPayment", "Notify on failed payment"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
        <div className="flex items-center gap-3">
          <Button onClick={save}>Save notification settings</Button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>
        <p className="text-xs text-[var(--aes-dusty)]">
          Channels are stored in settings. Wire delivery providers (Slack webhook, WhatsApp Business API, FCM) in
          production env to send live alerts from the Action Center.
        </p>
      </Card>
    </div>
  );
}
