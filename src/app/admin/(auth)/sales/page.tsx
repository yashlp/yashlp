import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";

export default function SalesPage() {
  const links = [
    { href: "/admin/orders", label: "Orders queue", detail: "New, packing, pickup, shipped" },
    { href: "/admin/payments", label: "Payments", detail: "Online + COD status and failures" },
    { href: "/admin/returns", label: "Returns", detail: "Refund and return workload" },
    { href: "/admin/analytics", label: "Sales analytics", detail: "Revenue, profit, AOV, city insights" },
  ];

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Sales</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Daily selling operations and what to do next.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card hover={false} className="h-full">
              <p className="font-semibold text-[var(--aes-royal)]">{item.label}</p>
              <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">{item.detail}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
