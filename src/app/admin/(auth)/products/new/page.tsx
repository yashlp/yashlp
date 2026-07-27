"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";
import {
  ProductMediaUploader,
  type ProductMediaValue,
} from "@/components/aesthetics/admin/product-media-uploader";
import {
  PRODUCT_MOOD_OPTIONS,
  ROOM_MOOD_OPTIONS,
  dimensionHintForProduct,
  slugifyProduct,
} from "@/lib/commerce/product-form-options";

type Category = { id: string; name: string; slug?: string };

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    mood: "",
    roomMood: "",
    dimensions: "",
    materials: "",
  });
  const [media, setMedia] = useState<ProductMediaValue>({ images: [], videos: [] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const dimensionHint = useMemo(
    () =>
      dimensionHintForProduct({
        categorySlug: selectedCategory?.slug,
        categoryName: selectedCategory?.name,
        productName: form.name,
        description: form.description,
      }),
    [selectedCategory, form.name, form.description]
  );

  async function submit(e: React.FormEvent) {
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
      const payload: Record<string, unknown> = {
        description: form.description.trim(),
        mood: form.mood,
        price: Number(form.price),
        images: media.images,
        videos: media.videos.length ? media.videos : undefined,
        status: "PUBLISHED",
        approvalStatus: "APPROVED",
      };

      if (form.name.trim()) {
        payload.name = form.name.trim();
        payload.slug = slugifyProduct(form.name);
      }
      if (form.stock !== "") payload.stock = Number(form.stock) || 0;
      if (form.categoryId) payload.categoryId = form.categoryId;
      if (form.dimensions.trim()) payload.dimensions = form.dimensions.trim();
      if (form.materials.trim()) {
        payload.materials = form.materials
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean);
      }
      if (form.roomMood) payload.roomMood = form.roomMood;

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldErrors = data.details?.fieldErrors as Record<string, string[]> | undefined;
        const firstDetail = fieldErrors
          ? Object.entries(fieldErrors)
              .map(([field, msgs]) => `${field}: ${msgs?.[0] || "invalid"}`)
              .join(" · ")
          : "";
        setError(data.error || firstDetail || "Failed to create product");
        return;
      }
      router.push("/admin/inventory");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="aes-display text-3xl font-semibold italic">Add product</h1>
      <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">
        Only description, mood, price, and 2+ photos are required. Everything else is optional.
      </p>

      <Card className="mt-8 space-y-4">
        <form onSubmit={submit} className="space-y-5">
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
                <label className="mb-2 block text-sm text-[var(--aes-charcoal-muted)]">Category</label>
                <select
                  className="aes-input"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  <option value="">Optional</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--aes-charcoal-muted)]">Room vibe (homepage moods)</label>
                <select
                  className="aes-input"
                  value={form.roomMood}
                  onChange={(e) => setForm({ ...form, roomMood: e.target.value })}
                >
                  <option value="">Optional</option>
                  {ROOM_MOOD_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
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
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={saving || media.images.length < 2}>
            {saving ? "Saving…" : "Add to inventory"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
