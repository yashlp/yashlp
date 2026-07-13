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
    default: "bg-[var(--aes-cream-deep)] text-[var(--aes-ink-muted)]",
    cobalt: "bg-blue-100 text-blue-800 font-semibold",
    coral: "bg-rose-100 text-rose-700 font-semibold",
    sage: "bg-emerald-100 text-emerald-800 font-semibold",
    lavender: "bg-violet-100 text-violet-800 font-semibold",
    royal: "bg-blue-100 text-blue-800 font-semibold",
    muted: "border border-[var(--aes-border)] text-[var(--aes-ink-muted)]",
  };

  return (
    <span
      className={`aes-mono inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
