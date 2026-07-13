"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

const PAGE_KEYS = [
  { key: "homepage_tagline", label: "Homepage tagline", type: "TEXT" },
  { key: "about", label: "About Us", type: "PAGE" },
  { key: "contact", label: "Contact", type: "PAGE" },
  { key: "faqs", label: "FAQs", type: "PAGE" },
  { key: "privacy", label: "Privacy Policy", type: "PAGE" },
  { key: "terms", label: "Terms & Conditions", type: "PAGE" },
  { key: "refund_policy", label: "Refund Policy", type: "PAGE" },
  { key: "shipping_policy", label: "Shipping Policy", type: "PAGE" },
];

type Page = { key: string; title: string | null; body: string | null };

export default function ContentPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [active, setActive] = useState(PAGE_KEYS[0].key);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((d) => setPages(d.pages || []));
  }, []);

  useEffect(() => {
    const p = pages.find((x) => x.key === active);
    setTitle(p?.title || "");
    setBody(p?.body || "");
  }, [active, pages]);

  async function save() {
    const meta = PAGE_KEYS.find((p) => p.key === active)!;
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: active, type: meta.type, title, body, isPublished: true }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    const res = await fetch("/api/admin/content");
    const d = await res.json();
    setPages(d.pages || []);
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Content</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Edit storefront pages without code</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
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
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
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
