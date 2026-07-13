"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";

type PO = {
  id: string;
  poNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  orderDate: string;
  supplier: { brandName: string };
  lines: { id: string; name: string; quantityOrdered: number; quantityReceived: number; unitCost: number }[];
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function PurchasesPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PO[]>([]);
  const [receiving, setReceiving] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/admin/purchases").then((r) => r.json()).then((d) => setPurchaseOrders(d.purchaseOrders || []));
  }

  useEffect(() => { load(); }, []);

  async function receive(lineId: string, poId: string) {
    const qty = Number(receiving[lineId]);
    if (!qty) return;
    await fetch(`/api/admin/purchases/${poId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId, quantityReceived: qty }),
    });
    load();
  }

  async function markPaid(poId: string) {
    await fetch(`/api/admin/purchases/${poId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "PAID" }),
    });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Purchase orders</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">Track inventory purchases from suppliers</p>
        </div>
        <Link href="/admin/purchases/new"><Button>New PO</Button></Link>
      </div>

      <div className="mt-8 space-y-4">
        {purchaseOrders.map((po) => (
          <Card key={po.id} hover={false}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{po.poNumber}</p>
                <p className="text-sm text-[var(--aes-charcoal-muted)]">{po.supplier.brandName}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold">{formatInr(po.total)}</p>
                <p className="text-[var(--aes-dusty)]">{po.status} · {po.paymentStatus}</p>
                {po.paymentStatus !== "PAID" && (
                  <button type="button" onClick={() => markPaid(po.id)} className="mt-1 text-xs text-[var(--aes-royal)]">Mark paid</button>
                )}
              </div>
            </div>
            <ul className="mt-4 space-y-3 border-t border-[var(--aes-border)] pt-4 text-sm">
              {po.lines.map((line) => (
                <li key={line.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>{line.name} — ordered {line.quantityOrdered}, received {line.quantityReceived}</span>
                  {line.quantityReceived < line.quantityOrdered && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="aes-input w-20 py-1"
                        placeholder="Qty"
                        value={receiving[line.id] || ""}
                        onChange={(e) => setReceiving({ ...receiving, [line.id]: e.target.value })}
                      />
                      <Button type="button" variant="secondary" onClick={() => receive(line.id, po.id)}>Receive</Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
