"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Supplier = {
  id: string;
  brandName: string;
  slug: string;
  contactPerson: string | null;
  mobile: string | null;
  email: string | null;
  gstNumber: string | null;
  status: string;
  outstandingBalance: number;
  _count: { products: number; purchaseOrders: number };
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    slug: "",
    contactPerson: "",
    mobile: "",
    email: "",
    gstNumber: "",
    panNumber: "",
  });

  function load() {
    fetch("/api/admin/suppliers")
      .then((r) => r.json())
      .then((d) => setSuppliers(d.suppliers || []));
  }

  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.slug || form.brandName.toLowerCase().replace(/\s+/g, "-"),
        email: form.email || undefined,
      }),
    });
    setShowForm(false);
    setForm({ brandName: "", slug: "", contactPerson: "", mobile: "", email: "", gstNumber: "", panNumber: "" });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Suppliers</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">Brands and manufacturers you purchase inventory from</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "Add supplier"}</Button>
      </div>

      {showForm && (
        <Card className="mt-8">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Brand name" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} required />
            <Input placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="Contact person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            <Input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="GST number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
            <Input placeholder="PAN" value={form.panNumber} onChange={(e) => setForm({ ...form, panNumber: e.target.value })} />
            <div className="sm:col-span-2">
              <Button type="submit">Save supplier</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--aes-border)] bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="aes-mono border-b border-[var(--aes-border)] text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
            <tr>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">GST</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">POs</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-[var(--aes-border)] last:border-0">
                <td className="px-4 py-3 font-medium">{s.brandName}</td>
                <td className="px-4 py-3 text-[var(--aes-charcoal-muted)]">
                  {s.contactPerson || s.mobile || s.email || "—"}
                </td>
                <td className="px-4 py-3">{s.gstNumber || "—"}</td>
                <td className="px-4 py-3">{s._count.products}</td>
                <td className="px-4 py-3">{s._count.purchaseOrders}</td>
                <td className="px-4 py-3">{s.status}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/suppliers/${s.id}`} className="text-xs text-[var(--aes-royal)]">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
