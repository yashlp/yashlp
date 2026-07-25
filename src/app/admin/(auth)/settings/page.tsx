"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

const TEXT_FIELDS = [
  { key: "site_name", label: "Store display name (shown to customers)", group: "general" },
  { key: "company_name", label: "Company / legal name", group: "company" },
  { key: "site_url", label: "Website URL (update after you buy a domain)", group: "general" },
  { key: "company_gst", label: "GST number", group: "tax" },
  { key: "company_address", label: "Business address", group: "company" },
  { key: "support_email", label: "Customer care email (orders, contact & refunds)", group: "contact" },
  { key: "support_phone", label: "Support phone", group: "contact" },
  { key: "gst_rate", label: "GST rate (%)", group: "tax" },
  { key: "razorpay_enabled", label: "Razorpay enabled (true/false)", group: "payments" },
  { key: "cod_enabled", label: "COD enabled (true/false)", group: "payments" },
  { key: "bank_account_name", label: "Bank account name", group: "bank" },
  { key: "bank_account_number", label: "Bank account number", group: "bank" },
  { key: "bank_ifsc", label: "IFSC code", group: "bank" },
  { key: "whatsapp_number", label: "WhatsApp notifications number", group: "notifications" },
  { key: "order_confirmation_email", label: "Order confirmation email template", group: "email" },
  { key: "shipping_notification_email", label: "Shipping notification email template", group: "email" },
];

function isTruthy(value: string | undefined) {
  return ["true", "1", "yes", "on"].includes((value || "").trim().toLowerCase());
}

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, string> = {};
        for (const s of d.settings || []) map[s.key] = s.value;
        if (!map.shipping_flat_rate) map.shipping_flat_rate = "49";
        if (!map.free_shipping_threshold) map.free_shipping_threshold = "999";
        if (!map.free_delivery_enabled) map.free_delivery_enabled = "false";
        if (!map.gst_rate) map.gst_rate = "18";
        setValues(map);
      });
  }, []);

  const alwaysFree = isTruthy(values.free_delivery_enabled);

  async function save() {
    setSaving(true);
    const shippingEntries = [
      { key: "shipping_flat_rate", value: values.shipping_flat_rate || "0", group: "shipping" },
      { key: "free_shipping_threshold", value: values.free_shipping_threshold || "0", group: "shipping" },
      { key: "free_delivery_enabled", value: alwaysFree ? "true" : "false", group: "shipping" },
    ];

    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: [
          ...shippingEntries,
          ...TEXT_FIELDS.map((d) => ({
            key: d.key,
            value: values[d.key] || "",
            group: d.group,
          })),
        ],
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Settings</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Brand name, customer contact email, delivery charges, GST, payments — editable anytime (including after you buy a domain)
      </p>

      <Card className="mt-8 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-[var(--aes-ink)]">Delivery & shipping</h2>
          <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
            These rates apply immediately on the storefront checkout.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--aes-border)] p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={alwaysFree}
            onChange={(e) =>
              setValues({ ...values, free_delivery_enabled: e.target.checked ? "true" : "false" })
            }
          />
          <span>
            <span className="block text-sm font-semibold text-[var(--aes-ink)]">Free delivery for everyone</span>
            <span className="mt-1 block text-xs text-[var(--aes-charcoal-muted)]">
              When on, all orders ship free. Flat fee and free-above threshold are ignored.
            </span>
          </span>
        </label>

        <div className={alwaysFree ? "pointer-events-none opacity-45" : ""}>
          <label className="aes-mono mb-1 block text-[10px] uppercase text-[var(--aes-dusty)]">
            Delivery charge (₹)
          </label>
          <Input
            type="number"
            min={0}
            step={1}
            value={values.shipping_flat_rate || ""}
            onChange={(e) => setValues({ ...values, shipping_flat_rate: e.target.value })}
            disabled={alwaysFree}
          />
          <p className="mt-1 text-xs text-[var(--aes-charcoal-muted)]">
            Charged when the cart is below the free-delivery threshold.
          </p>
        </div>

        <div className={alwaysFree ? "pointer-events-none opacity-45" : ""}>
          <label className="aes-mono mb-1 block text-[10px] uppercase text-[var(--aes-dusty)]">
            Free delivery above (₹)
          </label>
          <Input
            type="number"
            min={0}
            step={1}
            value={values.free_shipping_threshold || ""}
            onChange={(e) => setValues({ ...values, free_shipping_threshold: e.target.value })}
            disabled={alwaysFree}
          />
          <p className="mt-1 text-xs text-[var(--aes-charcoal-muted)]">
            Set to 0 to disable threshold-based free delivery (only the flat fee applies).
          </p>
        </div>

        <div className="rounded-xl bg-[var(--aes-sand)] p-4 text-sm text-[var(--aes-ink)]">
          <p className="font-medium">Current checkout behaviour</p>
          {alwaysFree ? (
            <p className="mt-1 text-[var(--aes-charcoal-muted)]">All customers get free delivery.</p>
          ) : (
            <p className="mt-1 text-[var(--aes-charcoal-muted)]">
              ₹{Number(values.shipping_flat_rate || 0)} delivery
              {Number(values.free_shipping_threshold || 0) > 0
                ? ` · free above ₹${Number(values.free_shipping_threshold || 0)}`
                : " · no free-above threshold"}
            </p>
          )}
        </div>
      </Card>

      <Card className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--aes-ink)]">Brand & customer contact</h2>
        <p className="text-sm text-[var(--aes-charcoal-muted)]">
          Support email appears in the footer, policies, and order emails. Change it here anytime —
          redeploys will not overwrite your saved values.
        </p>
        {TEXT_FIELDS.map((d) => (
          <div key={d.key}>
            <label className="aes-mono mb-1 block text-[10px] uppercase text-[var(--aes-dusty)]">{d.label}</label>
            <Input
              value={values[d.key] || ""}
              onChange={(e) => setValues({ ...values, [d.key]: e.target.value })}
            />
          </div>
        ))}
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
        {saved && <p className="text-sm text-green-600">Settings saved — storefront and emails will use the new values.</p>}
      </Card>
    </div>
  );
}
