import { Card } from "@/components/aesthetics/ui/card";

export default function SellerAnalyticsPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Analytics</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Revenue (30d)</p>
          <div className="mt-6 flex h-40 items-end gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-[var(--aes-royal)] opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Card>
        <Card>
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Top products</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between"><span>Cloud Vessel</span><span className="text-[var(--aes-charcoal-muted)]">142 views</span></li>
            <li className="flex justify-between"><span>Arc Floor Lamp</span><span className="text-[var(--aes-charcoal-muted)]">98 views</span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
