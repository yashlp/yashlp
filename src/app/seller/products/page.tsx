import { Card } from "@/components/aesthetics/ui/card";

export default function SellerProductsPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Products</h1>
      <Card className="mt-8 p-8 text-center text-[var(--aes-charcoal-muted)]">
        Seller product management connects to the same commerce database. Use the platform admin to approve listings.
      </Card>
    </div>
  );
}
