"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

type ReturnRow = {
  id: string;
  status: string;
  reason: string | null;
  type: string;
  refundAmount: number | null;
  order: { orderNumber: string; total: number };
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRow[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/admin/returns").then((r) => r.json()).then((d) => setReturns(d.returns || []));
  }

  useEffect(() => { load(); }, []);

  async function approve(id: string, orderTotal: number) {
    const refundAmount = Number(amounts[id]) || orderTotal;
    await fetch("/api/admin/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", id, refundAmount }),
    });
    load();
  }

  async function reject(id: string) {
    await fetch("/api/admin/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", id }),
    });
    load();
  }

  const reasonBuckets = [
    "Damaged",
    "Wrong Product",
    "Late Delivery",
    "Quality Issue",
    "Changed Mind",
  ].map((label) => {
    const count = returns.filter((r) => {
      const reason = (r.reason || "").toLowerCase();
      if (label === "Damaged") return reason.includes("damage");
      if (label === "Wrong Product") return reason.includes("wrong");
      if (label === "Late Delivery") return reason.includes("late") || reason.includes("delay");
      if (label === "Quality Issue") return reason.includes("quality");
      if (label === "Changed Mind") return reason.includes("change") || reason.includes("mind");
      return false;
    }).length;
    return { label, count };
  });

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Returns & Refunds</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Approve returns, process refunds, restock inventory</p>

      <Card className="mt-8" hover={false}>
        <h2 className="font-semibold">Return reasons dashboard</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {reasonBuckets.map((b) => (
            <div key={b.label} className="rounded-xl border border-[var(--aes-border)] px-3 py-3">
              <p className="text-xs text-[var(--aes-dusty)]">{b.label}</p>
              <p className="text-2xl font-semibold">{b.count}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-8 space-y-4">
        {returns.length === 0 && <Card hover={false}><p className="text-[var(--aes-charcoal-muted)]">No return requests</p></Card>}
        {returns.map((r) => (
          <Card key={r.id} hover={false}>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-semibold">{r.order.orderNumber}</p>
                <p className="text-sm text-[var(--aes-charcoal-muted)]">{r.reason} · {r.type}</p>
                <p className="mt-1 text-xs">{r.status}</p>
              </div>
              {r.status === "REQUESTED" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={String(r.order.total)}
                    className="w-28"
                    value={amounts[r.id] || ""}
                    onChange={(e) => setAmounts({ ...amounts, [r.id]: e.target.value })}
                  />
                  <Button onClick={() => approve(r.id, r.order.total)}>Approve</Button>
                  <Button variant="secondary" onClick={() => reject(r.id)}>Reject</Button>
                </div>
              )}
              {r.refundAmount != null && <p className="text-sm">Refund: {formatInr(r.refundAmount)}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
