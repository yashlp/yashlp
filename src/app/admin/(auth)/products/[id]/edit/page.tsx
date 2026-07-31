"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";
import {
  ProductMediaUploader,
  type ProductMediaValue,
} from "@/components/aesthetics/admin/product-media-uploader";
import {
  PRODUCT_MOOD_OPTIONS,
  dimensionHintForProduct,
  slugifyProduct,
} from "@/lib/commerce/product-form-options";

function parseMaterials(raw: unknown): string {
  if (!raw) return "";
  if (Array.isArray(raw)) return raw.filter(Boolean).join(", ");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).join(", ");
    } catch {
      // plain string
    }
    return raw;
  }
  return "";
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    mood: "",
    dimensions: "",
    materials: "",
    status: "PUBLISHED",
  });
  const [media, setMedia] = useState<ProductMediaValue>({ images: [], videos: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((prod) => {
        const p = prod.product;
        if (!p) return;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: String(p.price || ""),
          stock: p.stock != null ? String(p.stock) : "",
          mood: p.mood || "",
          dimensions: p.dimensions || "",
          materials: parseMaterials(p.materials),
          status: p.status || "PUBLISHED",
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
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const dimensionHint = useMemo(
    () =>
      dimensionHintForProduct({
        productName: form.name,
        description: form.description,
      }),
    [form.name, form.description]
  );

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!form.mood) {
      setError("Choose a mood.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Enter a selling price greater than 0.");
      return;
    }
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
      const name = form.name.trim() || undefined;
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: name ? slugifyProduct(name) : undefined,
          description: form.description.trim(),
          mood: form.mood,
          price: Number(form.price),
          stock: form.stock !== "" ? Number(form.stock) || 0 : undefined,
          dimensions: form.dimensions.trim() || undefined,
          materials: form.materials
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
          status: form.status,
          images: media.images,
          videos: media.videos.length ? media.videos : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldErrors = data.details?.fieldErrors as Record<string, string[]> | undefined;
        const firstDetail = fieldErrors
          ? Object.entries(fieldErrors)
              .map(([field, msgs]) => `${field}: ${msgs?.[0] || "invalid"}`)
              .join(" · ")
          : "";
        setError(data.error || firstDetail || "Save failed");
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
    <div className="max-w-2xl">
      <Link href="/admin/inventory" className="text-sm text-[var(--aes-royal)]">
        ← Inventory
      </Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">Edit product</h1>
      <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
        Same fields as Add product — update photos, description, mood, price, and optional details.
      </p>

      <Card className="mt-8 space-y-4">
        <form onSubmit={save} className="space-y-5">
          <div>
            <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
              Photos <span className="text-red-600">*</span>
            </label>
            <ProductMediaUploader value={media} onChange={setMedia} disabled={saving} />
            <p className="mt-2 text-xs text-[var(--aes-charcoal-muted)]">Minimum 2, maximum 4 photos. Video optional.</p>
          </div>

          <div>
            <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              className="aes-input min-h-28"
              placeholder="What is this piece, and how does it feel in a room?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
              Mood <span className="text-red-600">*</span>
            </label>
            <select
              className="aes-input"
              value={form.mood}
              onChange={(e) => setForm({ ...form, mood: e.target.value })}
              required
            >
              <option value="">Select mood</option>
              {PRODUCT_MOOD_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label} — {m.hint}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
              Selling price (₹) <span className="text-red-600">*</span>
            </label>
            <Input
              type="number"
              min={1}
              step="1"
              placeholder="e.g. 2499"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="border-t border-[var(--aes-border)] pt-5">
            <p className="aes-mono mb-4 text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">
              Optional details
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-[var(--aes-charcoal-muted)]">Product name</label>
                <Input
                  placeholder="Optional — we can title it from the description"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--aes-charcoal-muted)]">Stock quantity</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="Optional"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--aes-charcoal-muted)]">Materials</label>
                <Input
                  placeholder="e.g. Acrylic, wood base, LED"
                  value={form.materials}
                  onChange={(e) => setForm({ ...form, materials: e.target.value })}
                />
                <p className="mt-1 text-xs text-[var(--aes-dusty)]">Comma-separated. Shows on the product page.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--aes-charcoal-muted)]">
                  {dimensionHint.label}
                </label>
                <Input
                  placeholder={dimensionHint.placeholder}
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                />
                <p className="mt-2 text-xs text-[var(--aes-charcoal-muted)]">{dimensionHint.tip}</p>
                <p className="mt-1 text-xs text-[var(--aes-dusty)]">
                  Suggested fields: {dimensionHint.fields.join(" · ")}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--aes-charcoal-muted)]">Visibility</label>
                <select
                  className="aes-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["PUBLISHED", "DRAFT", "HIDDEN", "ARCHIVED", "OUT_OF_STOCK"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving || media.images.length < 2}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={remove} disabled={saving}>
              Delete product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
