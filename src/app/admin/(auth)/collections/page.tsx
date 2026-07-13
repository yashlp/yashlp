"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  products: { product: { name: string } }[];
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", imageUrl: "", productIds: [] as string[] });

  function load() {
    fetch("/api/admin/collections").then((r) => r.json()).then((d) => setCollections(d.collections || []));
    fetch("/api/admin/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
  }

  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
        isFeatured: true,
        isPublished: true,
      }),
    });
    setShowForm(false);
    load();
  }

  async function togglePublish(id: string, isPublished: boolean) {
    await fetch(`/api/admin/collections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    load();
  }

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Collections</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">Curated edits — Blue Edit, Desk Goals, Gifts Under ₹999</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "New collection"}</Button>
      </div>

      {showForm && (
        <Card className="mt-8">
          <form onSubmit={submit} className="space-y-4">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <textarea className="aes-input min-h-20 w-full" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Cover image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <select
              multiple
              className="aes-input min-h-32 w-full"
              value={form.productIds}
              onChange={(e) => setForm({ ...form, productIds: Array.from(e.target.selectedOptions, (o) => o.value) })}
            >
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <p className="text-xs text-[var(--aes-dusty)]">Hold Ctrl/Cmd to select multiple products</p>
            <Button type="submit">Create collection</Button>
          </form>
        </Card>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {collections.map((c) => (
          <Card key={c.id} hover={false}>
            <div className="flex justify-between">
              <h2 className="font-semibold">{c.title}</h2>
              <button type="button" onClick={() => togglePublish(c.id, c.isPublished)} className="text-xs text-[var(--aes-royal)]">
                {c.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>
            <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">/{c.slug} · {c.products.length} products</p>
            {c.description && <p className="mt-2 text-sm">{c.description}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
