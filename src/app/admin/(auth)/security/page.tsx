"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

export default function SecurityPage() {
  const [data, setData] = useState<{
    admin: {
      email: string;
      mfaEnabled: boolean;
      ipWhitelist: string | null;
      sessionTimeoutMins: number;
      lastLoginAt: string | null;
      lastLoginIp: string | null;
      hasBackupCodes: boolean;
    };
    sessions: {
      id: string;
      userAgent: string | null;
      ipAddress: string | null;
      deviceLabel: string | null;
      createdAt: string;
    }[];
    loginHistory: {
      id: string;
      success: boolean;
      ipAddress: string | null;
      reason: string | null;
      createdAt: string;
    }[];
  } | null>(null);
  const [ipText, setIpText] = useState("");
  const [timeoutMins, setTimeoutMins] = useState("720");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [message, setMessage] = useState("");

  function load() {
    fetch("/api/admin/security")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.admin) {
          try {
            const list = d.admin.ipWhitelist ? JSON.parse(d.admin.ipWhitelist) : [];
            setIpText(Array.isArray(list) ? list.join(", ") : "");
          } catch {
            setIpText("");
          }
          setTimeoutMins(String(d.admin.sessionTimeoutMins || 720));
        }
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function run(action: string, extra: Record<string, unknown> = {}) {
    const res = await fetch("/api/admin/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const json = await res.json();
    setMessage(json.message || (res.ok ? "Updated" : json.error));
    if (json.backupCodes) setBackupCodes(json.backupCodes);
    load();
  }

  if (!data?.admin) return <div className="aes-skeleton h-40 rounded-2xl" />;

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Security</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Super Admin controls — 2FA, sessions, devices, IP allowlist
      </p>
      {message && <p className="mt-4 text-sm text-[var(--aes-royal)]">{message}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Two-factor authentication (2FA)</h2>
          <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">
            Status: {data.admin.mfaEnabled ? "Enabled (email OTP)" : "Disabled"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {!data.admin.mfaEnabled ? (
              <Button onClick={() => run("enable_mfa")}>Enable MFA</Button>
            ) : (
              <Button variant="secondary" onClick={() => run("disable_mfa")}>
                Disable MFA
              </Button>
            )}
            <Button variant="secondary" onClick={() => run("generate_backup_codes")}>
              Generate backup codes
            </Button>
          </div>
          {backupCodes && (
            <div className="mt-4 rounded-xl bg-[var(--aes-ivory)] p-4 font-mono text-sm">
              {backupCodes.map((c) => (
                <div key={c}>{c}</div>
              ))}
            </div>
          )}
          {data.admin.hasBackupCodes && !backupCodes && (
            <p className="mt-2 text-xs text-[var(--aes-dusty)]">Backup codes already generated.</p>
          )}
        </Card>

        <Card hover={false}>
          <h2 className="font-semibold">IP whitelist (optional)</h2>
          <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">Comma-separated IPs. Empty = allow all.</p>
          <Input className="mt-3" value={ipText} onChange={(e) => setIpText(e.target.value)} placeholder="1.2.3.4, 5.6.7.8" />
          <Button
            className="mt-3"
            onClick={() =>
              run("set_ip_whitelist", {
                ipWhitelist: ipText
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          >
            Save whitelist
          </Button>
        </Card>

        <Card hover={false}>
          <h2 className="font-semibold">Session timeout</h2>
          <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">Minutes until idle sessions expire (policy flag).</p>
          <Input className="mt-3" type="number" value={timeoutMins} onChange={(e) => setTimeoutMins(e.target.value)} />
          <Button
            className="mt-3"
            onClick={() => run("set_session_timeout", { sessionTimeoutMins: Number(timeoutMins) })}
          >
            Save timeout
          </Button>
          <p className="mt-3 text-xs text-[var(--aes-dusty)]">
            Last login: {data.admin.lastLoginAt ? new Date(data.admin.lastLoginAt).toLocaleString() : "—"} ·{" "}
            {data.admin.lastLoginIp || "—"}
          </p>
        </Card>

        <Card hover={false}>
          <h2 className="font-semibold">Force logout all devices</h2>
          <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">Revokes every active admin session immediately.</p>
          <Button className="mt-4" variant="secondary" onClick={() => run("force_logout_all")}>
            Log out everywhere
          </Button>
        </Card>
      </div>

      <Card className="mt-8" hover={false}>
        <h2 className="font-semibold">Device / session history</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {data.sessions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2">
              <span>
                {s.deviceLabel || s.userAgent?.slice(0, 48) || "Device"} · {s.ipAddress || "—"}
              </span>
              <Button size="sm" variant="secondary" onClick={() => run("revoke_session", { sessionId: s.id })}>
                Revoke
              </Button>
            </li>
          ))}
          {!data.sessions.length && <li className="text-[var(--aes-dusty)]">No active sessions listed</li>}
        </ul>
      </Card>

      <Card className="mt-6" hover={false}>
        <h2 className="font-semibold">Login history</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {data.loginHistory.map((l) => (
            <li key={l.id} className="flex justify-between border-b py-2">
              <span>
                {l.success ? "Success" : "Failed"} · {l.ipAddress || "—"} {l.reason ? `· ${l.reason}` : ""}
              </span>
              <span className="text-[var(--aes-dusty)]">{new Date(l.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
