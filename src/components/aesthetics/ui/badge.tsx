export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "cobalt" | "coral" | "sage" | "lavender" | "royal" | "muted";
  className?: string;
}) {
  const styles: Record<string, string> = {
    default: "bg-[var(--aes-sand-deep)] text-[var(--aes-ink-muted)]",
    cobalt: "bg-[var(--aes-forest)]/10 text-[var(--aes-forest)]",
    coral: "bg-[var(--aes-gold)]/15 text-[var(--aes-gold)]",
    sage: "bg-[var(--aes-moss)]/15 text-[var(--aes-forest)]",
    lavender: "bg-[var(--aes-stone)]/15 text-[var(--aes-stone)]",
    royal: "bg-[var(--aes-forest)]/10 text-[var(--aes-forest)]",
    muted: "border border-[var(--aes-border)] text-[var(--aes-ink-muted)]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.15em] ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
