"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { SITE_SETTING_KEYS } from "@/lib/site-setting-keys";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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

  const saveAdminPassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordSaving(true);
    setPasswordSaved(false);
    setPasswordError("");
    const res = await fetch("/api/admin/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: currentPassword || undefined,
        newPassword,
      }),
    });
    const data = await res.json();
    setPasswordSaving(false);
    if (!res.ok) {
      setPasswordError(data.error ?? "Could not update admin password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
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
        <h2 className="font-semibold text-stone-900">Contact email</h2>
        <p className="mt-1 text-xs text-stone-400">
          Shown on Profile so customers can email you about issues or account help.
        </p>
        <input
          type="email"
          value={settings[SITE_SETTING_KEYS.CONTACT_EMAIL] ?? ""}
          onChange={(e) => set(SITE_SETTING_KEYS.CONTACT_EMAIL, e.target.value)}
          placeholder="support@yourdomain.com"
          className="input-field mt-3 w-full"
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

      <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-stone-900">Admin password</h2>
        <p className="mt-1 text-xs text-stone-500">
          Rotate your admin password regularly. Use at least 12 characters with letters, numbers, and symbols.
        </p>
        <div className="mt-3 space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="input-field w-full"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="input-field w-full"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="input-field w-full"
          />
          {passwordError && <p className="text-sm text-rose-600">{passwordError}</p>}
          <button
            onClick={saveAdminPassword}
            disabled={passwordSaving || newPassword.length < 12 || confirmPassword.length < 12}
            className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : passwordSaved ? "Password updated" : "Update admin password"}
          </button>
        </div>
      </div>
    </div>
  );
}
