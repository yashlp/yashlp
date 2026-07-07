"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { SITE_SETTING_KEYS } from "@/lib/site-setting-keys";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings ?? {}));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-900">Demo & visibility</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm text-stone-700">Show demo mode banner</span>
            <input
              type="checkbox"
              checked={settings[SITE_SETTING_KEYS.DEMO_MODE] === "true"}
              onChange={(e) => set(SITE_SETTING_KEYS.DEMO_MODE, e.target.checked ? "true" : "false")}
              className="h-4 w-4 rounded border-orange-300 text-orange-600"
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm text-stone-700">Maintenance mode (blocks public site)</span>
            <input
              type="checkbox"
              checked={settings[SITE_SETTING_KEYS.MAINTENANCE_MODE] === "true"}
              onChange={(e) =>
                set(SITE_SETTING_KEYS.MAINTENANCE_MODE, e.target.checked ? "true" : "false")
              }
              className="h-4 w-4 rounded border-orange-300 text-orange-600"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-900">Announcement bar</h2>
        <p className="mt-1 text-xs text-stone-400">Leave empty to hide. Shown below the header.</p>
        <textarea
          value={settings[SITE_SETTING_KEYS.ANNOUNCEMENT] ?? ""}
          onChange={(e) => set(SITE_SETTING_KEYS.ANNOUNCEMENT, e.target.value)}
          rows={2}
          placeholder="e.g. Demo site — sample Mumbai data"
          className="input-field mt-3 w-full resize-none"
        />
      </div>

      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-900">Default map center</h2>
        <p className="mt-1 text-xs text-stone-400">Used when geolocation is unavailable</p>
        <div className="mt-3 flex gap-3">
          <input
            type="text"
            value={settings[SITE_SETTING_KEYS.DEFAULT_MAP_LAT] ?? ""}
            onChange={(e) => set(SITE_SETTING_KEYS.DEFAULT_MAP_LAT, e.target.value)}
            placeholder="Latitude"
            className="input-field flex-1"
          />
          <input
            type="text"
            value={settings[SITE_SETTING_KEYS.DEFAULT_MAP_LNG] ?? ""}
            onChange={(e) => set(SITE_SETTING_KEYS.DEFAULT_MAP_LNG, e.target.value)}
            placeholder="Longitude"
            className="input-field flex-1"
          />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving…" : saved ? "Saved!" : "Save settings"}
      </button>
    </div>
  );
}
