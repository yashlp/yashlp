"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/aesthetics/ui/badge";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: string;
  approvalStatus: string;
  brand: { name: string };
  category: { name: string };
  media: { url: string }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    fetch(`/api/admin/products${q}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function action(id: string, action: string) {
    await fetch(`/api/admin/products/${id}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Products</h1>
          <p className="text-sm text-[var(--aes-charcoal-muted)]">Manage catalog — nothing is hardcoded</p>
        </div>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      <Input
        className="mt-6 max-w-md"
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="mt-8 aes-skeleton h-32 rounded-2xl" />
      ) : (
        <div className="mt-8 space-y-3">
          {products.map((p) => (
            <Card key={p.id} hover={false} className="flex flex-wrap items-center gap-4 p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--aes-ivory-deep)]">
                {p.media[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.media[0].url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-[var(--aes-charcoal-muted)]">
                  {p.brand.name} · {p.category.name} · ₹{p.price} · Stock {p.stock}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={p.approvalStatus === "APPROVED" ? "royal" : "muted"}>{p.approvalStatus}</Badge>
                <Badge variant="muted">{p.status}</Badge>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/products/${p.id}/edit`}>
                  <Button variant="secondary" size="sm">Edit</Button>
                </Link>
                {p.approvalStatus === "PENDING" && (
                  <Button size="sm" onClick={() => action(p.id, "approve")}>Approve</Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => action(p.id, "duplicate")}>Duplicate</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
