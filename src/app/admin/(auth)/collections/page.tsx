"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";
import {
  CollectionProductPicker,
  type PickableProduct,
} from "@/components/aesthetics/admin/collection-product-picker";

type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  products: { productId?: string; product: { id: string; name: string; slug?: string } }[];
  _count?: { products: number };
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<PickableProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [managingId, setManagingId] = useState<string | null>(null);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    productIds: [] as string[],
  });

  function load() {
    fetch("/api/admin/collections")
      .then((r) => r.json())
      .then((d) => setCollections(d.collections || []));
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        const list = (d.products || []).map(
          (p: { id: string; name: string; slug?: string; status?: string }) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            status: p.status,
          })
        );
        setProducts(list);
      });
  }

  useEffect(() => {
    load();
  }, []);

  const managing = useMemo(
    () => collections.find((c) => c.id === managingId) || null,
    [collections, managingId]
  );

  function openManage(c: Collection) {
    setError("");
    setManagingId(c.id);
    setDraftIds(c.products.map((row) => row.product?.id || row.productId).filter(Boolean) as string[]);
    setShowForm(false);
  }

  function closeManage() {
    setManagingId(null);
    setDraftIds([]);
    setError("");
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          isFeatured: true,
          isPublished: true,
          productIds: form.productIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create collection");
        return;
      }
      setShowForm(false);
      setForm({ title: "", slug: "", description: "", imageUrl: "", productIds: [] });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function saveMembership() {
    if (!managingId) return;
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/collections/${managingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: draftIds }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not update products");
        return;
      }
      closeManage();
      load();
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    await fetch(`/api/admin/collections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    load();
  }

  async function removeCollection(id: string) {
    if (!confirm("Delete this collection? Products stay in inventory.")) return;
    await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    if (managingId === id) closeManage();
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Collections</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">
            Curated edits — add or remove products in each collection anytime.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm((v) => !v);
            closeManage();
          }}
        >
          {showForm ? "Cancel" : "New collection"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-8">
          <form onSubmit={submitCreate} className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
            <textarea
              className="aes-input min-h-20 w-full"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              placeholder="Cover image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <div className="rounded-2xl border border-[var(--aes-border)] bg-[var(--aes-ivory)]/40 p-4">
              <CollectionProductPicker
                products={products}
                selectedIds={form.productIds}
                onChange={(productIds) => setForm({ ...form, productIds })}
                disabled={saving}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create collection"}
            </Button>
          </form>
        </Card>
      )}

      {managing && (
        <Card className="mt-8" hover={false}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
                Manage products
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--aes-ink)]">{managing.title}</h2>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">/{managing.slug}</p>
            </div>
            <button
              type="button"
              onClick={closeManage}
              className="text-sm text-[var(--aes-royal)] hover:underline"
            >
              Close
            </button>
          </div>
          <CollectionProductPicker
            products={products}
            selectedIds={draftIds}
            onChange={setDraftIds}
            disabled={saving}
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" onClick={saveMembership} disabled={saving}>
              {saving ? "Saving…" : "Save products"}
            </Button>
            <Button type="button" variant="secondary" onClick={closeManage} disabled={saving}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {collections.map((c) => {
          const count = c._count?.products ?? c.products.length;
          const names = c.products
            .map((row) => row.product?.name)
            .filter(Boolean)
            .slice(0, 4);
          return (
            <Card key={c.id} hover={false}>
              <div className="flex justify-between gap-3">
                <h2 className="font-semibold text-[var(--aes-ink)]">{c.title}</h2>
                <button
                  type="button"
                  onClick={() => togglePublish(c.id, c.isPublished)}
                  className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[var(--aes-royal)]"
                >
                  {c.isPublished ? "Unpublish" : "Publish"}
                </button>
              </div>
              <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
                /{c.slug} · {count} product{count === 1 ? "" : "s"}
              </p>
              {c.description && <p className="mt-2 text-sm text-[var(--aes-charcoal)]">{c.description}</p>}
              {names.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-[var(--aes-charcoal-muted)]">
                  {names.map((n) => (
                    <li key={n} className="truncate">
                      · {n}
                    </li>
                  ))}
                  {count > names.length && (
                    <li className="text-xs">+{count - names.length} more</li>
                  )}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => openManage(c)}
                  disabled={managingId === c.id}
                >
                  {managingId === c.id ? "Managing…" : "Add / remove products"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => removeCollection(c.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
