import { Card } from "@/components/aesthetics/ui/card";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Users</h1>
      <Card className="mt-8 p-8 text-center text-[var(--aes-charcoal-muted)]">
        User management — integrate Clerk or Firebase Auth for production.
      </Card>
    </div>
  );
}
