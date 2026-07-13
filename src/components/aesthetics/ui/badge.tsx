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
    cobalt: "bg-violet-100 text-violet-700",
    coral: "bg-pink-100 text-[var(--aes-pink)]",
    sage: "bg-teal-100 text-teal-700",
    lavender: "bg-purple-100 text-purple-700",
    royal: "bg-pink-100 text-[var(--aes-pink)]",
    muted: "border border-[var(--aes-border)] text-[var(--aes-ink-muted)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
