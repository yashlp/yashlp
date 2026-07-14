"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{
    customer: {
      name: string | null;
      email: string | null;
      phone: string | null;
      loyaltyPoints: number;
      loyaltyLevel: string;
      notes: string | null;
    };
    metrics: {
      orderCount: number;
      lifetimeValue: number;
      averageSpend: number;
      reviewCount: number;
      returnCount: number;
    };
    favouriteCategories: { name: string; count: number }[];
    orders: { id: string; orderNumber: string; total: number; status: string; createdAt: string }[];
    wishlist: { id: string; name: string; slug: string; price: number }[];
    returns: { id: string; reason: string | null; status: string; orderNumber: string }[];
    reviews: { id: string; rating: number; body: string | null; product: { name: string } }[];
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  if (!data) return <div className="aes-skeleton h-40 rounded-2xl" />;

  const { customer, metrics } = data;

  return (
    <div>
      <Link href="/admin/customers" className="text-sm text-[var(--aes-royal)]">
        ← Customers
      </Link>
      <h1 className="aes-display mt-4 text-3xl font-semibold italic">
        {customer.name || customer.email || "Customer"}
      </h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        {customer.email || "—"} · {customer.phone || "—"} · {customer.loyaltyLevel} · {customer.loyaltyPoints} pts
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Orders", String(metrics.orderCount)],
          ["Lifetime value", formatInr(metrics.lifetimeValue)],
          ["Average spend", formatInr(metrics.averageSpend)],
          ["Reviews", String(metrics.reviewCount)],
          ["Returns", String(metrics.returnCount)],
        ].map(([label, value]) => (
          <Card key={label} hover={false}>
            <p className="text-xs text-[var(--aes-dusty)]">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Favourite categories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.favouriteCategories.map((c) => (
              <li key={c.name} className="flex justify-between border-b py-2">
                <span>{c.name}</span>
                <span>{c.count}</span>
              </li>
            ))}
            {!data.favouriteCategories.length && <li className="text-[var(--aes-dusty)]">No purchases yet</li>}
          </ul>
        </Card>
        <Card hover={false}>
          <h2 className="font-semibold">Wishlist signals</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.wishlist.map((p) => (
              <li key={p.id} className="flex justify-between border-b py-2">
                <span>{p.name}</span>
                <span>{formatInr(p.price)}</span>
              </li>
            ))}
            {!data.wishlist.length && (
              <li className="text-[var(--aes-dusty)]">No wishlist events tracked yet</li>
            )}
          </ul>
        </Card>
      </div>

      <Card className="mt-6" hover={false}>
        <h2 className="font-semibold">Orders</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {data.orders.map((o) => (
            <li key={o.id} className="flex justify-between border-b py-2">
              <Link href={`/admin/orders/${o.id}`} className="text-[var(--aes-royal)]">
                {o.orderNumber}
              </Link>
              <span>
                {formatInr(o.total)} · {o.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <h2 className="font-semibold">Returns</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.returns.map((r) => (
              <li key={r.id} className="border-b py-2">
                {r.orderNumber} · {r.reason || "—"} · {r.status}
              </li>
            ))}
            {!data.returns.length && <li className="text-[var(--aes-dusty)]">No returns</li>}
          </ul>
        </Card>
        <Card hover={false}>
          <h2 className="font-semibold">Reviews</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.reviews.map((r) => (
              <li key={r.id} className="border-b py-2">
                ★{r.rating} · {r.product.name}
                {r.body && <span className="block text-[var(--aes-charcoal-muted)]">{r.body}</span>}
              </li>
            ))}
            {!data.reviews.length && <li className="text-[var(--aes-dusty)]">No reviews</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
