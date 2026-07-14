"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  usedCount: number;
  maxUses: number | null;
  isActive: boolean;
};

type Campaign = {
  id: string;
  name: string;
  channel: string;
  status: string;
  endsAt: string | null;
};

type GiftCard = { id: string; code: string; balance: number; initialBalance: number; status: string };

export default function MarketingPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENT",
    discountValue: "10",
    minOrderValue: "999",
  });
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    channel: "EMAIL",
    subject: "",
    body: "",
    status: "DRAFT",
  });
  const [giftAmount, setGiftAmount] = useState("500");

  function load() {
    fetch("/api/admin/coupons").then((r) => r.json()).then((d) => setCoupons(d.coupons || []));
    fetch("/api/admin/marketing/campaigns")
      .then((r) => r.json())
      .then((d) => {
        setCampaigns(d.campaigns || []);
        setGiftCards(d.giftCards || []);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue),
      }),
    });
    setShowForm(false);
    load();
  }

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/marketing/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaignForm),
    });
    setCampaignForm({ name: "", channel: "EMAIL", subject: "", body: "", status: "DRAFT" });
    load();
  }

  async function createGiftCard() {
    await fetch("/api/admin/marketing/gift-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(giftAmount) }),
    });
    load();
  }

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Marketing</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">
            Coupons, email/SMS/WhatsApp/push, gift cards, referrals & loyalty
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "New coupon"}</Button>
      </div>

      {showForm && (
        <Card className="mt-8">
          <form onSubmit={createCoupon} className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Coupon code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <select className="aes-input" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="PERCENT">Percent off</option>
              <option value="FIXED">Fixed amount (₹)</option>
            </select>
            <Input type="number" placeholder="Discount value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
            <Input type="number" placeholder="Min order (₹)" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
            <div className="sm:col-span-2">
              <Button type="submit">Create coupon</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-8 space-y-3">
        {coupons.map((c) => (
          <Card key={c.id} hover={false} className="flex justify-between p-4">
            <div>
              <p className="font-semibold">{c.code}</p>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">{c.description}</p>
            </div>
            <p className="text-sm">
              {c.discountType === "PERCENT" ? `${c.discountValue}%` : `₹${c.discountValue}`} · {c.usedCount} uses
            </p>
          </Card>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Campaigns — Email · SMS · WhatsApp · Push</h2>
        <Card className="mt-4">
          <form onSubmit={createCampaign} className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Campaign name" value={campaignForm.name} onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })} required />
            <select className="aes-input" value={campaignForm.channel} onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value })}>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="PUSH">Push</option>
            </select>
            <Input placeholder="Subject / headline" value={campaignForm.subject} onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })} />
            <select className="aes-input" value={campaignForm.status} onChange={(e) => setCampaignForm({ ...campaignForm, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ACTIVE">Active</option>
              <option value="ENDED">Ended</option>
            </select>
            <textarea className="aes-input sm:col-span-2 min-h-24" placeholder="Message body" value={campaignForm.body} onChange={(e) => setCampaignForm({ ...campaignForm, body: e.target.value })} />
            <Button type="submit">Save campaign</Button>
          </form>
        </Card>
        <div className="mt-4 space-y-2">
          {campaigns.map((c) => (
            <Card key={c.id} hover={false} className="flex justify-between p-4 text-sm">
              <span className="font-medium">{c.name}</span>
              <span>
                {c.channel} · {c.status}
              </span>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Gift cards</h2>
          <div className="mt-3 flex gap-2">
            <Input type="number" value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} />
            <Button type="button" onClick={createGiftCard}>
              Issue
            </Button>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {giftCards.map((g) => (
              <li key={g.id} className="flex justify-between border-b py-2">
                <span className="font-mono">{g.code}</span>
                <span>
                  ₹{g.balance} / ₹{g.initialBalance}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card hover={false}>
          <h2 className="font-semibold">Loyalty · Referrals · Birthday</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--aes-charcoal-muted)]">
            <li>
              <strong className="text-[var(--aes-charcoal)]">Loyalty points</strong> — tracked on each customer profile (CRM).
            </li>
            <li>
              <strong className="text-[var(--aes-charcoal)]">Referral program</strong> — ₹100 / ₹100 default rewards configurable via DB campaigns.
            </li>
            <li>
              <strong className="text-[var(--aes-charcoal)]">Birthday offers</strong> — schedule an EMAIL campaign with audience “birthday” and activate around the date.
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
