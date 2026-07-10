import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Logo preview",
  robots: { index: false, follow: false },
};

const samples = [
  {
    id: "official",
    title: "Your logo (live on site)",
    subtitle: "From your ChatGPT design — header, login, favicon",
    src: "/brand/civiclens-logo.png",
    width: 1200,
    height: 630,
  },
  {
    id: "icon",
    title: "Icon mark",
    subtitle: "Favicon and compact uses",
    src: "/brand/civiclens-icon.png",
    width: 512,
    height: 512,
  },
  {
    id: "header",
    title: "Header crop",
    subtitle: "Used in top navigation bar",
    src: "/brand/civiclens-logo-header.png",
    width: 864,
    height: 454,
  },
];

export default function LogoPreviewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 pb-16">
      <h1 className="text-2xl font-bold text-stone-900">CivicLens logo samples</h1>
      <p className="mt-2 text-sm text-stone-600">
        Your ChatGPT logo is now applied across the site. Use this page to verify assets.
      </p>

      <div className="mt-8 space-y-10">
        {samples.map((sample) => (
          <section
            key={sample.id}
            className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-stone-900">{sample.title}</h2>
            <p className="text-sm text-stone-500">{sample.subtitle}</p>
            <div className="mt-4 flex justify-center rounded-xl bg-stone-50 p-6">
              <Image
                src={sample.src}
                alt={sample.title}
                width={sample.width}
                height={sample.height}
                className="max-h-80 w-auto object-contain"
                unoptimized
              />
            </div>
            <p className="mt-3 text-center text-xs text-stone-400">
              Direct link:{" "}
              <a href={sample.src} className="text-orange-600 underline" target="_blank" rel="noreferrer">
                {sample.src}
              </a>
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
        <p className="font-semibold">What to reply</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>&quot;Use Sample 1 for header and favicon&quot;</li>
          <li>&quot;Use Sample 2 on login page&quot;</li>
          <li>&quot;Remove tagline&quot; / &quot;Make orange darker&quot; / etc.</li>
        </ul>
      </div>
    </div>
  );
}
