"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function OrderInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then((r) => r.json()).then((d) => setOrder(d.order));
  }, [id]);

  if (!order) return null;

  const items = order.items as { quantity: number; unitPrice: number; total: number; product: { name: string; sku: string | null } }[];

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 print:p-4">
      <div className="mb-6 flex justify-between print:hidden">
        <Link href={`/admin/orders/${id}`} className="text-sm text-[var(--aes-royal)]">← Back</Link>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-[var(--aes-charcoal)] px-4 py-2 text-sm text-white">Print invoice</button>
      </div>
      <h1 className="text-2xl font-bold">Only Aesthetics</h1>
      <p className="text-sm text-gray-500">Tax Invoice</p>
      <div className="mt-6 flex justify-between text-sm">
        <div>
          <p className="font-semibold">Invoice #{order.orderNumber as string}</p>
          <p>{new Date(order.createdAt as string).toLocaleDateString("en-IN")}</p>
        </div>
        <div className="text-right">
          <p>GSTIN: 27AAAAA0000A1Z5</p>
        </div>
      </div>
      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Item</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{item.product.name}{item.product.sku ? ` (${item.product.sku})` : ""}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{formatInr(item.unitPrice)}</td>
              <td className="py-2 text-right">{formatInr(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-y-1 text-right text-sm">
        <p>Subtotal: {formatInr(order.subtotal as number)}</p>
        <p>GST: {formatInr(order.tax as number)}</p>
        <p>Shipping: {formatInr(order.shipping as number)}</p>
        <p className="text-lg font-bold">Total: {formatInr(order.total as number)}</p>
      </div>
    </div>
  );
}
