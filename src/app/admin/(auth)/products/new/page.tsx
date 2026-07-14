"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";
import {
  ProductMediaUploader,
  type ProductMediaValue,
} from "@/components/aesthetics/admin/product-media-uploader";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [sellers, setSellers] = useState<{ id: string; businessName: string; brands: { id: string; name: string }[] }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; brandName: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    barcode: "",
    description: "",
    price: "",
    mrp: "",
    purchaseCost: "",
    stock: "10",
    minStock: "5",
    warehouseLocation: "",
    categoryId: "",
    sellerId: "",
    brandId: "",
    supplierId: "",
    tags: "",
    mood: "",
  });
  const [media, setMedia] = useState<ProductMediaValue>({ images: [], videos: [] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
    fetch("/api/admin/sellers").then((r) => r.json()).then((d) => {
      const list = d.sellers || [];
      setSellers(list);
      const first = list[0];
      if (first) {
        setForm((f) => ({
          ...f,
          sellerId: first.id,
          brandId: first.brands?.[0]?.id || "",
        }));
      }
    });
    fetch("/api/admin/suppliers").then((r) => r.json()).then((d) => setSuppliers(d.suppliers || []));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (media.images.length < 2) {
      setError("Upload at least 2 product photos.");
      return;
    }
    if (media.images.length > 4) {
      setError("Maximum 4 product photos.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
          sku: form.sku || undefined,
          barcode: form.barcode || undefined,
          description: form.description,
          price: Number(form.price),
          mrp: form.mrp ? Number(form.mrp) : undefined,
          purchaseCost: form.purchaseCost ? Number(form.purchaseCost) : undefined,
          stock: Number(form.stock),
          minStock: Number(form.minStock),
          warehouseLocation: form.warehouseLocation || undefined,
          supplierId: form.supplierId || undefined,
          categoryId: form.categoryId,
          sellerId: form.sellerId,
          brandId: form.brandId,
          images: media.images,
          videos: media.videos,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          mood: form.mood || undefined,
          status: "DRAFT",
          approvalStatus: "PENDING",
          purchaseDate: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product");
        return;
      }
      router.push("/admin/inventory");
    } finally {
      setSaving(false);
    }
  }

  const brands = sellers.find((s) => s.id === form.sellerId)?.brands || [];

  useEffect(() => {
    if (form.sellerId && !form.brandId && brands[0]) {
      setForm((f) => ({ ...f, brandId: brands[0].id }));
    }
  }, [form.sellerId, form.brandId, brands]);

  return (
    <div className="max-w-2xl">
      <h1 className="aes-display text-3xl font-semibold italic">Add product</h1>
      <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
        Inventory you own — upload 2–4 photos and an optional video after receiving goods.
      </p>
      <Card className="mt-8 space-y-4">
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <Input placeholder="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          </div>
          <Input placeholder="URL slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <textarea className="aes-input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input type="number" placeholder="Selling price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input type="number" placeholder="MRP (₹)" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
            <Input type="number" placeholder="Purchase cost (₹)" value={form.purchaseCost} onChange={(e) => setForm({ ...form, purchaseCost: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input type="number" placeholder="Stock qty" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <Input type="number" placeholder="Reorder level" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            <Input placeholder="Warehouse location" value={form.warehouseLocation} onChange={(e) => setForm({ ...form, warehouseLocation: e.target.value })} />
          </div>
          <select className="aes-input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="aes-input" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}>
            <option value="">Supplier (who you bought from)</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.brandName}</option>
            ))}
          </select>
          <input type="hidden" value={form.sellerId} />
          <input type="hidden" value={form.brandId} />

          <div className="rounded-2xl border border-[var(--aes-border)] bg-[var(--aes-ivory)]/50 p-4">
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Media</p>
            <ProductMediaUploader value={media} onChange={setMedia} disabled={saving} />
          </div>

          <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <Input placeholder="Mood" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={saving || media.images.length < 2}>
            {saving ? "Saving…" : "Add to inventory"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
