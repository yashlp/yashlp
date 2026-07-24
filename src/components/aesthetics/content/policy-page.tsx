import Link from "next/link";
import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { buildPolicyContent } from "@/lib/aesthetics/policy-content";
import { getBrandSettings } from "@/lib/commerce/brand-settings";

function renderBody(body: string) {
  return body.split("\n\n").map((block, i) => {
    const lines = block.split("\n");
    return (
      <div key={i} className="space-y-2">
        {lines.map((line, j) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <h2
                key={j}
                className="pt-4 text-base font-semibold text-[var(--gallery-ink,#1e1e1c)]"
              >
                {line.replace(/\*\*/g, "")}
              </h2>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <p
                key={j}
                className="pl-3 text-[var(--gallery-muted,#6f6a63)] before:mr-2 before:content-['·']"
              >
                {line.slice(2)}
              </p>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <p key={j} className="text-[var(--gallery-muted,#6f6a63)]">
                {line}
              </p>
            );
          }
          return (
            <p key={j} className="leading-relaxed text-[var(--gallery-muted,#6f6a63)]">
              {line}
            </p>
          );
        })}
      </div>
    );
  });
}

const RELATED: { href: string; label: string }[] = [
  { href: "/aesthetics/faq", label: "FAQ" },
  { href: "/aesthetics/shipping", label: "Shipping & Returns" },
  { href: "/aesthetics/privacy", label: "Privacy Policy" },
];

export async function PolicyPageView({ contentKey }: { contentKey: string }) {
  const brand = await getBrandSettings();
  const pages = buildPolicyContent({
    siteName: brand.siteName,
    supportEmail: brand.supportEmail,
  });
  const page = pages[contentKey];
  const title = page?.title || contentKey;
  const body = page?.body || "";

  return (
    <ConsumerPage room="ivory">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">{brand.siteName}</p>
        <h1 className="aes-gallery-title mt-3 text-balance">{title}</h1>
        <div className="mt-10 space-y-6 text-sm">{renderBody(body)}</div>

        <p className="mt-10 text-sm text-[var(--gallery-muted,#6f6a63)]">
          Questions?{" "}
          <a href={`mailto:${brand.supportEmail}`} className="text-[var(--gallery-blue,#2c5aa0)] underline">
            {brand.supportEmail}
          </a>
        </p>

        <nav
          className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--gallery-border,#ddd7cf)] pt-8 text-xs font-bold uppercase tracking-[0.16em] text-[var(--gallery-blue,#2c5aa0)]"
          aria-label="Policy pages"
        >
          {RELATED.map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </main>
    </ConsumerPage>
  );
}
