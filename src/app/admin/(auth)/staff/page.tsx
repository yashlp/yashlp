"use client";

import { useEffect, useState } from "react";
import { ADMIN_ROLE_LABELS } from "@/lib/commerce/constants";
import type { AdminRole } from "@/lib/commerce/constants";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Staff = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
};

const STAFF_ROLES: AdminRole[] = [
  "SUPER_ADMIN",
  "INVENTORY_MANAGER",
  "ORDER_FULFILLMENT",
  "CUSTOMER_SUPPORT",
  "MARKETING",
  "ACCOUNTANT",
];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "INVENTORY_MANAGER" as AdminRole });

  function load() {
    fetch("/api/admin/staff").then((r) => r.json()).then((d) => setStaff(d.staff || []));
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "INVENTORY_MANAGER" });
    load();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch("/api/admin/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Admin & Staff</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">Role-based access for your team</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "Add staff"}</Button>
      </div>

      {showForm && (
        <Card className="mt-8">
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <select className="aes-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}>
              {STAFF_ROLES.map((r) => <option key={r} value={r}>{ADMIN_ROLE_LABELS[r]}</option>)}
            </select>
            <div className="sm:col-span-2"><Button type="submit">Create staff account</Button></div>
          </form>
        </Card>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-[10px] uppercase text-[var(--aes-dusty)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last login</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{ADMIN_ROLE_LABELS[s.role] || s.role}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => toggleActive(s.id, s.isActive)} className="text-xs text-[var(--aes-royal)]">
                    {s.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-[var(--aes-dusty)]">
                  {s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleDateString("en-IN") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
