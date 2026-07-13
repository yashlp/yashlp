"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  courier: string | null;
  trackingNumber: string | null;
};

export default function ShippingPage() {
  const [pending, setPending] = useState<Order[]>([]);
  const [shipped, setShipped] = useState<Order[]>([]);
  const [courier, setCourier] = useState("Shiprocket");
  const [tracking, setTracking] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/admin/shipping").then((r) => r.json()).then((d) => {
      setPending(d.pending || []);
      setShipped(d.shipped || []);
    });
  }

  useEffect(() => { load(); }, []);

  async function ship(orderId: string, generateLabel = false) {
    await fetch("/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        courier,
        trackingNumber: tracking[orderId],
        generateLabel,
      }),
    });
    load();
  }

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Shipping</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Courier labels and tracking — Shiprocket, Delhivery</p>

      <div className="mt-6">
        <select className="aes-input max-w-xs" value={courier} onChange={(e) => setCourier(e.target.value)}>
          {["Shiprocket", "Delhivery", "BlueDart", "DTDC"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <h2 className="mt-10 font-semibold">To ship ({pending.length})</h2>
      <div className="mt-4 space-y-3">
        {pending.map((o) => (
          <Card key={o.id} hover={false}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href={`/admin/orders/${o.id}`} className="font-medium text-[var(--aes-royal)]">{o.orderNumber}</Link>
              <span className="text-sm text-[var(--aes-dusty)]">{o.status}</span>
              <Input
                placeholder="Tracking #"
                className="max-w-[180px]"
                value={tracking[o.id] || ""}
                onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })}
              />
              <Button variant="secondary" onClick={() => ship(o.id, true)}>Label</Button>
              <Button onClick={() => ship(o.id)}>Ship</Button>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 font-semibold">Shipped</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {shipped.map((o) => (
          <li key={o.id} className="flex justify-between border-b py-2">
            <span>{o.orderNumber}</span>
            <span className="text-[var(--aes-charcoal-muted)]">{o.courier} · {o.trackingNumber || "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
