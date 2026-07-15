"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

const PAGE_KEYS = [
  { key: "homepage_tagline", label: "Homepage tagline", type: "TEXT" },
  { key: "homepage_hero", label: "Homepage hero", type: "BANNER" },
  { key: "homepage_banner_1", label: "Homepage banner 1", type: "BANNER" },
  { key: "homepage_banner_2", label: "Homepage banner 2", type: "BANNER" },
  { key: "featured_collections", label: "Featured collections copy", type: "TEXT" },
  { key: "room_workspace", label: "Room — Workspace", type: "PAGE" },
  { key: "room_bedroom", label: "Room — Bedroom", type: "PAGE" },
  { key: "room_living", label: "Room — Living Room", type: "PAGE" },
  { key: "about", label: "About Us", type: "PAGE" },
  { key: "faqs", label: "FAQs", type: "PAGE" },
  { key: "blog_index", label: "Blog", type: "PAGE" },
  { key: "contact", label: "Contact", type: "PAGE" },
  { key: "privacy", label: "Privacy Policy", type: "PAGE" },
  { key: "terms", label: "Terms & Conditions", type: "PAGE" },
  { key: "refund_policy", label: "Refund Policy", type: "PAGE" },
  { key: "shipping_policy", label: "Shipping Policy", type: "PAGE" },
  { key: "careers", label: "Careers", type: "PAGE" },
  { key: "become_a_maker", label: "Become a Maker", type: "PAGE" },
];

type Page = { key: string; title: string | null; body: string | null; imageUrl: string | null };

export default function ContentPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [active, setActive] = useState(PAGE_KEYS[0].key);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((d) => setPages(d.pages || []));
  }, []);

  useEffect(() => {
    const p = pages.find((x) => x.key === active);
    setTitle(p?.title || "");
    setBody(p?.body || "");
    setImageUrl(p?.imageUrl || "");
  }, [active, pages]);

  async function save() {
    const meta = PAGE_KEYS.find((p) => p.key === active)!;
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: active,
        type: meta.type,
        title,
        body,
        imageUrl: imageUrl || undefined,
        isPublished: true,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    const res = await fetch("/api/admin/content");
    const d = await res.json();
    setPages(d.pages || []);
  }

  const meta = PAGE_KEYS.find((p) => p.key === active);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Content</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Edit homepage banners, hero images, rooms, about, FAQ, blog — without code
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="max-h-[70vh] space-y-1 overflow-y-auto">
          {PAGE_KEYS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setActive(p.key)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${active === p.key ? "bg-[var(--aes-charcoal)] text-white" : "hover:bg-white"}`}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <Card hover={false}>
          <p className="mb-3 text-xs uppercase tracking-wider text-[var(--aes-dusty)]">{meta?.type}</p>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          {(meta?.type === "BANNER" || meta?.key.includes("hero") || meta?.key.includes("room")) && (
            <Input
              className="mt-3"
              placeholder="Image / hero URL (or uploaded media URL)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          )}
          <textarea
            className="aes-input mt-4 min-h-[320px] w-full"
            placeholder="Content (markdown supported)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={save}>Save</Button>
            {saved && <span className="text-sm text-green-600">Saved</span>}
          </div>
        </Card>
      </div>
    </div>
  );
}
