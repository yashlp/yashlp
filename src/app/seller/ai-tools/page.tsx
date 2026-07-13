"use client";

import { useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { Sparkles } from "lucide-react";

export default function SellerAiToolsPage() {
  const [caption, setCaption] = useState("");
  const [product, setProduct] = useState("Cloud Vessel");

  return (
    <div className="max-w-2xl">
      <h1 className="aes-display text-3xl font-semibold italic">AI Tools</h1>
      <p className="mt-2 text-[var(--aes-charcoal-muted)]">Generate descriptions and social captions for your listings.</p>

      <Card className="mt-8 space-y-4">
        <div>
          <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Product</label>
          <Input value={product} onChange={(e) => setProduct(e.target.value)} />
        </div>
        <Button
          variant="secondary"
          className="gap-2"
          onClick={() =>
            setCaption(
              `Meet ${product} — hand-crafted for slow mornings and quiet rooms. Tap to shop on Aesthetics. ✨ #independentbrand #curatedhome`
            )
          }
        >
          <Sparkles className="h-4 w-4" />
          Generate Instagram caption
        </Button>
        {caption && (
          <div className="rounded-xl bg-[var(--aes-ivory)] p-4 text-sm leading-relaxed text-[var(--aes-charcoal)]">
            {caption}
          </div>
        )}
      </Card>
    </div>
  );
}
