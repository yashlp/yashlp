"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/aesthetics/ui/card";
import { Badge } from "@/components/aesthetics/ui/badge";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<
    { id: string; businessName: string; tagline: string | null; status: string; verified: boolean }[]
  >([]);

  useEffect(() => {
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then((d) => setSellers(d.sellers || []));
  }, []);

  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Sellers</h1>
      <div className="mt-8 space-y-3">
        {sellers.map((s) => (
          <Card key={s.id} hover={false} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{s.businessName}</p>
              <p className="text-sm text-[var(--aes-charcoal-muted)]">{s.tagline}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={s.verified ? "royal" : "muted"}>{s.verified ? "Verified" : "Pending"}</Badge>
              <Badge variant="muted">{s.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
