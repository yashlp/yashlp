"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/aesthetics/ui/button";
import { Card } from "@/components/aesthetics/ui/card";
import { Input } from "@/components/aesthetics/ui/input";

const NEXT_STATUS: Record<string, { status: string; label: string }[]> = {
  CONFIRMED: [{ status: "PACKED", label: "Mark packed" }],
  PACKED: [{ status: "READY_TO_SHIP", label: "Ready to ship" }],
  READY_TO_SHIP: [{ status: "SHIPPED", label: "Mark shipped" }],
  SHIPPED: [{ status: "DELIVERED", label: "Mark delivered" }],
};

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

type OrderDetail = {
  orderNumber: string;
  status: string;
  total: number;
  courier: string | null;
  trackingNumber: string | null;
  shippingAddress: string | null;
  items: { quantity: number; unitPrice: number; product: { name: string } }[];
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");

  function load() {
    fetch(`/api/admin/orders/${id}`).then((r) => r.json()).then((d) => {
      setOrder(d.order);
      setCourier(d.order?.courier || "");
      setTracking(d.order?.trackingNumber || "");
    });
  }

  useEffect(() => { if (id) load(); }, [id]);

  async function updateStatus(status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, courier, trackingNumber: tracking }),
    });
    load();
  }

  async function generateLabel() {
    await fetch("/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, courier: courier || "Shiprocket", generateLabel: true }),
    });
    load();
  }

  if (!order) return <div className="aes-skeleton h-40 rounded-2xl" />;

  const status = order.status;
  const actions = NEXT_STATUS[status] || [];

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-[var(--aes-royal)]">← Orders</Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">{order.orderNumber}</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">Status: {status}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Items</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between border-b py-2">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatInr(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold">Total: {formatInr(order.total)}</p>
        </Card>

        <Card hover={false}>
          <h2 className="font-semibold">Fulfillment</h2>
          <div className="mt-4 space-y-3">
            <select className="aes-input w-full" value={courier} onChange={(e) => setCourier(e.target.value)}>
              <option value="">Courier</option>
              {["Shiprocket", "Delhivery", "BlueDart", "DTDC", "Manual"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Input placeholder="Tracking number" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {actions.map((a) => (
                <Button key={a.status} onClick={() => updateStatus(a.status)}>{a.label}</Button>
              ))}
              <Button variant="secondary" onClick={generateLabel}>Shipping label</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={`/admin/orders/${id}/invoice`} className="text-[var(--aes-royal)]" target="_blank">Invoice</Link>
              <Link href={`/admin/orders/${id}/packing-slip`} className="text-[var(--aes-royal)]" target="_blank">Packing slip</Link>
            </div>
          </div>
          {order.shippingAddress && (
            <pre className="mt-4 whitespace-pre-wrap text-xs text-[var(--aes-charcoal-muted)]">{order.shippingAddress}</pre>
          )}
        </Card>
      </div>
    </div>
  );
}
