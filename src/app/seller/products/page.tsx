import Link from "next/link";
import { Card } from "@/components/aesthetics/ui/card";
import { Button } from "@/components/aesthetics/ui/button";
import { Badge } from "@/components/aesthetics/ui/badge";
import { PRODUCTS } from "@/lib/aesthetics/products";

export default function SellerProductsPage() {
  const myProducts = PRODUCTS.filter((p) => p.brandId === "b1");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="aes-display text-3xl font-semibold italic">Products</h1>
          <p className="mt-1 text-[var(--aes-charcoal-muted)]">{myProducts.length} active listings</p>
        </div>
        <Link href="/seller/upload"><Button>Upload product</Button></Link>
      </div>
      <div className="mt-8 space-y-4">
        {myProducts.map((p) => (
          <Card key={p.id} hover={false} className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">${p.price} · {p.reviewCount} reviews</p>
            </div>
            <Badge variant={p.inStock ? "royal" : "muted"}>{p.inStock ? "Live" : "Draft"}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
