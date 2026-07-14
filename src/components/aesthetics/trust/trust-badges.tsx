import { CreditCard, Lock, Package, RefreshCcw, ShieldCheck, Truck } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, title: "Secure payments", body: "Encrypted checkout · UPI & cards" },
  { icon: RefreshCcw, title: "Easy returns", body: "7-day hassle-free returns" },
  { icon: Truck, title: "Tracked shipping", body: "Free over ₹999 · 3–7 days" },
  { icon: Package, title: "Packed with care", body: "Protective maker packaging" },
];

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 gap-3"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {BADGES.map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="flex items-start gap-3 rounded-2xl border border-[var(--gallery-border,#ddd7cf)] bg-[var(--gallery-card,#fcfbf8)] px-4 py-3"
        >
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gallery-blue,#2c5aa0)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--gallery-ink,#1e1e1c)]">{title}</p>
            <p className="mt-0.5 text-xs text-[var(--gallery-muted,#6f6a63)]">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SecurePaymentRow() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--gallery-muted,#6f6a63)]">
      <span className="inline-flex items-center gap-1.5 font-medium text-[var(--gallery-ink,#1e1e1c)]">
        <Lock className="h-3.5 w-3.5" /> Secure checkout
      </span>
      <span className="inline-flex items-center gap-1.5">
        <CreditCard className="h-3.5 w-3.5" /> UPI · Cards · Netbanking
      </span>
      <span>Powered by Razorpay</span>
    </div>
  );
}
