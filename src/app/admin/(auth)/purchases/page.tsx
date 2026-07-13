"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";

type PO = {
  id: string;
  poNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  orderDate: string;
  expectedDelivery: string | null;
  supplier: { brandName: string };
  lines: { name: string; quantityOrdered: number; quantityReceived: number; unitCost: number }[];
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function PurchasesPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PO[]>([]);

  useEffect(() => {
    fetch("/api/admin/purchases")
      .then((r) => r.json())
      .then((d) => setPurchaseOrders(d.purchaseOrders || []));
  }, []);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Purchase orders</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Track inventory purchases from suppliers — cost, delivery, receiving</p>

      <div className="mt-8 space-y-4">
        {purchaseOrders.length === 0 && (
          <Card hover={false}>
            <p className="text-[var(--aes-charcoal-muted)]">No purchase orders yet. Create suppliers first, then record POs when you buy inventory.</p>
          </Card>
        )}
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
              </div>
            </div>
            <ul className="mt-4 space-y-1 border-t border-[var(--aes-border)] pt-4 text-sm">
              {po.lines.map((line, i) => (
                <li key={i} className="flex justify-between">
                  <span>{line.name} × {line.quantityOrdered}</span>
                  <span className="text-[var(--aes-charcoal-muted)]">
                    Received {line.quantityReceived}/{line.quantityOrdered} · {formatInr(line.unitCost)}/unit
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
