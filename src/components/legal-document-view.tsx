import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LegalDocument } from "@/lib/legal-engine";

export function LegalDocumentView({
  document,
  backHref = "/",
}: {
  document: LegalDocument;
  backHref?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-10">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to CivicLens
      </Link>

      <h1 className="text-3xl font-bold text-stone-900">{document.title}</h1>
      <p className="mt-2 text-sm text-stone-500">
        Version {document.version} · Last updated: {document.lastUpdated}
      </p>
      <p className="mt-1 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-800">
        {document.jurisdictionNote} · Profile: {document.legalProfile}
      </p>

      <div className="prose prose-stone mt-8 max-w-none space-y-6 text-sm leading-relaxed text-stone-700">
        {document.sections.map((section) => (
          <section key={section.id}>
            <h2 className="text-lg font-semibold text-stone-900">{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-orange-100 pt-6 text-xs">
        <Link href="/terms" className="text-orange-600 hover:underline">
          Terms
        </Link>
        <Link href="/privacy" className="text-orange-600 hover:underline">
          Privacy
        </Link>
        <Link href="/content-policy" className="text-orange-600 hover:underline">
          Content Guidelines
        </Link>
      </div>
    </div>
  );
}
