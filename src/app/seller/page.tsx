import { Card } from "@/components/aesthetics/ui/card";
import { DollarSign, Eye, Package, TrendingUp } from "lucide-react";

const STATS = [
  { label: "Revenue", value: "$4,280", change: "+12%", icon: DollarSign },
  { label: "Orders", value: "38", change: "+5", icon: Package },
  { label: "Views", value: "2.4k", change: "+18%", icon: Eye },
  { label: "Conversion", value: "3.2%", change: "+0.4%", icon: TrendingUp },
];

export default function SellerOverviewPage() {
  return (
    <div>
      <p className="aes-mono text-[10px] uppercase tracking-[0.3em] text-[var(--aes-dusty)]">Dashboard</p>
      <h1 className="aes-display mt-2 text-3xl font-semibold italic text-[var(--aes-charcoal)]">Overview</h1>
      <p className="mt-2 text-[var(--aes-charcoal-muted)]">Atelier Lumen · Verified seller</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, change, icon: Icon }) => (
          <Card key={label} hover={false} className="flex items-start justify-between">
            <div>
              <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--aes-charcoal)]">{value}</p>
              <p className="mt-1 text-sm text-[var(--aes-royal)]">{change}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(27,79,156,0.08)]">
              <Icon className="h-5 w-5 text-[var(--aes-royal)]" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-[var(--aes-charcoal)]">Recent orders</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {["Cloud Vessel × 2", "Arc Lamp × 1", "Taper Set × 3"].map((o) => (
              <li key={o} className="flex justify-between border-b border-[var(--aes-border)] pb-3 text-[var(--aes-charcoal-muted)]">
                <span>{o}</span>
                <span className="text-[var(--aes-charcoal)]">Processing</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold text-[var(--aes-charcoal)]">Inventory alerts</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--aes-charcoal-muted)]">
            <li>Cloud Vessel — 4 left</li>
            <li>Midnight Taper Set — low stock</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
