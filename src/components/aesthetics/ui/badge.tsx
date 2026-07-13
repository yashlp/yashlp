import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "royal" | "muted";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "aes-mono inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider",
        variant === "default" && "bg-[var(--aes-ivory-deep)] text-[var(--aes-charcoal-muted)]",
        variant === "royal" && "bg-[rgba(27,79,156,0.08)] text-[var(--aes-royal)]",
        variant === "muted" && "border border-[var(--aes-border)] text-[var(--aes-charcoal-muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
