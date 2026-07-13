import { Card } from "@/components/aesthetics/ui/card";

type Props = {
  title: string;
  description: string;
  features?: string[];
};

export function AdminModulePlaceholder({ title, description, features }: Props) {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic text-[var(--aes-charcoal)]">{title}</h1>
      <p className="mt-2 max-w-2xl text-[var(--aes-charcoal-muted)]">{description}</p>
      {features && features.length > 0 && (
        <Card className="mt-8" hover={false}>
          <p className="aes-mono text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Coming in this module</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--aes-charcoal)]">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-[var(--aes-royal)]">·</span>
                {f}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
