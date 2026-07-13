"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Line = { name: string; sku: string; quantityOrdered: string; unitCost: string; productId: string };

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function NewPurchaseOrderPage() {
  const [suppliers, setSuppliers] = useState<{ id: string; brandName: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; sku: string | null }[]>([]);
  const [form, setForm] = useState({
    supplierId: "",
    invoiceNumber: "",
    invoiceUrl: "",
    paymentStatus: "PENDING",
    expectedDelivery: "",
    notes: "",
  });
  const [lines, setLines] = useState<Line[]>([{ name: "", sku: "", quantityOrdered: "1", unitCost: "", productId: "" }]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/suppliers").then((r) => r.json()).then((d) => setSuppliers(d.suppliers || []));
    fetch("/api/admin/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
  }, []);

  function addLine() {
    setLines([...lines, { name: "", sku: "", quantityOrdered: "1", unitCost: "", productId: "" }]);
  }

  function updateLine(i: number, patch: Partial<Line>) {
    const next = [...lines];
    next[i] = { ...next[i], ...patch };
    if (patch.productId) {
      const p = products.find((x) => x.id === patch.productId);
      if (p) next[i].name = p.name;
      if (p?.sku) next[i].sku = p.sku;
    }
    setLines(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: form.supplierId,
        paymentStatus: form.paymentStatus,
        invoiceNumber: form.invoiceNumber || undefined,
        invoiceUrl: form.invoiceUrl || undefined,
        expectedDelivery: form.expectedDelivery ? new Date(form.expectedDelivery).toISOString() : undefined,
        notes: form.notes || undefined,
        lines: lines.map((l) => ({
          productId: l.productId || undefined,
          sku: l.sku || undefined,
          name: l.name,
          quantityOrdered: Number(l.quantityOrdered),
          unitCost: Number(l.unitCost),
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create PO");
      return;
    }
    window.location.href = "/admin/purchases";
  }

  const total = lines.reduce((s, l) => s + (Number(l.quantityOrdered) || 0) * (Number(l.unitCost) || 0), 0);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/purchases" className="text-sm text-[var(--aes-royal)]">← Purchase orders</Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">New purchase order</h1>

      <Card className="mt-8">
        <form onSubmit={submit} className="space-y-6">
          <select className="aes-input w-full" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required>
            <option value="">Select supplier</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.brandName}</option>)}
          </select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Invoice number" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
            <Input placeholder="Invoice URL" value={form.invoiceUrl} onChange={(e) => setForm({ ...form, invoiceUrl: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="date" value={form.expectedDelivery} onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })} />
            <select className="aes-input" value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>
              <option value="PENDING">Payment pending</option>
              <option value="PARTIAL">Partially paid</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <textarea className="aes-input min-h-20 w-full" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <div>
            <p className="mb-3 font-semibold">Line items</p>
            {lines.map((line, i) => (
              <div key={i} className="mb-4 grid gap-2 rounded-xl border border-[var(--aes-border)] p-4 sm:grid-cols-2">
                <select className="aes-input sm:col-span-2" value={line.productId} onChange={(e) => updateLine(i, { productId: e.target.value })}>
                  <option value="">Link product (optional)</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Input placeholder="Item name" value={line.name} onChange={(e) => updateLine(i, { name: e.target.value })} required />
                <Input placeholder="SKU" value={line.sku} onChange={(e) => updateLine(i, { sku: e.target.value })} />
                <Input type="number" placeholder="Qty" value={line.quantityOrdered} onChange={(e) => updateLine(i, { quantityOrdered: e.target.value })} required />
                <Input type="number" placeholder="Unit cost (₹)" value={line.unitCost} onChange={(e) => updateLine(i, { unitCost: e.target.value })} required />
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addLine}>Add line</Button>
          </div>

          <p className="text-lg font-semibold">Total: {formatInr(total)}</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit">Create purchase order</Button>
        </form>
      </Card>
    </div>
  );
}
