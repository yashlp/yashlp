import { Card } from "@/components/aesthetics/ui/card";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Orders</h1>
      <Card className="mt-8 p-8 text-center text-[var(--aes-charcoal-muted)]">
        Order management with Stripe payment abstraction — connect backend to enable live data.
      </Card>
    </div>
  );
}
