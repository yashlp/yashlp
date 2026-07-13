"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PackingSlipPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then((r) => r.json()).then((d) => setOrder(d.order));
  }, [id]);

  if (!order) return null;

  const items = order.items as { quantity: number; product: { name: string; sku: string | null } }[];

  return (
    <div className="mx-auto max-w-lg bg-white p-8 print:p-4">
      <div className="mb-6 flex justify-between print:hidden">
        <Link href={`/admin/orders/${id}`} className="text-sm text-[var(--aes-royal)]">← Back</Link>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-[var(--aes-charcoal)] px-4 py-2 text-sm text-white">Print slip</button>
      </div>
      <h1 className="text-xl font-bold">Packing Slip</h1>
      <p className="text-sm">Order: {order.orderNumber as string}</p>
      <pre className="mt-4 whitespace-pre-wrap text-sm">{order.shippingAddress as string}</pre>
      <ul className="mt-6 space-y-2 border-t pt-4 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between">
            <span>{item.product.name}</span>
            <span>× {item.quantity}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-xs text-gray-400">Only Aesthetics — packed with care</p>
    </div>
  );
}
