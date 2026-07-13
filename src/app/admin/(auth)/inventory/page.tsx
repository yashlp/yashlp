"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type InventoryItem = {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  minStock: number;
  price: number;
  purchaseCost: number | null;
  mrp: number | null;
  warehouseLocation: string | null;
  profitMargin: number | null;
  isLowStock: boolean;
  brand: { name: string };
  supplier: { id: string; brandName: string } | null;
};

type Summary = {
  totalSkus: number;
  lowStockAlerts: number;
  inventoryValue: number;
  totalUnits: number;
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (lowStockOnly) params.set("lowStock", "true");
    if (search) params.set("search", search);
    fetch(`/api/admin/inventory?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setSummary(d.summary || null);
      });
  }, [search, lowStockOnly]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Inventory</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">Stock you own — SKU, cost, margin, reorder levels</p>
        </div>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      {summary && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Total SKUs</p><p className="text-2xl font-semibold">{summary.totalSkus}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Total units</p><p className="text-2xl font-semibold">{summary.totalUnits}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Inventory value</p><p className="text-2xl font-semibold">{formatInr(summary.inventoryValue)}</p></Card>
          <Card hover={false}><p className="text-sm text-[var(--aes-dusty)]">Low stock</p><p className="text-2xl font-semibold text-red-600">{summary.lowStockAlerts}</p></Card>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Input
          placeholder="Search SKU, barcode, name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant={lowStockOnly ? "primary" : "secondary"}
          onClick={() => setLowStockOnly((v) => !v)}
        >
          Low stock only
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--aes-border)] bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="aes-mono border-b border-[var(--aes-border)] text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Reorder</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Margin</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[var(--aes-border)] last:border-0">
                <td className="px-4 py-3 font-medium">
                  {item.name}
                  {item.isLowStock && <span className="ml-2 text-xs text-red-600">Low</span>}
                </td>
                <td className="px-4 py-3 text-[var(--aes-charcoal-muted)]">{item.sku || "—"}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">{item.minStock || 5}</td>
                <td className="px-4 py-3">{item.purchaseCost ? formatInr(item.purchaseCost) : "—"}</td>
                <td className="px-4 py-3">{formatInr(item.price)}</td>
                <td className="px-4 py-3">{item.profitMargin != null ? `${item.profitMargin}%` : "—"}</td>
                <td className="px-4 py-3">{item.supplier?.brandName || "—"}</td>
                <td className="px-4 py-3">{item.warehouseLocation || "—"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${item.id}/edit`} className="text-xs text-[var(--aes-royal)]">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
