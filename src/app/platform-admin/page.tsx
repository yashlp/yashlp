import { Card } from "@/components/aesthetics/ui/card";
import { BRANDS } from "@/lib/aesthetics/brands";
import { PRODUCTS } from "@/lib/aesthetics/products";

export default function PlatformAdminPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic text-[var(--aes-charcoal)]">Platform overview</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Sellers", value: BRANDS.length },
          { label: "Products", value: PRODUCTS.length },
          { label: "Orders (30d)", value: "284" },
          { label: "GMV", value: "$18.2k" },
        ].map(({ label, value }) => (
          <Card key={label} hover={false}>
            <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <h2 className="font-semibold">Pending approvals</h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--aes-charcoal-muted)]">
          <li>Ether Scents — brand verification</li>
          <li>Crystal Water Bottle — product review</li>
        </ul>
      </Card>
    </div>
  );
}
