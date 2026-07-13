import { Card } from "@/components/aesthetics/ui/card";
import { Badge } from "@/components/aesthetics/ui/badge";
import { BRANDS } from "@/lib/aesthetics/brands";

export default function AdminSellersPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Sellers</h1>
      <div className="mt-8 space-y-3">
        {BRANDS.map((b) => (
          <Card key={b.id} hover={false} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">{b.tagline}</p>
            </div>
            <Badge variant={b.verified ? "royal" : "muted"}>{b.verified ? "Verified" : "Pending"}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
