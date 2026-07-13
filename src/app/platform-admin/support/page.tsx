import { Card } from "@/components/aesthetics/ui/card";

export default function AdminSupportPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Support</h1>
      <Card className="mt-8 p-8 text-center text-[var(--aes-charcoal-muted)]">
        Customer and seller support tickets — no open tickets in demo.
      </Card>
    </div>
  );
}
