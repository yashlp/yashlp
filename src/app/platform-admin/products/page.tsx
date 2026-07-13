import { Card } from "@/components/aesthetics/ui/card";
import { Badge } from "@/components/aesthetics/ui/badge";
import { PRODUCTS } from "@/lib/aesthetics/products";
import { getBrand } from "@/lib/aesthetics/brands";

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Products</h1>
      <Card className="mt-8 overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--aes-border)] bg-[var(--aes-ivory)]">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Brand</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id} className="border-b border-[var(--aes-border)]">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-[var(--aes-charcoal-muted)]">{getBrand(p.brandId)?.name}</td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4"><Badge variant="royal">Approved</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
