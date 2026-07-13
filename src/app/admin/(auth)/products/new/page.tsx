"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [sellers, setSellers] = useState<{ id: string; businessName: string; brands: { id: string; name: string }[] }[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "10",
    categoryId: "",
    sellerId: "",
    brandId: "",
    imageUrl: "",
    tags: "",
    mood: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then((d) => setSellers(d.sellers || []));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
        sellerId: form.sellerId,
        brandId: form.brandId,
        images: form.imageUrl ? [form.imageUrl] : [],
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        mood: form.mood || undefined,
        status: "DRAFT",
        approvalStatus: "PENDING",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create product");
      return;
    }
    router.push("/admin/products");
  }

  const brands = sellers.find((s) => s.id === form.sellerId)?.brands || [];

  return (
    <div className="max-w-2xl">
      <h1 className="aes-display text-3xl font-semibold italic">Add product</h1>
      <Card className="mt-8 space-y-4">
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="URL slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <textarea className="aes-input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <select className="aes-input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="aes-input" value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value, brandId: "" })} required>
            <option value="">Select seller</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>{s.businessName}</option>
            ))}
          </select>
          <select className="aes-input" value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} required>
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Input placeholder="Tags (comma-separated, e.g. ceramic, wellness, handmade)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <Input placeholder="Mood (e.g. calm, celebratory, creative)" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit">Create product</Button>
        </form>
      </Card>
    </div>
  );
}
