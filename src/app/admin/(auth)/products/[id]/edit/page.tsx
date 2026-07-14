"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";
import {
  ProductMediaUploader,
  type ProductMediaValue,
} from "@/components/aesthetics/admin/product-media-uploader";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; brandName: string; mobile: string | null; email: string | null }[]>([]);
  const [form, setForm] = useState({
    name: "", slug: "", sku: "", barcode: "", description: "", shortDescription: "",
    price: "", mrp: "", purchaseCost: "", stock: "", minStock: "", warehouseLocation: "",
    supplierId: "", categoryId: "", purchaseDate: "", status: "DRAFT", scheduledAt: "",
    room: "", style: "",
    seoTitle: "", seoDescription: "", seoKeywords: "", seoCanonicalUrl: "", ogImageUrl: "",
    isFeatured: false, isTrending: false, isNewArrival: false, isRecommended: false,
    isBestseller: false, isLimitedEdition: false, isStaffPick: false,
  });
  const [media, setMedia] = useState<ProductMediaValue>({ images: [], videos: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/suppliers").then((r) => r.json()),
    ]).then(([prod, cats, sups]) => {
      const p = prod.product;
      if (!p) return;
      setForm({
        name: p.name || "",
        slug: p.slug || "",
        sku: p.sku || "",
        barcode: p.barcode || "",
        description: p.description || "",
        shortDescription: p.shortDescription || "",
        price: String(p.price || ""),
        mrp: p.mrp ? String(p.mrp) : "",
        purchaseCost: p.purchaseCost ? String(p.purchaseCost) : "",
        stock: String(p.stock ?? 0),
        minStock: String(p.minStock ?? 5),
        warehouseLocation: p.warehouseLocation || "",
        supplierId: p.supplierId || "",
        categoryId: p.categoryId || "",
        purchaseDate: p.purchaseDate ? p.purchaseDate.slice(0, 10) : "",
        status: p.status || "DRAFT",
        scheduledAt: p.scheduledAt ? p.scheduledAt.slice(0, 16) : "",
        room: p.room || "",
        style: p.style || "",
        seoTitle: p.seoTitle || "",
        seoDescription: p.seoDescription || "",
        seoKeywords: p.seoKeywords || "",
        seoCanonicalUrl: p.seoCanonicalUrl || "",
        ogImageUrl: p.ogImageUrl || "",
        isFeatured: Boolean(p.isFeatured),
        isTrending: Boolean(p.isTrending),
        isNewArrival: Boolean(p.isNewArrival),
        isRecommended: Boolean(p.isRecommended),
        isBestseller: Boolean(p.isBestseller),
        isLimitedEdition: Boolean(p.isLimitedEdition),
        isStaffPick: Boolean(p.isStaffPick),
      });
      const images = (p.media || [])
        .filter((m: { type: string }) => m.type === "IMAGE")
        .map((m: { url: string }) => m.url)
        .slice(0, 4);
      const videos = (p.media || [])
        .filter((m: { type: string }) => m.type === "VIDEO")
        .map((m: { url: string }) => m.url)
        .slice(0, 1);
      setMedia({ images, videos });
      setCategories(cats.categories || []);
      setSuppliers(sups.suppliers || []);
      setLoading(false);
    });
  }, [id]);

  const cost = Number(form.purchaseCost) || 0;
  const price = Number(form.price) || 0;
  const margin = cost > 0 && price > 0 ? Math.round(((price - cost) / price) * 100) : null;
  const supplier = suppliers.find((s) => s.id === form.supplierId);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (media.images.length < 2) {
      setError("Upload at least 2 product photos.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          sku: form.sku || undefined,
          barcode: form.barcode || undefined,
          description: form.description,
          shortDescription: form.shortDescription || undefined,
          price: Number(form.price),
          mrp: form.mrp ? Number(form.mrp) : undefined,
          purchaseCost: form.purchaseCost ? Number(form.purchaseCost) : undefined,
          stock: Number(form.stock),
          minStock: Number(form.minStock),
          warehouseLocation: form.warehouseLocation || undefined,
          supplierId: form.supplierId || undefined,
          categoryId: form.categoryId,
          status: form.status,
          purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : undefined,
          images: media.images,
          videos: media.videos,
          room: form.room || undefined,
          style: form.style || undefined,
          seoTitle: form.seoTitle || undefined,
          seoDescription: form.seoDescription || undefined,
          seoKeywords: form.seoKeywords || undefined,
          seoCanonicalUrl: form.seoCanonicalUrl || undefined,
          ogImageUrl: form.ogImageUrl || undefined,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
          isFeatured: form.isFeatured,
          isTrending: form.isTrending,
          isNewArrival: form.isNewArrival,
          isRecommended: form.isRecommended,
          isBestseller: form.isBestseller,
          isLimitedEdition: form.isLimitedEdition,
          isStaffPick: form.isStaffPick,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      router.push("/admin/inventory");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this product permanently?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.push("/admin/inventory");
  }

  if (loading) return <div className="aes-skeleton h-40 rounded-2xl" />;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inventory" className="text-sm text-[var(--aes-royal)]">← Inventory</Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">Edit product</h1>

      <Card className="mt-8">
        <form onSubmit={save} className="space-y-6">
          <section>
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Product details</p>
            <div className="space-y-3">
              <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                <Input placeholder="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              </div>
              <Input placeholder="URL slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <textarea className="aes-input min-h-24 w-full" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
          </section>

          <section>
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Pricing & margin</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Input type="number" placeholder="Purchase cost (₹)" value={form.purchaseCost} onChange={(e) => setForm({ ...form, purchaseCost: e.target.value })} />
              <Input type="number" placeholder="Selling price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input type="number" placeholder="MRP (₹)" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
            </div>
            {margin != null && <p className="mt-2 text-sm text-[var(--aes-royal)]">Profit margin: {margin}%</p>}
          </section>

          <section>
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Inventory</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Input type="number" placeholder="Stock qty" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              <Input type="number" placeholder="Reorder level" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              <Input placeholder="Warehouse location" value={form.warehouseLocation} onChange={(e) => setForm({ ...form, warehouseLocation: e.target.value })} />
            </div>
            <Input type="date" className="mt-3" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
          </section>

          <section>
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Supplier</p>
            <select className="aes-input w-full" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}>
              <option value="">Select supplier</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.brandName}</option>)}
            </select>
            {supplier && (
              <p className="mt-2 text-sm text-[var(--aes-charcoal-muted)]">
                Contact: {supplier.mobile || supplier.email || "—"}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--aes-border)] bg-[var(--aes-ivory)]/40 p-4">
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Media</p>
            <ProductMediaUploader value={media} onChange={setMedia} disabled={saving} />
          </section>

          <select className="aes-input w-full" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Room (e.g. bedroom, workspace)" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            <Input placeholder="Style (e.g. Japandi, Minimal)" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} />
          </div>
          <section>
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Product status</p>
            <select className="aes-input w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {["DRAFT", "SCHEDULED", "PUBLISHED", "HIDDEN", "ARCHIVED", "OUT_OF_STOCK"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {form.status === "SCHEDULED" && (
              <Input
                className="mt-3"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
            )}
          </section>

          <section>
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">SEO</p>
            <div className="space-y-3">
              <Input placeholder="Meta title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              <textarea className="aes-input min-h-20 w-full" placeholder="Meta description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
              <Input placeholder="Canonical URL" value={form.seoCanonicalUrl} onChange={(e) => setForm({ ...form, seoCanonicalUrl: e.target.value })} />
              <Input placeholder="OG image URL" value={form.ogImageUrl} onChange={(e) => setForm({ ...form, ogImageUrl: e.target.value })} />
              <Input placeholder="SEO keywords" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
            </div>
          </section>

          <section>
            <p className="aes-mono mb-3 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Product labels</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["isBestseller", "Bestseller"],
                  ["isNewArrival", "New Arrival"],
                  ["isLimitedEdition", "Limited Edition"],
                  ["isStaffPick", "Staff Pick"],
                  ["isTrending", "Trending"],
                  ["isFeatured", "Featured"],
                  ["isRecommended", "Curated For You"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving || media.images.length < 2}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={remove} disabled={saving}>Delete product</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
