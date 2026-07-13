import { Card } from "@/components/aesthetics/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Analytics</h1>
      <Card className="mt-8 p-8">
        <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Platform metrics</p>
        <p className="mt-4 text-[var(--aes-charcoal-muted)]">DORA metrics, conversion funnels, and seller performance reports will live here.</p>
      </Card>
    </div>
  );
}
