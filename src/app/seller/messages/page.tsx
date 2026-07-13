import { Card } from "@/components/aesthetics/ui/card";

export default function SellerMessagesPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Messages</h1>
      <Card className="mt-8 p-8 text-center text-[var(--aes-charcoal-muted)]">
        Customer messages will appear here. Connect your inbox in settings.
      </Card>
    </div>
  );
}
