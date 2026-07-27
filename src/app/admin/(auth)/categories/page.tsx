"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isHidden: boolean;
  _count?: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  function load() {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slug || name.toLowerCase().replace(/\s+/g, "-") }),
    });
    setName("");
    setSlug("");
    load();
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Categories</h1>
      <p className="mt-1 max-w-xl text-sm text-[var(--aes-charcoal-muted)]">
        Categories power storefront “Shop by category” (Collections). Assign one when you add a product.
      </p>
      <Card className="mt-8 max-w-lg space-y-3">
        <form onSubmit={create} className="space-y-3">
          <Input placeholder="Category name (e.g. Lighting)" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Slug (optional — auto from name)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Button type="submit">Add category</Button>
        </form>
      </Card>
      <div className="mt-8 space-y-2">
        {categories.map((c) => (
          <Card key={c.id} hover={false} className="flex justify-between p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">/{c.slug} · {c._count?.products ?? 0} products</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
