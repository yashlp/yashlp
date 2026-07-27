import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";

export default function CatalogHubPage() {
  const modules = [
    { href: "/admin/products", title: "Products", copy: "SEO, media, videos, related products" },
    { href: "/admin/collections", title: "Collections", copy: "Category-level merchandising" },
    { href: "/admin/inventory", title: "Inventory", copy: "Stock and reorder monitoring" },
    { href: "/admin/suppliers", title: "Suppliers", copy: "Sourcing, lead time, purchase history" },
  ];

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Catalog</h1>
      <p className="mt-1 text-[var(--aes-charcoal-muted)]">
        Everything related to products, collections, inventory, and suppliers.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card hover={false}>
              <p className="font-semibold text-[var(--aes-royal)]">{m.title}</p>
              <p className="mt-1 text-sm text-[var(--aes-charcoal-muted)]">{m.copy}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
