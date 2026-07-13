"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<
    { id: string; action: string; entityType: string; entityId: string | null; createdAt: string; admin: { name: string } }[]
  >([]);

  useEffect(() => {
    fetch("/api/platform-admin/audit-logs")
      .then((r) => r.json())
      .then((d) => setLogs(d.logs || []));
  }, []);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Audit logs</h1>
      <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">Every admin action is recorded</p>
      <Card className="mt-8 overflow-hidden p-0" hover={false}>
        <table className="w-full text-sm">
          <thead className="bg-[var(--aes-ivory)]">
            <tr>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Entity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-[var(--aes-border)]">
                <td className="px-4 py-3 text-[var(--aes-charcoal-muted)]">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{l.admin.name}</td>
                <td className="px-4 py-3 font-medium">{l.action}</td>
                <td className="px-4 py-3">{l.entityType} {l.entityId?.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
