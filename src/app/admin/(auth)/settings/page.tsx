"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

const DEFAULTS = [
  { key: "company_name", label: "Company name", group: "company" },
  { key: "company_gst", label: "GST number", group: "tax" },
  { key: "company_address", label: "Business address", group: "company" },
  { key: "support_email", label: "Support email", group: "contact" },
  { key: "support_phone", label: "Support phone", group: "contact" },
  { key: "shipping_flat_rate", label: "Shipping fee (₹)", group: "shipping" },
  { key: "free_shipping_threshold", label: "Free shipping above (₹)", group: "shipping" },
  { key: "gst_rate", label: "GST rate (%)", group: "tax" },
  { key: "razorpay_enabled", label: "Razorpay enabled (true/false)", group: "payments" },
  { key: "cod_enabled", label: "COD enabled (true/false)", group: "payments" },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => {
      const map: Record<string, string> = {};
      for (const s of d.settings || []) map[s.key] = s.value;
      setValues(map);
    });
  }, []);

  async function save() {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: DEFAULTS.map((d) => ({
          key: d.key,
          value: values[d.key] || "",
          group: d.group,
        })),
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Settings</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">GST, shipping, payments, and business details</p>

      <Card className="mt-8 space-y-4">
        {DEFAULTS.map((d) => (
          <div key={d.key}>
            <label className="aes-mono mb-1 block text-[10px] uppercase text-[var(--aes-dusty)]">{d.label}</label>
            <Input
              value={values[d.key] || ""}
              onChange={(e) => setValues({ ...values, [d.key]: e.target.value })}
            />
          </div>
        ))}
        <Button onClick={save}>Save settings</Button>
        {saved && <p className="text-sm text-green-600">Settings saved</p>}
      </Card>
    </div>
  );
}
