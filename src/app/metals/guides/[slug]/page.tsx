import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/lib/metals/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) return { title: "Guide" };
  return { title: guide.title, description: guide.dek };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  return (
    <article className="jk-wrap max-w-3xl py-16">
      <p className="text-sm text-neutral-500">
        <Link href="/metals/guides">Guides</Link>
        <span className="mx-2">/</span>
        {guide.kicker}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">{guide.title}</h1>
      <p className="mt-3 text-neutral-400">{guide.dek}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-neutral-600">Updated {guide.updated}</p>
      {guide.body.map((p) => (
        <p key={p.slice(0, 32)} className="mt-6 text-lg leading-relaxed text-neutral-300">
          {p}
        </p>
      ))}
    </article>
  );
}
