"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  phone: string;
  name: string;
  role: string;
  reputation: number;
  reliabilityScore: number;
  createdAt: string;
  _count: { incidents: number; confirmations: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);

  const load = () => {
    fetch("/api/civic-admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (userId: string, role: "user" | "admin") => {
    const res = await fetch("/api/civic-admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Failed");
    load();
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-orange-100 bg-orange-50/50 text-xs uppercase text-stone-500">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Activity</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-orange-50 last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium text-stone-900">{u.name}</p>
                <p className="text-xs text-stone-400">{u.phone}</p>
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    u.role === "admin"
                      ? "rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-800"
                      : "text-stone-600"
                  }
                >
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-stone-500">
                {u._count.incidents} reports · {u._count.confirmations} confirms · rep {u.reputation}
              </td>
              <td className="px-4 py-3">
                {u.role === "admin" ? (
                  <button
                    onClick={() => setRole(u.id, "user")}
                    className="text-xs font-medium text-stone-500 hover:text-stone-800"
                  >
                    Demote
                  </button>
                ) : (
                  <button
                    onClick={() => setRole(u.id, "admin")}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700"
                  >
                    Make admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
