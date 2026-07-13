"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  usedCount: number;
  maxUses: number | null;
  isActive: boolean;
};

export default function MarketingPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", description: "", discountType: "PERCENT", discountValue: "10", minOrderValue: "999" });

  function load() {
    fetch("/api/admin/coupons").then((r) => r.json()).then((d) => setCoupons(d.coupons || []));
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue),
      }),
    });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Marketing</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">Coupons, discounts, and campaigns</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "New coupon"}</Button>
      </div>

      {showForm && (
        <Card className="mt-8">
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Coupon code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <select className="aes-input" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="PERCENT">Percent off</option>
              <option value="FIXED">Fixed amount (₹)</option>
            </select>
            <Input type="number" placeholder="Discount value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
            <Input type="number" placeholder="Min order (₹)" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
            <div className="sm:col-span-2"><Button type="submit">Create coupon</Button></div>
          </form>
        </Card>
      )}

      <Card className="mt-8" hover={false}>
        <p className="aes-mono text-[10px] uppercase text-[var(--aes-dusty)]">Coming soon</p>
        <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">Flash sales, homepage banners, push notifications, and email campaigns.</p>
      </Card>

      <div className="mt-8 space-y-3">
        {coupons.map((c) => (
          <Card key={c.id} hover={false} className="flex justify-between p-4">
            <div>
              <p className="font-semibold">{c.code}</p>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">
                {c.discountType === "PERCENT" ? `${c.discountValue}% off` : `₹${c.discountValue} off`} · Used {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}
              </p>
            </div>
            <span className={`text-xs ${c.isActive ? "text-green-600" : "text-[var(--aes-dusty)]"}`}>{c.isActive ? "Active" : "Inactive"}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
