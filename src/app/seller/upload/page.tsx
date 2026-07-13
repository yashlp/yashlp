"use client";

import { Card } from "@/components/aesthetics/ui/card";
import { Button } from "@/components/aesthetics/ui/button";
import { Input } from "@/components/aesthetics/ui/input";
import { Sparkles } from "lucide-react";

export default function SellerUploadPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="aes-display text-3xl font-semibold italic">Upload product</h1>
      <Card className="mt-8 space-y-6">
        <div>
          <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Product name</label>
          <Input placeholder="Cloud Vessel" />
        </div>
        <div>
          <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Description</label>
          <textarea className="aes-input min-h-32 resize-y" placeholder="Tell the story of your piece..." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Price</label>
            <Input type="number" placeholder="68" />
          </div>
          <div>
            <label className="aes-mono mb-2 block text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Category</label>
            <Input placeholder="Home" />
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-[var(--aes-border)] p-8 text-center text-sm text-[var(--aes-charcoal-muted)]">
          Drop photos or videos here
        </div>
        <Button variant="secondary" className="gap-2 w-full sm:w-auto">
          <Sparkles className="h-4 w-4" />
          Generate description with AI
        </Button>
        <Button className="w-full sm:w-auto">Publish product</Button>
      </Card>
    </div>
  );
}
