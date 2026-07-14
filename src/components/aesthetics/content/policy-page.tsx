import { ConsumerPage } from "@/components/aesthetics/layout/consumer-page";
import { DEFAULT_POLICY_CONTENT } from "@/lib/aesthetics/policy-content";
import { contentService } from "@/lib/commerce/services/content.service";

function renderBody(body: string) {
  return body.split("\n\n").map((block, i) => {
    const lines = block.split("\n");
    return (
      <div key={i} className="space-y-2">
        {lines.map((line, j) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <h2 key={j} className="pt-4 text-base font-semibold text-[var(--gallery-ink,#1e1e1c)]">
                {line.replace(/\*\*/g, "")}
              </h2>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <p key={j} className="pl-3 text-[var(--gallery-muted,#6f6a63)] before:mr-2 before:content-['·']">
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

export async function PolicyPageView({ contentKey }: { contentKey: string }) {
  const fallback = DEFAULT_POLICY_CONTENT[contentKey];
  let title = fallback?.title || contentKey;
  let body = fallback?.body || "";

  try {
    const row = await contentService.getByKey(contentKey);
    if (row?.isPublished) {
      if (row.title) title = row.title;
      if (row.body) body = row.body;
    }
  } catch {
    /* use fallback */
  }

  return (
    <ConsumerPage room="ivory">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="aes-gallery-eyebrow">Only Aesthetics</p>
        <h1 className="aes-gallery-title mt-3">{title}</h1>
        <div className="mt-10 space-y-6 text-sm">{renderBody(body)}</div>
      </main>
    </ConsumerPage>
  );
}
