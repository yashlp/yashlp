"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/aesthetics/ui/card";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/suppliers/${id}`).then((r) => r.json()).then((d) => setSupplier(d.supplier));
  }, [id]);

  if (!supplier) return <div className="aes-skeleton h-40 rounded-2xl" />;

  const pos = supplier.purchaseOrders as { poNumber: string; total: number; status: string; paymentStatus: string }[];
  const products = supplier.products as { name: string; stock: number; sku: string | null }[];

  return (
    <div>
      <Link href="/admin/suppliers" className="text-sm text-[var(--aes-royal)]">← Suppliers</Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">{supplier.brandName as string}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Contact</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--aes-dusty)]">Contact person</dt><dd>{(supplier.contactPerson as string) || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--aes-dusty)]">Mobile</dt><dd>{(supplier.mobile as string) || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--aes-dusty)]">Email</dt><dd>{(supplier.email as string) || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--aes-dusty)]">GST</dt><dd>{(supplier.gstNumber as string) || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--aes-dusty)]">PAN</dt><dd>{(supplier.panNumber as string) || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--aes-dusty)]">Outstanding</dt><dd>{formatInr((supplier.outstandingBalance as number) || 0)}</dd></div>
          </dl>
        </Card>

        <Card hover={false}>
          <h2 className="font-semibold">Products supplied ({products?.length || 0})</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(products || []).map((p, i) => (
              <li key={i} className="flex justify-between border-b py-2">
                <span>{p.name}</span>
                <span className="text-[var(--aes-dusty)]">Stock {p.stock}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6" hover={false}>
        <h2 className="font-semibold">Purchase history</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {(pos || []).map((po, i) => (
            <li key={i} className="flex justify-between border-b py-2">
              <span>{po.poNumber}</span>
              <span>{formatInr(po.total)} · {po.status} · {po.paymentStatus}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
